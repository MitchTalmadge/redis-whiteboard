import { createAdapter } from "@socket.io/redis-adapter";
import socketio from "socket.io";
import { HttpController } from "./http";
import { Controller } from "./_controller";
import {
  ClientSocketMessage,
  ServerSocketMessage,
} from "../../../common/src/model/socket/message";
import { RedisController } from "./redis";
import { SocketService } from "../services/socket";

export class SocketController extends Controller {
  private static instance: SocketController;
  private socketServer: socketio.Server;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!SocketController.instance) {
      SocketController.instance = new SocketController();
    }
    return SocketController.instance;
  }

  public async init() {
    // Start Server
    const httpServer = HttpController.getInstance().getHttpServer();
    this.socketServer = new socketio.Server(httpServer, {
      cors: {
        origin: "*",
      },
      serveClient: false,
    });

    // Attach to Redis
    const redisController = RedisController.getInstance();
    this.socketServer.adapter(
      createAdapter(
        redisController.getPublisher(),
        redisController.getSubscriber()
      )
    );

    // Listen
    this.listenForSockets();
  }

  private listenForSockets() {
    this.socketServer.on("connection", (socket) => {
      console.log("Socket connected (id: " + socket.id + ")");
      SocketService.getInstance().handleSocketConnect(socket);

      socket.on('disconnect', () => {
        console.log("Socket disconnected (id: " + socket.id + ")");
        SocketService.getInstance().handleSocketDisconnect(socket);
      })

      socket.on("message", (message: any) => {
        if (!message.event) {
          console.error("Malformed socket message; missing event.");
          return;
        }
        if (!message.data) {
          console.error("Malformed socket message; missing data.");
          return;
        }
  
        const typedMessage = message as ClientSocketMessage;
        SocketService.getInstance().handleSocketMessage(socket, typedMessage);
      });
    });
  }

  public sendMessageToSocket(socketId: string, message: ServerSocketMessage) {
    this.socketServer.sockets.sockets.get(socketId).emit("message", message);
  }

  public sendMessageToRoom(room: string, message: ServerSocketMessage) {
    this.socketServer.to(room).emit("message", message);
  }
}
