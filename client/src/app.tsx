import { Whiteboard } from "./components/whiteboard/whiteboard";
import { useSocket } from './context/socket';
import "./app.scss";
import appStyles from './app.module.scss';

export const App = () => {
  const socket = useSocket();

  return (
    <div className={appStyles.app}>
      <div className={appStyles.header}>
        <h1>Redis Whiteboard</h1>
        <p>{socket ? `Connected to server (id: ${socket.id})` : "Disconnected from server"}</p>
      </div>
      <Whiteboard />
    </div>
  );
};
