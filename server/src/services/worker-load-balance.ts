import { WorkerService } from "./worker";

export class WorkerLoadBalanceService {
  private assignmentCounts: number[];
  
  constructor() {
    this.assignmentCounts = [];
    for (let i = 0; i < WorkerService.numWorkers; i++) {
      this.assignmentCounts.push(0);
    }
  }

  public assign(): number {
    let min = this.assignmentCounts[0];
    let minIndex = 0;
    for (let i = 1; i < WorkerService.numWorkers; i++) {
      if (this.assignmentCounts[i] < min) {
        min = this.assignmentCounts[i];
        minIndex = i;
      }
    }

    this.assignmentCounts[minIndex]++;
    return minIndex;
  }

  public unassign(workerId: number) {
    this.assignmentCounts[workerId]--;
  }
}