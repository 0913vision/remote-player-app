import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/Fader.module.css'

const Fader = ({ currentVolume = 50, onVolumeChange }) => {
  // const [volume, setVolume] = useState(currentVolume);
  const [faderHeight, setFaderHeight] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);

  const faderRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    setFaderHeight(faderRef.current.clientHeight);
    setThumbHeight(thumbRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    // setVolume(currentVolume);
    console.log(currentVolume)
  }, [currentVolume]);

  const handleMove = (clientY) => {
    const { top, height } = faderRef.current.getBoundingClientRect();
    const thumbHeight = thumbRef.current.offsetHeight;
  
    let relativePosition = clientY - top - thumbHeight / 2;
  
    // 바운더리 확인
    if (relativePosition < 0) relativePosition = 0;
    if (relativePosition > height - thumbHeight) relativePosition = height - thumbHeight;
  
    const newVolume = 100 - (relativePosition / (height - thumbHeight)) * 100;
    // setVolume(newVolume);
    onVolumeChange && onVolumeChange(newVolume);
  };


  const handleMouseDown = (e) => {
    e.preventDefault();

    const { top, bottom } = thumbRef.current.getBoundingClientRect();

    if (e.clientY >= top && e.clientY <= bottom) {  // Thumb 안에서만 드래그 시작
      handleMove(e.clientY);
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleDrag);
      });
    }
  };

  const handleTouchStart = (e) => {
    const { top, bottom } = thumbRef.current.getBoundingClientRect();

    if (e.touches[0].clientY >= top && e.touches[0].clientY <= bottom) {
      handleMove(e.touches[0].clientY);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', handleTouchMove);
      });
    }
  };

  const handleDrag = (e) => {
    handleMove(e.clientY);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientY);
  };

  return (
    <div 
      ref={faderRef} 
      className={styles.faderContainer}
      onMouseDown={handleMouseDown} 
      onTouchStart={handleTouchStart}
    >
      <div 
        ref={thumbRef} 
        className={styles.thumb}
        style={{ 
          bottom: `${(currentVolume / 100) * (faderHeight - thumbHeight)}px`
        }}
      ></div>
    </div>
  );
};

export default Fader;
