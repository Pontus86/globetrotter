// Globetrotter - 2-Spelare Online Multiplayer (WebRTC via PeerJS, 0 egen server!)
// Stöder 4-siffrig rumskod, delade slumpade passmål, realtidsposition på 3D-jordgloben,
// först-på-plats-bonus på världsarv och direkt duellseger.

(function () {
  'use strict';

  const PREFIX = 'globetrotter-duel-';

  const MP = {
    active: false,
    role: null, // 'host' | 'guest'
    roomCode: null,
    peer: null,
    conn: null,
    opponent: null, // { name, city, activeWonder, day, cash, stamps, doneWonders, competencies, goalsDone, goalsTotal, questionsCorrect, accuracy, travelHistory, won }
    claimedWonders: new Set(),
    jobRecords: {}, // "city_jobIdx" -> { holder, score, max, jobTitle }
    pendingChallenge: null, // { fromName, q, a, explain, img }
    callbacks: {},

    isAvailable() {
      return typeof window.Peer === 'function';
    },

    disconnect() {
      try { if (this.conn) this.conn.close(); } catch (e) {}
      try { if (this.peer) this.peer.destroy(); } catch (e) {}
      this.active = false;
      this.role = null;
      this.roomCode = null;
      this.peer = null;
      this.conn = null;
      this.opponent = null;
      this.claimedWonders = new Set();
      this.jobRecords = {};
      this.pendingChallenge = null;
    },

    createRoom(myName, sharedGoals, callbacks = {}) {
      this.disconnect();
      if (!this.isAvailable()) {
        if (callbacks.onError) callbacks.onError('PeerJS kunde inte laddas (kräver internetuppkoppling).');
        return;
      }
      this.role = 'host';
      this.callbacks = callbacks;
      this.roomCode = String(1000 + Math.floor(Math.random() * 9000));
      const peerId = PREFIX + this.roomCode;

      try {
        const peer = new window.Peer(peerId);
        this.peer = peer;

        peer.on('open', () => {
          if (callbacks.onRoomOpen) callbacks.onRoomOpen(this.roomCode);
        });

        peer.on('connection', (conn) => {
          if (this.conn) {
            try { conn.close(); } catch (e) {}
            return;
          }
          this.conn = conn;
          this.wireConnection(conn, () => {
            // Skicka delade passmål och startsignal direkt till gästen
            this.sendRaw({
              type: 'INIT_GAME',
              goals: sharedGoals,
              hostName: myName
            });
            this.active = true;
            if (callbacks.onMatchStart) callbacks.onMatchStart(sharedGoals);
          });
        });

        peer.on('error', (err) => {
          if (callbacks.onError) callbacks.onError(`Anslutningsfel: ${err.type || err.message || err}`);
        });
      } catch (e) {
        if (callbacks.onError) callbacks.onError('Kunde inte starta online-rum.');
      }
    },

    joinRoom(code, myName, callbacks = {}) {
      this.disconnect();
      if (!this.isAvailable()) {
        if (callbacks.onError) callbacks.onError('PeerJS kunde inte laddas (kräver internetuppkoppling).');
        return;
      }
      const cleanCode = String(code || '').replace(/\D/g, '').slice(0, 4);
      if (cleanCode.length !== 4) {
        if (callbacks.onError) callbacks.onError('Skriv in en 4-siffrig rumskod (t.ex. 4821).');
        return;
      }
      this.role = 'guest';
      this.roomCode = cleanCode;
      this.callbacks = callbacks;

      try {
        const peer = new window.Peer();
        this.peer = peer;

        peer.on('open', () => {
          const conn = peer.connect(PREFIX + cleanCode, { reliable: true });
          this.conn = conn;
          this.wireConnection(conn, () => {
            this.sendRaw({ type: 'HELLO', guestName: myName });
          });
        });

        peer.on('error', (err) => {
          if (callbacks.onError) callbacks.onError(`Kunde inte ansluta till rum ${cleanCode}: ${err.type || err.message || err}`);
        });
      } catch (e) {
        if (callbacks.onError) callbacks.onError('Kunde inte ansluta till online-rum.');
      }
    },

    wireConnection(conn, onOpen) {
      conn.on('open', () => {
        if (onOpen) onOpen();
      });

      conn.on('data', (msg) => {
        if (!msg || typeof msg !== 'object') return;
        if (msg.type === 'HELLO') {
          this.opponent = this.opponent || { name: msg.guestName || 'Spelare 2', city: 'malmo', day: 1, stamps: 0, doneWonders: 0, travelHistory: [] };
          this.opponent.name = msg.guestName || this.opponent.name;
          if (this.callbacks.onOpponentUpdate) this.callbacks.onOpponentUpdate(this.opponent);
        } else if (msg.type === 'INIT_GAME') {
          this.active = true;
          this.opponent = { name: msg.hostName || 'Spelare 1', city: 'malmo', day: 1, stamps: 0, doneWonders: 0, travelHistory: [] };
          if (this.callbacks.onMatchStart) this.callbacks.onMatchStart(msg.goals);
        } else if (msg.type === 'SNAPSHOT') {
          this.opponent = msg.data;
          if (this.callbacks.onOpponentUpdate) this.callbacks.onOpponentUpdate(this.opponent);
        } else if (msg.type === 'WONDER_CLAIMED') {
          this.claimedWonders.add(msg.wonderId);
          if (this.callbacks.onEvent) this.callbacks.onEvent(msg);
        } else if (msg.type === 'JOB_RECORD') {
          this.jobRecords[msg.key] = { holder: msg.holder, score: msg.score, max: msg.max, jobTitle: msg.jobTitle, cityName: msg.cityName };
          if (this.callbacks.onEvent) this.callbacks.onEvent(msg);
        } else if (msg.type === 'CHALLENGE_Q') {
          this.pendingChallenge = msg.challenge;
          if (this.callbacks.onEvent) this.callbacks.onEvent(msg);
        } else if (msg.type === 'CHALLENGE_RESULT') {
          if (this.callbacks.onEvent) this.callbacks.onEvent(msg);
        } else if (msg.type === 'VICTORY') {
          this.opponent = msg.data || this.opponent;
          if (this.callbacks.onOpponentVictory) this.callbacks.onOpponentVictory(this.opponent);
        } else if (msg.type === 'NOTICE') {
          if (this.callbacks.onEvent) this.callbacks.onEvent(msg);
        }
      });

      conn.on('close', () => {
        if (this.active && this.callbacks.onDisconnect) {
          this.callbacks.onDisconnect();
        }
        this.active = false;
      });
    },

    sendRaw(obj) {
      if (this.conn && this.conn.open) {
        try { this.conn.send(obj); } catch (e) {}
      }
    },

    sendSnapshot(data) {
      if (!this.active) return;
      this.sendRaw({ type: 'SNAPSHOT', data });
    },

    sendNotice(text) {
      if (!this.active) return;
      this.sendRaw({ type: 'NOTICE', text });
    },

    claimWonder(wonderId, wonderName, playerName) {
      if (!this.active) return true;
      if (this.claimedWonders.has(wonderId)) return false;
      this.claimedWonders.add(wonderId);
      this.sendRaw({ type: 'WONDER_CLAIMED', wonderId, wonderName, playerName });
      return true;
    },

    postJobRecord(key, holder, score, max, jobTitle, cityName) {
      if (!this.active) return { beatOpponent: false };
      const prev = this.jobRecords[key];
      const beatOpponent = Boolean(prev && prev.holder !== holder && score > prev.score);
      if (!prev || score > prev.score) {
        this.jobRecords[key] = { holder, score, max, jobTitle, cityName };
        this.sendRaw({ type: 'JOB_RECORD', key, holder, score, max, jobTitle, cityName, beatOpponent });
      }
      return { beatOpponent, prev };
    },

    sendChallenge(challenge) {
      if (!this.active) return;
      this.sendRaw({ type: 'CHALLENGE_Q', challenge });
    },

    sendChallengeResult(opponentGotItRight, responderName, qText) {
      if (!this.active) return;
      this.sendRaw({ type: 'CHALLENGE_RESULT', opponentGotItRight, responderName, qText });
    },

    sendVictory(data) {
      if (!this.active) return;
      this.sendRaw({ type: 'VICTORY', data });
    }
  };

  window.GT_MP = MP;
})();
