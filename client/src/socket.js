import { io } from "socket.io-client";

// The server identifies users from their JWT, so the socket must connect
// *after* login (and reconnect with the new token if the user changes).
const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
});

export const connectSocket = () => {
  if (localStorage.getItem("token") && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export default socket;
