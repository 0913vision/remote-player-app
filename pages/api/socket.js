import { Server } from 'socket.io'
// import fs from 'fs/promises';
import { pause, resume, setVolume } from './player';

const initailConfig = {
  serverVolume: 50,
  muted: 0,
  state: 0
};

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    let currentConfig = {...initailConfig};
    setVolume(currentConfig.serverVolume);

    // 클라이언트에서 'changeVolume' 이벤트를 수신하여 볼륨값 변경
    io.on('connection', (socket) => {
      socket.on('changeVolume', async (newVolume) => {
        try {
          currentConfig = {
            ...currentConfig,
            serverVolume: newVolume,
          };
          setVolume(newVolume)
          io.emit('volumeChanged', newVolume);
        } catch (error) {
          console.error('Error:', error);
        }
      });
      socket.on('getVolume', async () => {
        try {
          socket.emit('volumeChanged', currentConfig.serverVolume);
        } catch (error) {
          console.error('Error:', error);
        }
      });

      socket.on('changeState', async (newState) => {
        try {
          currentConfig = {
            ...currentConfig,
            state: newState,
          };
          newState===1 ? resume() : pause() ;
          io.emit('stateChanged', newState);
        } catch (error) {
          console.error('Error:', error);
        }
      });
      socket.on('getState', async () => {
        try {
          socket.emit('stateChanged', currentConfig.state);
        } catch (error) {
          console.error('Error:', error);
        }
      })

      socket.on('changeMute', async (newMute) => {
        try {
          currentConfig = {
            ...currentConfig,
            muted: newMute,
          };
          newMute===0 ? setVolume(currentConfig.serverVolume) : setVolume(0);
          io.emit('muteChanged', newMute);
          
        } catch (error) {
          console.error('Error:', error);
        }
      });
      socket.on('getMute', async () => {
        try {
          socket.emit('muteChanged', currentConfig.muted);
        } catch (error) {
          console.error('Error:', error);
        }
      })
    });
  }
  res.end()
}

export default SocketHandler