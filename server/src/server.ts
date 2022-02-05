import { createClient } from 'redis';

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
  setInterval(() => {
    publisher.publish('room-1', 'Hello from ' + id);
  }, 1000 + Math.floor(Math.random() * 1000));
})();
