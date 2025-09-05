import { Server } from 'socket.io';
import { SOCKET_CONFIG } from './constants/serverConfig';
import Player from './player/Player';
import NetworkLockManager from './lock/NetworkLockManager';
import { registerVolumeHandlers } from './handlers/volumeHandlers';
import { registerStateHandlers } from './handlers/stateHandlers';
import { registerSongHandlers } from './handlers/songHandlers';
import { registerMuteHandlers } from './handlers/muteHandlers';
import { registerConsoleHandlers } from './handlers/consoleHandlers';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    
    const io = new Server(res.socket.server, {
      path: SOCKET_CONFIG.SOCKET_PATH,
      cors: SOCKET_CONFIG.CORS,
    })
    res.socket.server.io = io
    global.io = io

    // Create single Player instance and NetworkLockManager
    const player = new Player();
    const lockManager = new NetworkLockManager(io);

    const pingInterval = setInterval(() => {
      io.emit('ping');
    }, SOCKET_CONFIG.PING_INTERVAL_MS);

    io.on('connection', (socket) => {
      // Register all handlers with Player and NetworkLockManager instances
      registerVolumeHandlers(socket, io, player);
      registerStateHandlers(socket, io, player, lockManager);
      registerSongHandlers(socket, io, player, lockManager);
      registerMuteHandlers(socket, io, player);
      registerConsoleHandlers(socket, io, player);
    });
  }
  res.end()
}

export default SocketHandler