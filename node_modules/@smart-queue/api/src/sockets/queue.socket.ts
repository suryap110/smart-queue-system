import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger.js';

export class QueueSocketHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.initListeners();
  }

  private initListeners() {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`Client connected to WebSocket: ${socket.id}`);

      // Join Department room
      socket.on('join:department', (departmentId: string) => {
        socket.join(`dept:${departmentId}`);
        logger.info(`Socket ${socket.id} joined room dept:${departmentId}`);
      });

      // Join Token room
      socket.on('join:token', (tokenId: string) => {
        socket.join(`token:${tokenId}`);
        logger.info(`Socket ${socket.id} joined room token:${tokenId}`);
      });

      // Join Public Display room
      socket.on('join:display', (branchId: string) => {
        socket.join(`display:${branchId}`);
        logger.info(`Socket ${socket.id} joined room display:${branchId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public notifyQueueUpdated(departmentId: string, payload: any) {
    this.io.to(`dept:${departmentId}`).emit('queue:updated', payload);
  }

  public notifyTokenCalled(token: any) {
    // Notify token holder
    this.io.to(`token:${token.id}`).emit('token:called', token);
    // Notify public waiting display board
    this.io.to(`display:${token.branchId}`).emit('display:broadcast', {
      type: 'TOKEN_CALLED',
      token
    });
    // Notify department
    this.io.to(`dept:${token.departmentId}`).emit('queue:updated', { lastCalledToken: token });
  }

  public notifyTokenTransferred(token: any, fromDeptId: string, toDeptId: string) {
    this.io.to(`token:${token.id}`).emit('token:transferred', token);
    this.io.to(`dept:${fromDeptId}`).emit('queue:updated', {});
    this.io.to(`dept:${toDeptId}`).emit('queue:updated', {});
  }
}
