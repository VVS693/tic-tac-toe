import {useEffect, useState} from "react";
import {FieldData, GameOver, Message, PlayTurn, Turn, UsersOnline, UserStatus} from "./types";
import {
    disconnectSocket,
    initiateSocketConnection,
    messageResponse,
    newUser, play, playResponse,
    sendMessage, userFree, userFreeResponse,
    usersOnlineResponse
} from "./socket.service";

export const useNewGame = () => {

    const initialData = [
        Array(3).fill(FieldData.NULL),
        Array(3).fill(FieldData.NULL),
        Array(3).fill(FieldData.NULL),
    ]
    const initialUser: UsersOnline = {
        userName: "",
        socketId: "",
        status: UserStatus.WAITING,
    };
    const [dataField, setDataField] = useState<FieldData[][]>(initialData);
    const [me, setMe] = useState<UsersOnline>(initialUser);
    const [player, setPlayer] = useState<UsersOnline>(initialUser);
    const [invitedPlayer, setInvitedPlayer] = useState<UsersOnline>(initialUser);
    const [usersOnline, setUsersOnline] = useState<UsersOnline[]>([]);
    const [isDialogAddNameOpen, setDialogAddNameOpen] = useState(false);
    const [isUsersOnlineListOpen, setUsersOnlineListOpen] = useState(false);
    const [isUserInviteOpen, setUserInviteOpen] = useState(false);
    const [isPlaying, setPlaying] = useState(false);
    const [isYourTurn, setYourTurn] = useState(false);
    const [yourToe, setYourToe] = useState(FieldData.TIC);
    const [gameOver, setGameOver] = useState<GameOver>(GameOver.FALSE);

    const addNewUserHandle = (user: string) => {
        newUser(user, (data: string) => {
            setMe({
                userName: user,
                socketId: data,
            });
        });
    };
    const addNameHandle = (name: string) => {
        addNewUserHandle(name);
        setDialogAddNameOpen(false);
        setUsersOnlineListOpen(true);
    };
    const inviteUserHandle = (el: UsersOnline) => {
        const data: Message = {
            status: UserStatus.BUSY,
            userSenderId: me.socketId,
            userReceiverId: el.socketId,
        };
        sendMessage(data);
        const invitedPlayerData: UsersOnline = {
            status: el.status,
            userName: el.userName,
            socketId: el.socketId
        }
        setInvitedPlayer(invitedPlayerData)
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
        setInvitedPlayer(initialUser)
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
    const turnHandle = (data: Turn) => {
        let newDataField = [...dataField];
        newDataField[data.col][data.row] = yourToe;
        setDataField(newDataField);
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

    useEffect(() => {
        initiateSocketConnection();
        usersOnlineResponse((data: UsersOnline[]) => {
            setUsersOnline(data);
        });
        return () => {
            disconnectSocket();
        };
    }, [])

    useEffect(() => {
        messageResponse((data: Message) => {
            if (data.status === UserStatus.BUSY) {
                setPlayer({
                    userName: usersOnline?.find((el) => el.socketId === data.userSenderId)?.userName,
                    socketId: data.userSenderId,
                });
                setUsersOnlineListOpen(false);
                setUserInviteOpen(true);
            }
            if (data.status === UserStatus.PLAYING) {
                setUsersOnlineListOpen(false);
                setUserInviteOpen(false);
                setPlayer({
                    userName: usersOnline?.find((el) => el.socketId === data.userSenderId)?.userName,
                    socketId: data.userSenderId,
                });
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
    }, [usersOnline])

    useEffect(() => {
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
    }, [usersOnline])

    useEffect(() => {
        userFreeResponse((socketId: string) => {
            if (me.userName !== "" && (socketId === invitedPlayer.socketId || socketId === player.socketId)) {
                const data: Message = {
                    status: UserStatus.WAITING,
                    userSenderId: me.socketId,
                    userReceiverId: player.socketId,
                };
                userFree(data);
                setPlayer(initialUser);
                setYourTurn(false);
                setPlaying(false);
                setUsersOnlineListOpen(true);
                setDataField(initialData);
                setGameOver(GameOver.FALSE);
                setYourToe(FieldData.TIC);
            }
        });
    }, [usersOnline])

    return {
        isPlaying,
        dataField,
        turnHandle,
        isYourTurn,
        gameOver,
        me,
        usersOnline,
        setDialogAddNameOpen,
        yourToe,
        player,
        newGameClick,
        isUsersOnlineListOpen,
        inviteUserHandle,
        isDialogAddNameOpen,
        addNameHandle,
        isUserInviteOpen,
        disagreeHandle,
        agreeHandle
    };
};












