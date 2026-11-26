# Bakar ihop riktiga Esri World Imagery satellitbrickor (zoom 17) exakt över varje stads tile_bounds
# Sparas i godot/assets/maps_sat/<city_id>.jpg så varje 3D-hus får sin RIKTIGA fotorealistiska taktextur!

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Net.Http

$root = Split-Path -Parent $PSScriptRoot
$citiesJson = Get-Content (Join-Path $root "data\cities.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$mapsDir = Join-Path $root "data\maps"
$outDir = Join-Path $root "assets\maps_sat"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$handler = New-Object System.Net.Http.HttpClientHandler
$client = New-Object System.Net.Http.HttpClient($handler)
$client.DefaultRequestHeaders.Add("User-Agent", "Globetrotter3DSatRoofBaker/1.0")
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

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 84L)

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

    Write-Host "[SAT ROOFS] $cid ($cols x $rows tiles = ${bmpW}x${bmpH}px)..."
    $bmp = New-Object System.Drawing.Bitmap($bmpW, $bmpH)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.Clear([System.Drawing.Color]::FromArgb(145, 118, 98))

    for ($tx = $tx0; $tx -le $tx1; $tx++) {
        for ($ty = $ty0; $ty -le $ty1; $ty++) {
            $url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${Z}/${ty}/${tx}"
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
                Write-Warning "  Sat tile $tx,$ty failed: $($_.Exception.Message)"
            }
        }
    }

    $bmp.Save($outFile, $jpegCodec, $encParams)
    $gfx.Dispose()
    $bmp.Dispose()
    $kb = [Math]::Round((Get-Item $outFile).Length / 1024)
    Write-Host "  -> Saved maps_sat/$cid.jpg ($kb KB)"
}

Write-Host "ALL 18 SATELLITE ROOF TEXTURES BAKED!"
