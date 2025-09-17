import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { 
  SOCKET_CONFIG, 
  SOCKET_EVENTS, 
  PLAYER_STATE, 
  MUTE_STATE
} from '@/constants/socketConfig';
import { PLAYER_INITIAL_STATE } from '@/constants/playerDefaults';

const useSocket = () => {
  const [playerState, setPlayerState] = useState(PLAYER_INITIAL_STATE);
  const socketRef = useRef(null);

  // =========================
  // Socket Management Layer
  // =========================
  const socketManager = {
    // Socket wrapper methods
    server: {
      send: (event, ...args) => {
        if (!socketRef.current) return;
        socketRef.current.emit(event, ...args);
      },
      receive: (event, callback) => {
        if (!socketRef.current) return;
        socketRef.current.on(event, callback);
      }
    },

    // Socket lifecycle
    initialize: async () => {
      socketRef.current = io(SOCKET_CONFIG.SOCKET_PATH);

      socketManager.setupEventListeners();
    },

    setupEventListeners: () => {
      const { server } = socketManager;

      server.receive('connect', () => {
        console.log('connected');
        // Request initial states
        const initialRequests = [
          SOCKET_EVENTS.C2S_GET_VOLUME_EVENT,
          SOCKET_EVENTS.C2S_GET_STATE_EVENT,
          SOCKET_EVENTS.C2S_GET_MUTE_EVENT,
          SOCKET_EVENTS.C2S_GET_CURRENT_SONG_EVENT,
          SOCKET_EVENTS.C2S_GET_LOCK_EVENT
        ];
        
        initialRequests.forEach(event => {
          server.send(event);
        });
      });

      server.receive(SOCKET_EVENTS.S2C_STATE_CHANGED_EVENT, newState => {
        setPlayerState(prev => ({ ...prev, state: newState }));
      });

      server.receive(SOCKET_EVENTS.S2C_VOLUME_CHANGED_EVENT, newVolume => {
        setPlayerState(prev => ({ ...prev, volume: newVolume }));
      });

      server.receive(SOCKET_EVENTS.S2C_MUTE_CHANGED_EVENT, newMute => {
        setPlayerState(prev => ({ ...prev, mute: newMute }));
      });

      server.receive(SOCKET_EVENTS.S2C_SONG_CHANGED_EVENT, (newSong) => {
        setPlayerState(prev => ({ ...prev, currentSong: newSong }));
      });

      server.receive(SOCKET_EVENTS.S2C_LOCK_CHANGED_EVENT, (newLock) => {
        setPlayerState(prev => ({ ...prev, lock: newLock }));
      });
    },

    cleanup: () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    }
  };

  // =========================
  // React Lifecycle
  // =========================
  useEffect(() => {
    socketManager.initialize();
    return socketManager.cleanup;
  }, []);

  // =========================
  // UI Event Handlers
  // =========================
  const handlers = {
    songChange: (newSong) => {
      if (playerState.currentSong === newSong) return;
      socketManager.server.send(SOCKET_EVENTS.C2S_CHANGE_SONG_EVENT, playerState.currentSong, newSong);
    },

    volumeChange: (newVolume) => {
      socketManager.server.send(SOCKET_EVENTS.C2S_CHANGE_VOLUME_EVENT, newVolume);
    },

    stateChange: () => {
      const newState = playerState.state === PLAYER_STATE.PAUSED 
        ? PLAYER_STATE.PLAYING 
        : PLAYER_STATE.PAUSED;
      socketManager.server.send(SOCKET_EVENTS.C2S_CHANGE_STATE_EVENT, newState);
    },

    muteChange: () => {
      const newMute = playerState.mute === MUTE_STATE.UNMUTED 
        ? MUTE_STATE.MUTED 
        : MUTE_STATE.UNMUTED;
      socketManager.server.send(SOCKET_EVENTS.C2S_CHANGE_MUTE_EVENT, newMute);
    }
  };

  // =========================
  // Hook Return Interface
  // =========================
  return {
    playerState,
    handleSongChange: handlers.songChange,
    handleVolumeChange: handlers.volumeChange,
    handleStateChange: handlers.stateChange,
    handleMuteChange: handlers.muteChange
  };
};

export default useSocket;