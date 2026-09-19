const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        console.log(`Frontend connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Frontend disconnected: ${socket.id}`);
        });
    });

    return io;
};

const emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};

module.exports = {
    initializeSocket,
    emitEvent
};