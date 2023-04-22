import { io, Socket } from "socket.io-client";
import { Message, PlayTurn, UsersOnline, UserStatus } from "./types";

type ServerToClientEvents = {
  // noArg: () => void;
  messageResponse: (callback: (data: Message) => void) => void;
  newUserResponse: (data: UsersOnline) => void;
  playResponse: (data: PlayTurn) => void;
}

type ClientToServerEvents = {
  newUser: (data: UsersOnline) => void;
  message: (data: Message) => void;
  play: (data: PlayTurn) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

export const initiateSocketConnection = () => {
  socket = io("http://localhost:3001");

  // socket = io("https://sl.vvs693.ru");

  console.log(`Connecting socket...`);
  socket.on("connect", () => {});
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};

export const messageResponse = (cb: any) => {
  if (!socket) return true;
  socket.on("messageResponse", (data) => {
    console.log("Message received!");
    return cb(data);
  });
};

export const sendMessage = (data: Message) => {
  if (socket) socket.emit("message", data);
};

export const playResponse = (cb: any) => {
  if (!socket) return true;
  socket.on("playResponse", (data) => {
    console.log("Play turn received!");
    return cb(data);
  });
};

export const play = (data: PlayTurn) => {
  if (socket) socket.emit("play", data);
};

export const usersOnlineResponse = (cb: any) => {
  if (!socket) return true;
  socket.on("newUserResponse", (data) => {
    console.log("Users online received!");
    return cb(data);
  });
};


export const newUser = (userName: string, cb: any) => {
  console.log("newUser " + userName);
  socket.on("connect", () => {
    const data: UsersOnline = {
      userName,
      socketId: socket.id,
      status: UserStatus.WAITING,
    };
    if (socket) socket.emit("newUser", data);
    // console.log(socket.id)
    return cb(socket.id)
  });
};

// export const newUser = (userName: string, cb: any) => {
//   console.log("newUser " + userName);
//   socket.on("connect", () => {
//     const data: UsersOnline = {
//       userName,
//       socketId: socket.id,
//       status: UserStatus.WAITING,
//     };
//     if (socket) socket.emit("newUser", data);
//     // console.log(socket.id)
//     return cb(socket.id)
//   });
// };

// export const newUser = (userName: string) => {
//   console.log("newUser " + userName);
//   socket.on("connect", () => {
//     const data: UsersOnline = {
//       userName,
//       socketId: socket.id,
//       status: UserStatus.WAITING,
//     };
//     if (socket) socket.emit("newUser", data);
//   });
// };