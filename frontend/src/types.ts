
export enum UserStatus {
  WAITING = "WAITING",
  BUSY = "BUSY",
  PLAYING = "PLAYING",
}

export type Message = {
  status: UserStatus;
  userSenderId: string;
  userReceiverId: string;
};

export type UsersOnline = {
  userName: string;
  socketId: string;
  status?: UserStatus;
};

export enum FieldData {
  TIC = "TIC",
  TAC = "TAC",
  NULL = "NULL",
  WINTIC = "WINTIC",
  WINTAC = "WINTAC",
}

export type PlayTurn = {
  fieldData: FieldData[][];
  userSenderId?: string;
  userReceiverId?: string;
};

export type Turn = {
  row: number;
  col: number;
};

export enum GameOver {
  WINTIC = "WINTIC",
  WINTAC = "WINTAC",
  NOBODY = "NOBODY",
  FALSE = "FALSE",
}
