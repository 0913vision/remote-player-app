import { PLAYER_STATE, MUTE_STATE, SONG_TYPE } from '@/constants/socket';

export const PLAYER_INITIAL_STATE = {
  volume: 50,
  state: PLAYER_STATE.PAUSED,
  mute: MUTE_STATE.UNMUTED,
  currentSong: SONG_TYPE.SLOW,
  lock: false
};