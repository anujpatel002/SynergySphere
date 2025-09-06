// server/src/socket.ts

import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import { ITask } from './models/Task.model';
import { IMessage } from './models/Message.model';

let io: SocketIOServer;

export const initializeSocketIO = (server: http.Server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:3000",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        socket.on('joinProject', (projectId: string) => {
            socket.join(projectId);
            console.log(`Client ${socket.id} joined project room: ${projectId}`);
        });

        socket.on('leaveProject', (projectId: string) => {
            socket.leave(projectId);
            console.log(`Client ${socket.id} left project room: ${projectId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Emitter functions
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitNewTask = (task: ITask) => {
    getIO().to(task.projectId.toString()).emit('task:created', task);
};

export const emitUpdatedTask = (task: ITask) => {
    getIO().to(task.projectId.toString()).emit('task:updated', task);
};

export const emitDeletedTask = (taskId: string, projectId: string) => {
    getIO().to(projectId).emit('task:deleted', { taskId });
};

export const emitNewMessage = (message: IMessage) => {
    getIO().to(message.projectId.toString()).emit('message:created', message);
};