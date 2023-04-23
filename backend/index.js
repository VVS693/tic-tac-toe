// server/index.js

import express from "express";
import path from "path";
import cors from "cors";

// import fs from "fs";
// import https from "https"

import http from "http";
import {Server} from "socket.io";

const PORT = process.env.PORT || 3001;
export const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

let usersOnline = [];
io.on("connection", (socket) => {
    console.log(`User connected on socket: ${socket.id}`);
    io.emit("newUserResponse", usersOnline);

    socket.on("disconnect", () => {
        // console.log("User disconnected ");
        usersOnline = usersOnline.filter((el) => el.socketId !== socket.id);
        io.emit("newUserResponse", usersOnline);
        io.emit("userFreeResponse", socket.id);
    });

    socket.on("message", (data) => {
        const userReceiverIndex = usersOnline.findIndex(
            (el) => el.socketId === data.userReceiverId
        );
        const userSenderIndex = usersOnline.findIndex(
            (el) => el.socketId === data.userSenderId
        );
        if (userReceiverIndex !== -1) {
            usersOnline[userReceiverIndex].status = data.status;
        }
        if (userSenderIndex !== -1) {
            usersOnline[userSenderIndex].status = data.status;
        }
        io.to(data.userReceiverId).emit("messageResponse", data);
        io.emit("newUserResponse", usersOnline);
    });

    socket.on("play", (data) => {
        io.to(data.userReceiverId).emit("playResponse", data);
    });

    socket.on("newUser", (data) => {
        usersOnline.push(data);
        // console.log(usersOnline);
        io.emit("newUserResponse", usersOnline);
    });

    socket.on("userFree", (data) => {
        const userSenderIndex = usersOnline.findIndex(
            (el) => el.socketId === data.userSenderId
        );
        if (userSenderIndex !== -1) {
            usersOnline[userSenderIndex].status = data.status;
            io.emit("newUserResponse", usersOnline);
        }
    });

    // We can write our socket event listeners in here...
});

app.use(express.static(path.resolve(__dirname, "img")));

console.log(path.resolve(__dirname, "img"));
// app.use(express.static(path.resolve(__dirname, "../frontend/build")));

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
