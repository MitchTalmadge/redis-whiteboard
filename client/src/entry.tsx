import * as ReactDOM from 'react-dom';
import { App } from './app';
import { SocketContext } from "./context/socket";

ReactDOM.render(
  (
    <SocketContext>
      <App />
    </SocketContext>
  ), 
  document.getElementById('app'));