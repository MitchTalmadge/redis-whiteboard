import axios from "axios";
import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientSocketMessage, ServerSocketMessage } from '../../../common/src/model/socket/message';

interface SocketContextValue {
  socket: Socket;
  sendMessage: (message: ClientSocketMessage) => void;
  onMessage: (cb: (message: ServerSocketMessage) => void) => void;
}

const socketContext = createContext<SocketContextValue>({
  socket: null,
  sendMessage: null,
  onMessage: null
});
export const useSocketContext = () => useContext(socketContext);
export const useSocket = () => useSocketContext().socket;

export const SocketContext: FC = (props) => {

  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to server (id: " + socket.id + ")");
      setSocket(socket);
    }
    const onDisconnect = () => {
      console.log("Disconnected from server");
      setSocket(null);
    }
    let socket: Socket = null;

    axios.get("http://localhost:9000/load-balance")
      .then(val => {
        console.log("Connecting to server " + val.data);
        socket = io(val.data);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
      })
      .catch(err => {
        console.error("Load Balance error:", err);
      });

    return () => {
      if (socket) {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
      }
    }
  }, []);

  const sendMessage = useCallback((message: ClientSocketMessage) => {
    if (socket) {
      socket.emit('message', message);
    }
  }, [socket]);

  const onMessage = useCallback((cb: (message: ServerSocketMessage) => void) => {
    if (socket) {
      socket.on('message', cb);
    }
  }, [socket]);

  return (
    <socketContext.Provider
      value={{ socket, sendMessage, onMessage }}>
      {props.children}
    </socketContext.Provider>
  );
}