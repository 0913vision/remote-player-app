import ffi from 'ffi-napi';
import ref from 'ref-napi';
import array from 'ref-array-napi';
// import StructType from 'ref-struct-napi';
import Struct from 'ref-struct-di';

const StringArray = array('string');
const libmpvPath = '/opt/homebrew/lib/libmpv.dylib'; // 맥
// const libmpvPath = '/lib/arm-linux-gnueabihf/libmpv.so'; // 라즈베리파이

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let currentSongTimes = { "slow": 0.0, "fast": 0.0 };
let currentSong = 'slow';

const StructType = Struct(ref);
const mpv_event = StructType({
  event_id: 'int',
  error: 'int',
  reply_userdata: 'uint64',
  data: 'pointer'
});

const mpv = ffi.Library(libmpvPath, {
  'mpv_create': ['pointer', []],
  'mpv_initialize': ['int', ['pointer']],
  'mpv_command': ['int', ['pointer', StringArray]],
  'mpv_set_option_string': ['int', ['pointer', 'string', 'string']],
  'mpv_set_property_string': ['int', ['pointer', 'string', 'string']],
  'mpv_get_property_string': ['string', ['pointer', 'string']],
  'mpv_command_async': ['int', ['pointer', 'uint64', StringArray]],
  'mpv_wait_event': [mpv_event, ['pointer', 'double']]
});



let userdataCounter = 0;

const MPV_EVENT_NONE = 0;
const MPV_EVENT_COMMAND_REPLY = 5;

const mpvHandle = mpv.mpv_create();
mpv.mpv_initialize(mpvHandle);
const playCommand = ["loadfile", "./pages/api/music_slow.mp3", null];

mpv.mpv_set_option_string(mpvHandle, "loop", "inf");
mpv.mpv_command(mpvHandle, playCommand);
mpv.mpv_set_property_string(mpvHandle, "pause", "yes");


const pause = () => {
  // console.log("pause called.");
  mpv.mpv_set_property_string(mpvHandle, "pause", "yes");
};

const resume = () => {
  // console.log("resume called.");
  mpv.mpv_set_property_string(mpvHandle, "pause", "no");
};

const setVolume = (volume) => {
  mpv.mpv_set_option_string(mpvHandle, "volume", volume.toString());
};

const changeSong = (currentSong, newSong) => {
  const getCurrentSongTime = () => {
    const response = mpv.mpv_get_property_string(mpvHandle, "playback-time");
    const currentTime = parseFloat(response);
    return currentTime;
  };

  const currentSongTime = getCurrentSongTime();
  // console.log(newSong, currentSongTimes[newSong]);
  currentSongTimes[currentSong] = currentSongTime;

  const songPath = newSong === 'slow' ? "./pages/api/music_slow.mp3" : "./pages/api/music_fast.mp3";
  const changeCommand = ["loadfile", songPath, "replace"];
  const timePosBuffer = ref.alloc('double', currentSongTimes[newSong]);

  // call mpv library

  mpv.mpv_command(mpvHandle, changeCommand);
  /*
  const expectedUserData = userdataCounter++;
  mpv.mpv_command_async(mpvHandle, expectedUserData, changeCommand);
  while (true) {
    let event = mpv.mpv_wait_event(mpvHandle, 1);
    console.log("event id: ", event.event_id);
    console.log("event data: ", event.reply_userdata);
    
    if (event.event_id === MPV_EVENT_COMMAND_REPLY && event.reply_userdata === expectedUserData) {
      console.log("Command completed:", commandArray);
      // mpv.mpv_set_property_string(mpvHandle, "playback-time", currentSongTimes[newSong].toString());
      break;
    }
  }
  */
};

const loadLastSongTime = (song) => {
  // setTimeout(() => {
do {
  mpv.mpv_set_property_string(mpvHandle, "playback-time", currentSongTimes[song].toString());
  // console.log(currentSongTimes[song].toString());
  } while (parseFloat(mpv.mpv_get_property_string(mpvHandle, "playback-time")) !== currentSongTimes[song]);
  // }, 100);
}

export { resume, pause, setVolume, changeSong, loadLastSongTime };
