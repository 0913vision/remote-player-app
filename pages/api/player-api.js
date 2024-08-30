import { resume, pause, setVolume, changeSong, loadLastSongTime } from './player';
import { auxOn, micOn } from './console';
import { Server } from 'socket.io';

export default function handler(req, res) {
    const io = res.socket.server.io;
    if (!io) {
        return res.status(500).json({ error: 'Socket server not initialized' });
    }
    if (req.method === 'POST') {
        const { action, value } = req.body;
        switch (action) {
            case 'pause':
                pause();
                io.emit('stateChanged', 0);
                break;
            case 'resume':
                resume();
                io.emit('stateChanged', 1);
                break;
            case 'setVolume':
                setVolume(value);
                io.emit('volumeChanged', value);
                break;
            case 'changeSong':
                changeSong(value.currentSong, value.newSong);
                io.emit('songChanged', value.newSong);
                break;
            case 'micOn':
                micOn();
                io.emit('micOn');
                break;
            case 'auxOn':
                auxOn();
                io.emit('auxOn');
                break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
        return res.status(200).json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
}