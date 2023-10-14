import {useEffect, useState} from 'react';
import io from 'socket.io-client'
import Fader from '../components/Fader'
let socket

const Home = () => {
  const [volume, setVolume] = useState(50);
  const [state, setState] = useState(0);
  const [mute, setMute] = useState(0);
  useEffect(() => {
    socketInitializer();
  },[]);
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected');
      console.log('내 소켓 ID:', socket.id);
      socket.emit('getVolume');
      socket.emit('getState');
      socket.emit('getMute');
    })

    socket.on('stateChanged', newState => {
      console.log(newState)
      setState(newState);
    });

    socket.on('volumeChanged', newVolume => {
      console.log(newVolume)
      setVolume(newVolume);
    });

    socket.on('muteChanged', newMute => {
      setMute(newMute);
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

  const handleMuteChange = () => {
    if(mute===0) {
      socket.emit('changeMute', 1);
    }
    else {
      socket.emit('changeMute', 0);
    }
  };

  return (
    <div className="grid-container">
      <div className="left-column">
        <Fader currentVolume={volume} onVolumeChange={handleVolumeChange} />
        <button className={`button mute-button row ${mute===1 ? 'mute-active' : 'mute-inactive'}`} onClick={handleMuteChange} >{mute===1 ? "음소거" : "음소거 해제"}</button>
      </div>
      <div className="right-column">
        <div className='volume-text row'>{volume.toFixed(0)}</div>
        {/* <div className='state-text row'>{state===0 ? }</div> */}
        <button className="button play-button row" onClick={handleStateChange}>{state===1 ? <div className="red fas fa-pause"/> : <div className="green fas fa-play"/>}</button>
      </div>
    </div>
  )
}

export default Home;
