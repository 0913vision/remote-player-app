import { useEffect } from 'react';
import Fader from '@/components/Fader';
import useSocket from '@/hooks/useSocket';
import { SONG_TYPE } from '@/constants/socketConfig';

const Home = () => {
  const {
    playerState,
    handleSongChange,
    handleVolumeChange,
    handleStateChange,
    handleMuteChange
  } = useSocket();

  useEffect(() => {
    const preventDefaultTouchMove = (e) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventDefaultTouchMove, { passive: false });
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="main-grid">
        <div className="grid-item record-container">
          <div className={`pulse ${playerState.state === 1 ? "pulse1" : ""}`}></div>
          <div className={`pulse ${playerState.state === 1 ? "pulse2" : ""}`}></div>
          <div className={`image-container ${playerState.state === 1 ? "rotated" : ""}`}>
            <img className={`record ${playerState.state === 1 ? "rotating" : ""}`} src="/record.svg" alt="CD" />
          </div>
        </div>
        
        <div className="grid-item song-selection">
          <div className={`song-option ${playerState.currentSong === SONG_TYPE.SLOW ? 'active' : ''}`}>
            <div className="checkbox">{playerState.currentSong === SONG_TYPE.SLOW ? '✓' : ''}</div>
            <button className="song-button" onClick={() => handleSongChange(SONG_TYPE.SLOW)} disabled={playerState.lock}>
              잔잔한 음악
            </button>
          </div>
          <div className={`song-option ${playerState.currentSong === SONG_TYPE.FAST ? 'active' : ''}`}>
            <div className="checkbox">{playerState.currentSong === SONG_TYPE.FAST ? '✓' : ''}</div>
            <button className="song-button" onClick={() => handleSongChange(SONG_TYPE.FAST)} disabled={playerState.lock}>
              통성기도 음악
            </button>
          </div>
        </div>
        
        <div className="grid-item volume-controls">
          <Fader currentVolume={playerState.volume} onVolumeChange={handleVolumeChange} isDisabled={playerState.lock}/>
          {/* <button className={`button mute-button ${playerState.mute === 1 ? 'mute-active' : ''}`} onClick={handleMuteChange}>
            {playerState.mute === 1 ? "음소거 해제" : "음소거"}
          </button> */}
        </div>
        
        <div className="grid-item playback-controls">
          <button className="button refresh-button" onClick={handleRefresh}>
            <i className="fas fa-sync-alt"></i>
          </button>
          <div className='volume-text'>{playerState.volume.toFixed(0)}</div>
          <button className="button play-button" onClick={handleStateChange} disabled={playerState.lock}>
            {playerState.state === 1 ? <div className="fas fa-pause"/> : <div className="fas fa-play"/>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home;
