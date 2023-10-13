import { Server } from 'socket.io'
import fs from 'fs/promises';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    // 클라이언트에서 'changeVolume' 이벤트를 수신하여 볼륨값 변경
    io.on('connection', (socket) => {
      socket.on('changeVolume', async (newVolume) => {
        try {
          // 1) volume.txt 파일을 읽어서 현재 볼륨값을 가져옴
          const filePath = './pages/api/volume.txt';
          const currentVolume = parseFloat(await fs.readFile(filePath, 'utf-8'));

          // 2) 새로운 볼륨값을 파일에 쓰고 클라이언트에게 알림
          await fs.writeFile(filePath, newVolume.toString());
          // 3) 수정된 볼륨값을 클라이언트에게 보내줌
          socket.emit('volumeChanged', newVolume);
        } catch (error) {
          console.error('Error:', error);
        }
      });
      socket.on('getVolume', async () => {
        try {
          // volume.txt 파일을 읽어서 현재 볼륨값을 가져옴
          const filePath = './pages/api/volume.txt';
          const currentVolume = parseFloat(await fs.readFile(filePath, 'utf-8'));

          // 현재 볼륨값을 클라이언트에게 보내줌
          socket.emit('volumeReceived', currentVolume);
        } catch (error) {
          console.error('Error:', error);
        }
      });
      socket.on('changeState', async (newState) => {
        try {
          const filePath = './pages/api/state.txt';
          const currentState = parseInt(await fs.readFile(filePath, 'utf-8'));
          await fs.writeFile(filePath, newState.toString());
          socket.emit('stateChanged', newState);
        } catch (error) {
          console.error('Error:', error);
        }
      });
      socket.on('getState', async () => {
        try {
          const filePath = './pages/api/state.txt';
          const currentVolume = parseInt(await fs.readFile(filePath, 'utf-8'));
          socket.emit('stateReceived', currentVolume);
        } catch (error) {
          console.error('Error:', error);
        }
      })
    });
  }
  res.end()
}

export default SocketHandler