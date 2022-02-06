import * as express from "express";
import * as socketio from "socket.io";
import { createClient } from "redis";
import cors = require("cors");

const app = express();
app.use(cors());
const server = app.listen(9000, () => {
  console.log("Server listening on port 9000");
});

const io = new socketio.Server(server, {
  cors: {
    origin: "*",
  },
  serveClient: false,
});
io.on("connection", (socket) => {
  console.log("Socket connected (id: " + socket.id + ")");

  socket.on("disconnect", () => {
    console.log("Socket disconnected (id: " + socket.id + ")");
  });

  socket.on("mousemove", (data) => {
    socket.broadcast.emit("mousemove", data);
  });
});

app.get("/", (req, res) => {
  res.send("(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧");
});
/* 
(async () => {
  // Generate random id between 1 and 100
  const id = Math.floor(Math.random() * 100) + 1;
  console.log("Started with id: ", id);

  const client = createClient();

  client.on('error', (err) => {
    console.error("Redis client error:", err);
  });

  await client.connect();

  const subscriber = client.duplicate();
  await subscriber.connect();
  await subscriber.subscribe('room-1', (message) => {
    console.log(`[${id}] Received message: ${message}`);
  });

  const publisher = client.duplicate();
  await publisher.connect();
  if(!(await publisher.exists('test'))) {
    await publisher.json.set('test', '$', {
      creator: id,
      touchers: [
        id
      ]
    })
  } else {
    await publisher.json.ARRAPPEND('test', '$.touchers', id);
  }
  console.log(await publisher.json.get('test'));
  setInterval(() => {
    publisher.publish('room-1', 'Hello from ' + id);
  }, 1000 + Math.floor(Math.random() * 1000));
})();
 */
