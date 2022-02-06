import * as React from 'react';
import { SocketContext } from './context/socket';

export const App = () => {
  return (
    <SocketContext>
      <h1>Hello React</h1>
    </SocketContext>
  );
};
