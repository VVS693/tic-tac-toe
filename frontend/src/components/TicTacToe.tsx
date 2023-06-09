import {useNewGame} from "../hooks";
import {Header} from "./Header";
import {Greet} from "./Greet";
import {GameField} from "./GameField";
import Button from "@mui/material/Button";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import {PlayLabel} from "./PlayLabel";
import {UserOnlineList} from "./UsersOnlineList";
import {AddName} from "./AddName";
import {InviteUser} from "./InviteUser";

export function TicTacToe() {
    const {
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
        addNameHandle, agreeHandle,
        isUserInviteOpen,
        disagreeHandle
    } = useNewGame();

    return (
        <div className="container mx-auto flex flex-col items-center pl-4 pr-4 pt-6 pb-6 max-w-md min-w-[360px]">

            <Header/>

            {!isPlaying && <Greet/>}

            {isPlaying && (
                <GameField
                    data={dataField}
                    onClick={turnHandle}
                    isYourTurn={isYourTurn}
                    isGameOver={gameOver}
                />
            )}

            {me.userName === "" && (
                <>
                    <div
                        className="flex items-center pb-4 text-[28px] font-semibold">{`Users online: ${usersOnline.length}`}</div>
                    <Button
                        onClick={() => setDialogAddNameOpen(true)}
                        variant="contained"
                        endIcon={<SportsEsportsIcon sx={{width: "36px", height: "36px"}}/>}
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
                </>

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
                onCancel={() => setDialogAddNameOpen(false)}
                onSubmit={addNameHandle}
            />

            <InviteUser
                isOpen={isUserInviteOpen}
                player={player}
                onCancel={disagreeHandle}
                onSubmit={agreeHandle}
            />
        </div>
    );

}