import {useEffect, useState} from 'react';
import io from 'socket.io-client'
import Fader from '../components/Fader'

let socket;

const Home = () => {
  const [volume, setVolume] = useState(50);
  const [state, setState] = useState(0);
  const [mute, setMute] = useState(0);
  const [currentSong, setCurrentSong] = useState('slow');
  useEffect(() => {
    socketInitializer();
    const preventDefaultTouchMove = (e) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventDefaultTouchMove, { passive: false });
  },[]);
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected');
      // console.log('내 소켓 ID:', socket.id);
      socket.emit('getVolume');
      socket.emit('getState');
      socket.emit('getMute');
      socket.emit('getCurrentSong');
    })

    socket.on('stateChanged', newState => {
      // console.log(newState)
      setState(newState);
    });

    socket.on('volumeChanged', newVolume => {
      // console.log(newVolume)
      setVolume(newVolume);
    });

    socket.on('muteChanged', newMute => {
      setMute(newMute);
    });

    socket.on('songChanged', (newSong) => {
      console.log(newSong);
      setCurrentSong(newSong);
    });
    
  }
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSongChange = (newSong) => {
    if (currentSong === newSong) return;
    socket.emit('changeSong', currentSong, newSong);
    socket.emit('changeState', 0);
    if (newSong === 'fast') {
      socket.emit('changeVolume', 35);
    }
    else if (newSong === 'slow') {
      socket.emit('changeVolume', 50);
    }
  };

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
    <div className="container">
      <div className="main-grid">
        <div className="grid-item record-container">
          <div className={`pulse ${state === 1 ? "pulse1" : ""}`}></div>
          <div className={`pulse ${state === 1 ? "pulse2" : ""}`}></div>
          <div className={`image-container ${state === 1 ? "rotated" : ""}`}>
            <img className={`record ${state === 1 ? "rotating" : ""}`} src="/record.svg" alt="CD" />
          </div>
        </div>
        
        <div className="grid-item song-selection">
          <div className={`song-option ${currentSong === 'slow' ? 'active' : ''}`}>
            <div className="checkbox">{currentSong === 'slow' ? '✓' : ''}</div>
            <button className="song-button" onClick={() => handleSongChange('slow')}>
              잔잔한 음악
            </button>
          </div>
          <div className={`song-option ${currentSong === 'fast' ? 'active' : ''}`}>
            <div className="checkbox">{currentSong === 'fast' ? '✓' : ''}</div>
            <button className="song-button" onClick={() => handleSongChange('fast')}>
              통성기도 음악
            </button>
          </div>
        </div>
        
        <div className="grid-item volume-controls">
          <Fader currentVolume={volume} onVolumeChange={handleVolumeChange} />
          {/* <button className={`button mute-button ${mute === 1 ? 'mute-active' : ''}`} onClick={handleMuteChange}>
            {mute === 1 ? "음소거 해제" : "음소거"}
          </button> */}
        </div>
        
        <div className="grid-item playback-controls">
          <button className="button refresh-button" onClick={handleRefresh}>
            <i className="fas fa-sync-alt"></i>
          </button>
          <div className='volume-text'>{volume.toFixed(0)}</div>
          <button className="button play-button" onClick={handleStateChange}>
            {state === 1 ? <div className="fas fa-pause"/> : <div className="fas fa-play"/>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home;
