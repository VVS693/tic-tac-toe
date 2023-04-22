import { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Greet } from "./components/Greet";
import {
  disconnectSocket,
  initiateSocketConnection,
  messageResponse,
  newUser,
  play,
  playResponse,
  sendMessage,
  usersOnlineResponse,
} from "./socket.service";
import { AddName } from "./components/AddName";
import {
  FieldData,
  GameOver,
  Message,
  PlayTurn,
  Turn,
  UserStatus,
  UsersOnline,
} from "./types";
import { UserOnlineList } from "./components/UsersOnlineList";
import { InviteUser } from "./components/InviteUser";
import { GameField } from "./components/GameField";
import { useNewGame } from "./hooks";
import { PlayLabel } from "./components/PlayLabel";
import { Header } from "./components/Header";

function App() {
  const initialUser: UsersOnline = {
    userName: "",
    socketId: "",
    status: UserStatus.WAITING,
  };
  const [isDialogAddNameOpen, setDialogAddNameOpen] = useState(false);
  const [isUsersOnlineListOpen, setUsersOnlineListOpen] = useState(false);
  const [isUserInviteOpen, setUserInviteOpen] = useState(false);
  const [me, setMe] = useState<UsersOnline>(initialUser);
  const [player, setPlayer] = useState<UsersOnline>(initialUser);
  const [usersOnline, setUsersOnline] = useState<UsersOnline[]>([]);
  const [isPlaying, setPlaying] = useState(false);
  const [isYourTurn, setYourTurn] = useState(false);
  const [yourToe, setYourToe] = useState(FieldData.TIC);
  const [gameOver, setGameOver] = useState<GameOver>(GameOver.FALSE);

  const { dataField, setDataField, initialData } = useNewGame();

  const checkEndGame = (field: FieldData[][]) => {
    if (field.flat(Infinity).every((el) => el !== FieldData.NULL)) {
      setGameOver(GameOver.NOBODY);
    }
  };

  const checkWinner = (field: FieldData[][], toe: FieldData) => {
    const newToe = toe === FieldData.TIC ? FieldData.WINTIC : FieldData.WINTAC;
    const newField = [...field];
    for (let i = 0; i < 3; i++) {
      if (field[i][0] === toe && field[i][1] === toe && field[i][2] === toe) {
        newField[i][0] = newToe;
        newField[i][1] = newToe;
        newField[i][2] = newToe;
        setDataField(newField);
        return true;
      }
    }
    for (let j = 0; j < 3; j++) {
      if (field[0][j] === toe && field[1][j] === toe && field[2][j] === toe) {
        newField[0][j] = newToe;
        newField[1][j] = newToe;
        newField[2][j] = newToe;
        setDataField(newField);
        return true;
      }
    }
    if (field[0][0] === toe && field[1][1] === toe && field[2][2] === toe) {
      newField[0][0] = newToe;
      newField[1][1] = newToe;
      newField[2][2] = newToe;
      setDataField(newField);
      return true;
    }
    if (field[0][2] === toe && field[1][1] === toe && field[2][0] === toe) {
      newField[0][2] = newToe;
      newField[1][1] = newToe;
      newField[2][0] = newToe;
      setDataField(newField);
      return true;
    }
    return false;
  };

  const findUserName = (socketId?: string) => {
    return usersOnline?.find((el) => el.socketId === socketId)?.userName;
  };

  const addNewUserHandle = (user: string) => {
    initiateSocketConnection();
    newUser(user, (data: string) => {
      setMe({
        userName: user,
        socketId: data,
      });
    });

    usersOnlineResponse((data: UsersOnline[]) => {
      console.log(data);
      setUsersOnline(data);
    });

    messageResponse((data: Message) => {
      console.log("message response")
      if (data.status === UserStatus.BUSY) {
        // console.log(data);

        setPlayer({
          userName: usersOnline?.find((el) => el.socketId === data.userSenderId)?.userName,
          // userName: findUserName(data.userSenderId),
          socketId: data.userSenderId,
        });
        setUsersOnlineListOpen(false);
        setUserInviteOpen(true);
      }
      if (data.status === UserStatus.PLAYING) {
        setUsersOnlineListOpen(false);
        setUserInviteOpen(false);
        // setPlayer({
        //   userName: usersOnline?.find((el) => el.socketId === data.userSenderId)?.userName,
        //   socketId: data.userSenderId,
        // });
        setPlaying(true);
        setYourTurn(true);
      }
      if (data.status === UserStatus.WAITING) {
        setPlayer(initialUser);
        setYourTurn(false);
        setPlaying(false);
        setUsersOnlineListOpen(true);
        setDataField(initialData);
        setGameOver(GameOver.FALSE);
        setYourToe(FieldData.TIC);
      }
    });

    playResponse((data: PlayTurn) => {
      setYourTurn(true);
      setDataField(data.fieldData);
      checkEndGame(data.fieldData);
      if (checkWinner(data.fieldData, FieldData.TIC)) {
        setGameOver(GameOver.WINTIC);
      }
      if (checkWinner(data.fieldData, FieldData.TAC)) {
        setGameOver(GameOver.WINTAC);
      }
    });
  };

  const inviteUserHandle = (el: UsersOnline) => {
    const data: Message = {
      status: UserStatus.BUSY,
      userSenderId: me.socketId,
      userReceiverId: el.socketId,
    };
    sendMessage(data);
  };

  const disagreeHandle = (user: UsersOnline) => {
    const data: Message = {
      status: UserStatus.WAITING,
      userSenderId: me.socketId,
      userReceiverId: user.socketId,
    };
    sendMessage(data);
    setUserInviteOpen(false);
    setUsersOnlineListOpen(true);
  };

  const agreeHandle = (user: UsersOnline) => {
    const data: Message = {
      status: UserStatus.PLAYING,
      userSenderId: me.socketId,
      userReceiverId: user.socketId,
    };
    sendMessage(data);
    setUserInviteOpen(false);
    setUsersOnlineListOpen(false);
    setPlaying(true);
    setYourToe(FieldData.TAC);
    setYourTurn(false);
  };

  const turnHandle = (data: Turn) => {
    let newDataField = [...dataField];
    newDataField[data.col][data.row] = yourToe;
    setDataField(newDataField);
    console.log(dataField);
    const sendTurn: PlayTurn = {
      fieldData: newDataField,
      userSenderId: me.socketId,
      userReceiverId: player.socketId,
    };
    play(sendTurn);
    setYourTurn(false);
    checkEndGame(newDataField);
    if (checkWinner(newDataField, FieldData.TIC)) {
      setGameOver(GameOver.WINTIC);
    }
    if (checkWinner(newDataField, FieldData.TAC)) {
      setGameOver(GameOver.WINTAC);
    }
  };

  const disconnectHandle = () => {
    const data: Message = {
      status: UserStatus.WAITING,
      userSenderId: me.socketId,
      userReceiverId: player.socketId,
    };
    sendMessage(data);
    disconnectSocket();
    setMe(initialUser);
    setPlayer(initialUser);
    setYourTurn(false);
    setPlaying(false);
    setGameOver(GameOver.FALSE);
    setYourToe(FieldData.TIC);
  };

  const newGameClick = () => {
    const data: Message = {
      status: UserStatus.WAITING,
      userSenderId: me.socketId,
      userReceiverId: player.socketId,
    };
    sendMessage(data);
    setPlayer(initialUser);
    setYourTurn(false);
    setPlaying(false);
    setUsersOnlineListOpen(true);
    setDataField(initialData);
    setGameOver(GameOver.FALSE);
    setYourToe(FieldData.TIC);
  };

  const addNameHandle = (name: string) => {
    addNewUserHandle(name);
    setDialogAddNameOpen(false);
    setUsersOnlineListOpen(true);
  };

  useEffect(() => {
    console.log(usersOnline)
    if (
      !usersOnline.find((el) => el.socketId === player.socketId) &&
      me.userName !== ""
    ) {
      setPlayer(initialUser);
      setYourTurn(false);
      setPlaying(false);
      setUsersOnlineListOpen(true);
      setDataField(initialData);
      setGameOver(GameOver.FALSE);
      setYourToe(FieldData.TIC);
    }
  }, [usersOnline]);

  return (
    <div className="container mx-auto flex flex-col items-center pl-4 pr-4 pt-6 pb-6 max-w-md min-w-[360px]">
      <Header onClick={disconnectHandle} />

      {!isPlaying && <Greet />}

      {isPlaying && (
        <GameField
          data={dataField}
          onClick={turnHandle}
          isYourTurn={isYourTurn}
          isGameOver={gameOver}
        />
      )}

      {me.userName === "" && (
        <Button
          onClick={() => setDialogAddNameOpen(true)}
          variant="contained"
          endIcon={<SportsEsportsIcon sx={{ width: "36px", height: "36px" }} />}
          fullWidth
          sx={{
            height: "68px",
            borderRadius: "12px",
            backgroundImage: "linear-gradient(#f87171, #9333ea)",
            fontSize: "20px",
          }}
        >
          LET'S PLAY!!!
        </Button>
      )}

      {isPlaying && (
        <PlayLabel
          figure={yourToe}
          myName={me.userName}
          playerName={player.userName}
          isYourTurn={isYourTurn}
          gameOver={gameOver}
          onNewGameClick={newGameClick}
        />
      )}

      <UserOnlineList
        isOpen={isUsersOnlineListOpen}
        me={me}
        users={usersOnline}
        onClick={inviteUserHandle}
      />

      <AddName
        isOpen={isDialogAddNameOpen}
        cancelFunc={() => setDialogAddNameOpen(false)}
        okFunc={addNameHandle}
      />

      <InviteUser
        isOpen={isUserInviteOpen}
        player={player}
        cancelFunc={disagreeHandle}
        okFunc={agreeHandle}
      />
    </div>
  );
}

export default App;
