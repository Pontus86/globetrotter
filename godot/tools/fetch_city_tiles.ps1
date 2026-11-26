# Bakar ihop riktiga OpenStreetMap / Carto Voyager kartbrickor (zoom 16) till 1 högupplöst JPG per stad
# samt sparar exakta lokala meter-koordinater (tile_bounds) i godot/data/maps/<city_id>.json så husen linjerar på millimetern!

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Net.Http

$root = Split-Path -Parent $PSScriptRoot
$citiesJson = Get-Content (Join-Path $root "data\cities.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$mapsDir = Join-Path $root "data\maps"
$outDir = Join-Path $root "assets\maps"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$handler = New-Object System.Net.Http.HttpClientHandler
$client = New-Object System.Net.Http.HttpClient($handler)
$client.DefaultRequestHeaders.Add("User-Agent", "Globetrotter3DMapBaker/1.0")
$client.Timeout = [TimeSpan]::FromSeconds(20)

$Z = 17
$N = [Math]::Pow(2, $Z)

function LonToTileX([double]$lon) {
    return [int][Math]::Floor(($lon + 180.0) / 360.0 * $N)
}
function LatToTileY([double]$lat) {
    $rad = $lat * [Math]::PI / 180.0
    return [int][Math]::Floor((1.0 - [Math]::Log([Math]::Tan($rad) + 1.0 / [Math]::Cos($rad)) / [Math]::PI) / 2.0 * $N)
}
function TileXToLon([double]$x) {
    return $x / $N * 360.0 - 180.0
}
function TileYToLat([double]$y) {
    $n2 = [Math]::PI - 2.0 * [Math]::PI * $y / $N
    return (180.0 / [Math]::PI) * [Math]::Atan(0.5 * ([Math]::Exp($n2) - [Math]::Exp(-$n2)))
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 88L)

foreach ($prop in $citiesJson.cities.PSObject.Properties) {
    $cid = $prop.Name
    $city = $prop.Value
    $mapFile = Join-Path $mapsDir "$cid.json"
    $outFile = Join-Path $outDir "$cid.jpg"
    if (-not (Test-Path $mapFile)) { continue }

    $osm = Get-Content $mapFile -Raw -Encoding UTF8 | ConvertFrom-Json
    $cLon = [double]$city.center[0]
    $cLat = [double]$city.center[1]
    $cosLat = [Math]::Max(0.25, [Math]::Cos($cLat * [Math]::PI / 180.0))

    $minX = [double]$osm.bounds[0] - 120.0
    $maxX = [double]$osm.bounds[1] + 120.0
    $minZ = [double]$osm.bounds[2] - 120.0
    $maxZ = [double]$osm.bounds[3] + 120.0

    $westLon = $cLon + $minX / (111320.0 * $cosLat)
    $eastLon = $cLon + $maxX / (111320.0 * $cosLat)
    $northLat = $cLat - $minZ / 111320.0
    $southLat = $cLat - $maxZ / 111320.0

    $tx0 = LonToTileX $westLon
    $tx1 = LonToTileX $eastLon
    $ty0 = LatToTileY $northLat
    $ty1 = LatToTileY $southLat

    $cols = ($tx1 - $tx0) + 1
    $rows = ($ty1 - $ty0) + 1
    $tilePx = 256
    $bmpW = $cols * $tilePx
    $bmpH = $rows * $tilePx

    Write-Host "[BAKE] $cid ($cols x $rows tiles = ${bmpW}x${bmpH}px)..."
    $bmp = New-Object System.Drawing.Bitmap($bmpW, $bmpH)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.Clear([System.Drawing.Color]::FromArgb(232, 227, 216))

    $subdomains = @("a", "b", "c", "d")
    $idx = 0
    for ($tx = $tx0; $tx -le $tx1; $tx++) {
        for ($ty = $ty0; $ty -le $ty1; $ty++) {
            $sub = $subdomains[$idx % 4]
            $idx++
            $url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${Z}/${ty}/${tx}"
            try {
                $bytes = $client.GetByteArrayAsync($url).GetAwaiter().GetResult()
                $ms = New-Object System.IO.MemoryStream(,$bytes)
                $tileImg = [System.Drawing.Image]::FromStream($ms)
                $px = ($tx - $tx0) * $tilePx
                $py = ($ty - $ty0) * $tilePx
                $gfx.DrawImage($tileImg, $px, $py, $tilePx, $tilePx)
                $tileImg.Dispose()
                $ms.Dispose()
            } catch {
                Write-Warning "  Tile $tx,$ty failed: $($_.Exception.Message)"
            }
        }
    }

    $bmp.Save($outFile, $jpegCodec, $encParams)
    $gfx.Dispose()
    $bmp.Dispose()

    # Exakta lokala meter-koordinater för hela den ihopsydda kartbilden!
    $actualWestLon = TileXToLon $tx0
    $actualEastLon = TileXToLon ($tx1 + 1)
    $actualNorthLat = TileYToLat $ty0
    $actualSouthLat = TileYToLat ($ty1 + 1)

    $tbMinX = [Math]::Round(($actualWestLon - $cLon) * 111320.0 * $cosLat, 2)
    $tbMaxX = [Math]::Round(($actualEastLon - $cLon) * 111320.0 * $cosLat, 2)
    $tbMinZ = [Math]::Round(-($actualNorthLat - $cLat) * 111320.0, 2)
    $tbMaxZ = [Math]::Round(-($actualSouthLat - $cLat) * 111320.0, 2)

    if ($osm.PSObject.Properties["tile_bounds"]) {
        $osm.tile_bounds = @($tbMinX, $tbMaxX, $tbMinZ, $tbMaxZ)
    } else {
        $osm | Add-Member -NotePropertyName "tile_bounds" -NotePropertyValue @($tbMinX, $tbMaxX, $tbMinZ, $tbMaxZ)
    }
    $osm | ConvertTo-Json -Depth 6 -Compress | Set-Content -Path $mapFile -Encoding UTF8
    $kb = [Math]::Round((Get-Item $outFile).Length / 1024)
    Write-Host "  -> Saved $cid.jpg ($kb KB | bounds: [$tbMinX, $tbMaxX, $tbMinZ, $tbMaxZ])"
}

Write-Host "ALL 18 CITY MAP TEXTURES BAKED!"
