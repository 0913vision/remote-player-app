import {useEffect, useState} from 'react';
import io from 'socket.io-client'
import Fader from '../components/Fader'
let socket

const Home = () => {
  const [volume, setVolume] = useState(50);
  const [state, setState] = useState(0);
  useEffect(() => {
    socketInitializer();
  },[]);
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected');
      socket.emit('getVolume');
      socket.emit('getState');
    })

    socket.on('stateReceived', newState => {
      setState(newState);
      socket.off('stateReceived');
    })

    socket.on('volumeReceived', newVolume => {
      setVolume(newVolume);
      socket.off('volumeReceived');
    })

    socket.on('stateChanged', newState => {
      console.log(newState)
      setState(newState);
    });

    socket.on('volumeChanged', newVolume => {
      setVolume(newVolume);
    });
  }
  const handleVolumeChange = (newVolume) => {
    socket.emit('changeVolume', newVolume);
  };
  const handleStateChange = () => {
    if(state===0) {
      socket.emit('changeState', 1);
    }
    else {
      socket.emit('changeState', 0);
    }
  };

  return (
    <div>
      <Fader currentVolume={volume} onVolumeChange={handleVolumeChange} />
      <p>Current Volume: {volume.toFixed(2)}</p>
      <p>{state===0 ? "재생중이 아님" : "재생중"}</p>
      <button onClick={handleStateChange}>{state===0 ? "재생" : "정지"}</button>
    </div>
  )
}

export default Home;