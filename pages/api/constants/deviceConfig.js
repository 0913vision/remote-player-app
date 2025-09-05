// Device hardware configuration
export const DEVICE_CONFIG = {
  // MPV library paths for different platforms
  MPV_LIBRARY_PATH: {
    MAC: '/opt/homebrew/lib/libmpv.dylib',
    RASPBERRY_PI: '/lib/arm-linux-gnueabihf/libmpv.so'
  },
  
  // Current platform (change as needed)
  CURRENT_PLATFORM: 'MAC', // 'MAC' or 'RASPBERRY_PI'
  
  // Audio file playlist
  PLAYLIST: [
    './pages/api/music_slow.mp3',
    './pages/api/music_fast.mp3'
  ],
  
  // Initial song times
  INITIAL_SONG_TIMES: {
    slow: 0.0,
    fast: 0.0
  }
};