import ffi from 'ffi-napi';
import ref from 'ref-napi';
import array from 'ref-array-napi';

const StringArray = array('string');
const libmpvPath = '/opt/homebrew/lib/libmpv.dylib'; // 맥
// const libmpvPath = '/lib/arm-linux-gnueabihf/libmpv.so'; // 라즈베리파이

const mpv = ffi.Library(libmpvPath, {
  'mpv_create': ['pointer', []],
  'mpv_initialize': ['int', ['pointer']],
  'mpv_command': ['int', ['pointer', StringArray]],
  'mpv_set_option_string': ['int', ['pointer', 'string', 'string']],
  'mpv_set_property_string': ['int', ['pointer', 'string', 'string']]
});

const mpvHandle = mpv.mpv_create();
mpv.mpv_initialize(mpvHandle);
const playCommand = ["loadfile", "./pages/api/music.mp3", null];

mpv.mpv_set_option_string(mpvHandle, "loop", "inf");
mpv.mpv_command(mpvHandle, playCommand);
mpv.mpv_set_property_string(mpvHandle, "pause", "yes");


const pause = () => {
  console.log("pause called.");
  mpv.mpv_set_property_string(mpvHandle, "pause", "yes");
};

const resume = () => {
  console.log("resume called.");
  mpv.mpv_set_property_string(mpvHandle, "pause", "no");
};

const setVolume = (volume) => {
  mpv.mpv_set_option_string(mpvHandle, "volume", volume.toString());
};

export { resume, pause, setVolume };
