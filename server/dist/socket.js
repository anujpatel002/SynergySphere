"use strict";
// server/src/socket.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNewMessage = exports.emitDeletedTask = exports.emitUpdatedTask = exports.emitNewTask = exports.getIO = exports.initializeSocketIO = void 0;
const socket_io_1 = require("socket.io");
let io;
const initializeSocketIO = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:3000",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });
    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);
        socket.on('joinProject', (projectId) => {
            socket.join(projectId);
            console.log(`Client ${socket.id} joined project room: ${projectId}`);
        });
        socket.on('leaveProject', (projectId) => {
            socket.leave(projectId);
            console.log(`Client ${socket.id} left project room: ${projectId}`);
        });
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initializeSocketIO = initializeSocketIO;
// Emitter functions
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIO = getIO;
const emitNewTask = (task) => {
    (0, exports.getIO)().to(task.projectId.toString()).emit('task:created', task);
};
exports.emitNewTask = emitNewTask;
const emitUpdatedTask = (task) => {
    (0, exports.getIO)().to(task.projectId.toString()).emit('task:updated', task);
};
exports.emitUpdatedTask = emitUpdatedTask;
const emitDeletedTask = (taskId, projectId) => {
    (0, exports.getIO)().to(projectId).emit('task:deleted', { taskId });
};
exports.emitDeletedTask = emitDeletedTask;
const emitNewMessage = (message) => {
    (0, exports.getIO)().to(message.projectId.toString()).emit('message:created', message);
};
exports.emitNewMessage = emitNewMessage;
