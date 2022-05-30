import { HistoryService } from "./history";
import { StateService } from "./state";

export class RoomService {
  private static instance: RoomService;
  private activeRooms: {
    [room: string]: {
      sockets: string[];
    };
  } = {};

  private constructor() {}

  public static getInstance() {
    if (!RoomService.instance) {
      RoomService.instance = new RoomService();
    }
    return RoomService.instance;
  }

  private initRoom(room: string) {
    if (this.activeRooms[room]) {
      throw new Error(`Room ${room} already exists.`);
    }

    this.activeRooms[room] = {
      sockets: [],
    };

    StateService.getInstance().initRoom(room);
    HistoryService.getInstance().initRoom(room);
  }

  private teardownRoom(room: string) {
    if (!this.activeRooms[room]) {
      throw new Error(`Room ${room} does not exist.`);
    } else if (this.activeRooms[room].sockets.length > 0) {
      throw new Error(`Room ${room} is not empty.`);
    }
    delete this.activeRooms[room];

    StateService.getInstance().teardownRoom(room);
    HistoryService.getInstance().teardownRoom(room);
  }

  public async joinSocketToRoom(socketId: string, room: string) {
    if (!this.activeRooms[room]) {
      this.initRoom(room);
    }
    this.activeRooms[room].sockets.push(socketId);
  }

  public async removeSocketFromRoom(socketId: string, room: string) {
    if (!this.activeRooms[room]) {
      return;
    }
    this.activeRooms[room].sockets = this.activeRooms[room].sockets.filter(
      (socket) => socket !== socketId
    );
    if (this.activeRooms[room].sockets.length === 0) {
      this.teardownRoom(room);
    }
  }
}
