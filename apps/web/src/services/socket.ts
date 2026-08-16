import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

class SocketService {
  public socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10
    });
  }

  public joinDepartment(departmentId: string) {
    this.socket.emit('join:department', departmentId);
  }

  public joinToken(tokenId: string) {
    this.socket.emit('join:token', tokenId);
  }

  public joinDisplay(branchId: string) {
    this.socket.emit('join:display', branchId);
  }
}

export const socketService = new SocketService();
