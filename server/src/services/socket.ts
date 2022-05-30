import { Socket } from 'socket.io';
import { ClientSocketMessage } from "../../../common/src/model/socket/message";
import { WorkerService } from "./worker";
import { WorkerLoadBalanceService } from "./worker-load-balance";

export class SocketService {
  private static instance: SocketService;
  /**
   * Maps socket ID to worker ID for sticky sessions
   */
  private socketAssignedWorkers: { [key: string]: number };
  private workerLoadBalancer: WorkerLoadBalanceService;

  private constructor() {
    this.socketAssignedWorkers = {};
    this.workerLoadBalancer = new WorkerLoadBalanceService();
  }

  public static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public handleSocketConnect(socket: Socket) {
    const socketWorkerId = this.workerLoadBalancer.assign();
    this.socketAssignedWorkers[socket.id] = socketWorkerId;
  }

  public handleSocketDisconnect(socket: Socket) {
    this.workerLoadBalancer.unassign(this.socketAssignedWorkers[socket.id]);
    delete this.socketAssignedWorkers[socket.id];
  }

  public handleSocketMessage(socket: Socket, message: ClientSocketMessage) {
    const workerId = this.socketAssignedWorkers[socket.id];
    WorkerService.getInstance().forwardSocketMessage(workerId, socket.id, message);
  }

}