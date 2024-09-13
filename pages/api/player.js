import ffi from 'ffi-napi';
import ref from 'ref-napi';
import array from 'ref-array-napi';
// import StructType from 'ref-struct-napi';
import Struct from 'ref-struct-di';

const StringArray = array('string');
// const libmpvPath = '/opt/homebrew/lib/libmpv.dylib'; // 맥
const libmpvPath = '/lib/arm-linux-gnueabihf/libmpv.so'; // 라즈베리파이

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
const playlist = ["./pages/api/music_slow.mp3", "./pages/api/music_fast.mp3"];
let currentTrackIndex = 0;
const playCommand = ["loadfile", playlist[currentTrackIndex], null];

// mpv.mpv_set_option_string(mpvHandle, "loop", "inf");
mpv.mpv_set_property_string(mpvHandle, "loop", "inf");
const nextTrack = (index) => {
  // currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  const nextCommand = ["loadfile", playlist[index], null];
  mpv.mpv_command(mpvHandle, nextCommand);
};

mpv.mpv_command(mpvHandle, playCommand);
mpv.mpv_set_property_string(mpvHandle, "pause", "yes");


const pause = async () => {
  const currentVolume = parseFloat(mpv.mpv_get_property_string(mpvHandle, "volume"));
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const volume = currentVolume * Math.cos((Math.PI / 2) * t);
    mpv.mpv_set_property_string(mpvHandle, "volume", volume.toString());
    await delay(100);
  }
  mpv.mpv_set_property_string(mpvHandle, "pause", "yes");
  mpv.mpv_set_property_string(mpvHandle, "volume", currentVolume.toString());
};

const resume = async () => {
  const currentVolume = parseFloat(mpv.mpv_get_property_string(mpvHandle, "volume"));
  mpv.mpv_set_property_string(mpvHandle, "volume", "0");
  mpv.mpv_set_property_string(mpvHandle, "pause", "no");
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const volume = currentVolume * Math.sin((Math.PI / 2) * t);
    mpv.mpv_set_property_string(mpvHandle, "volume", volume.toString());
    await delay(100);
  }
};

const setVolume = (volume) => {
  mpv.mpv_set_option_string(mpvHandle, "volume", volume.toString());
};

const changeSong = (currentSong, newSong) => {
  // const currentVolume = parseFloat(mpv.mpv_get_property_string(mpvHandle, "volume"));
  // mpv.mpv_set_property_string(mpvHandle, "volume", "0");
  const getCurrentSongTime = () => {
    const response = mpv.mpv_get_property_string(mpvHandle, "playback-time");
    const currentTime = parseFloat(response);
    return currentTime;
  };

  const currentSongTime = getCurrentSongTime();
  // console.log(newSong, currentSongTimes[newSong]);
  currentSongTimes[currentSong] = currentSongTime;

  // call mpv library

  if(newSong === "slow") {
    nextTrack(0);
  } else if(newSong === "fast") {
    nextTrack(1);
  }

  // mpv.mpv_command(mpvHandle, changeCommand);
  
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
