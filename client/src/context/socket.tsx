import {createContext, FC, useContext, useEffect, useState} from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket;
}

const socketContext = createContext<SocketContextValue>({
  socket: null,
});
export const useSocketContext = () => useContext(socketContext);
export const useSocket = () => useSocketContext().socket;

export const SocketContext: FC = (props) => {

  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const socket = io("http://localhost:9000");
    const onConnect = () => {
      console.log("Connected to server (id: " + socket.id + ")");
      setSocket(socket);
    }
    const onDisconnect = () => {
      console.log("Disconnected from server");
      setSocket(null);
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    }
  }, []);

  return (
    <socketContext.Provider
      value={{socket}}>
      {props.children}
    </socketContext.Provider>
  );
}