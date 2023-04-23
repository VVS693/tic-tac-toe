// server/index.js

import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import https from "https"
import {Server} from "socket.io";

const PORT = process.env.PORT || 3003;
export const __dirname = path.resolve();

const app = express();
const options = {
    cert: fs.readFileSync("./sslcert/tictactoe.vvs693.ru_2023-04-23-17-31_40.crt"),
    key: fs.readFileSync("./sslcert/tictactoe.vvs693.ru_2023-04-23-17-31_40.key")
};
app.use(express.json());
app.use(cors());
const server = https.createServer(options, app);

app.use(express.static(path.resolve(__dirname, "img")));
app.use(express.static(path.resolve(__dirname, "../frontend/build")));

const io = new Server(server, {
    cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"],
    },
});

let usersOnline = [];
io.on("connection", (socket) => {
    // console.log(`User connected on socket: ${socket.id}`);
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
});
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
})
server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
