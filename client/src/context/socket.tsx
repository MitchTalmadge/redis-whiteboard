import {createContext, FC, useContext, useEffect, useState} from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket;
}

const socketContext = createContext<SocketContextValue>({
  socket: null,
});
const useSocketContext = () => useContext(socketContext);
const useSocket = () => useSocketContext().socket;

export const SocketContext: FC = (props) => {

  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const socket = io("http://localhost:9000");
    const onConnect = () => {
      console.log("Connected to server (id: " + socket.id + ")");
      setSocket(socket);
    }
    socket.on('connect', onConnect);
    return () => {
      socket.off('connect', onConnect);
    }
  }, []);

  return (
    <socketContext.Provider
      value={{socket}}>
      {props.children}
    </socketContext.Provider>
  );
}