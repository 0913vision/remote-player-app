import { SOCKET_EVENTS } from '../constants/serverConfig';
import { auxOn, micOn } from '../console';

/**
 * Registers console-related socket event handlers (mixer controls)
 * @param {Object} socket - Socket.IO socket instance
 * @param {Object} io - Socket.IO server instance
 * @param {Player} player - Player instance (not used for console operations)
 */
export const registerConsoleHandlers = (socket, io, player) => {
  /**
   * Handle microphone on request
   */
  socket.on(SOCKET_EVENTS.C2S_MIC_ON_EVENT, () => {
    try {
      micOn();
    } catch (error) {
      console.error('Error turning mic on:', error);
    }
  });

  /**
   * Handle auxiliary input on request
   */
  socket.on(SOCKET_EVENTS.C2S_AUX_ON_EVENT, () => {
    try {
      auxOn();
    } catch (error) {
      console.error('Error turning aux on:', error);
    }
  });
};