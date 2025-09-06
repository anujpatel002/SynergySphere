// /lib/socket.ts
import { io, Socket } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

// We ensure this code only runs on the client-side by checking for `window`.
// This prevents Next.js from trying to initialize a socket connection during
// server-side rendering, which would cause an error.
// `autoConnect: false` is important because we want to manually control
// when the connection is made (i.e., after a user logs in).
const socket: Socket | null =
  typeof window !== 'undefined'
    ? io(URL, {
        autoConnect: false,
      })
    : null;

export default socket;