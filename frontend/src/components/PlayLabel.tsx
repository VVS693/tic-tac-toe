import { FieldData, GameOver } from "../types";
import Button from "@mui/material/Button";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

type FieldSquareProps = {
  figure: FieldData;
  myName?: string
  playerName?: string
  isYourTurn?: boolean;
  gameOver: GameOver
  onNewGameClick: () => void
};

export function PlayLabel({ figure, myName, playerName, isYourTurn, gameOver, onNewGameClick }: FieldSquareProps) {
  return (
    <div className="w-full flex flex-col items-center p-4 rounded-xl text-3xl font-bold text-blue-900 bg-gradient-to-r from-orange-200 to-pink-300 select-none">
      {myName && gameOver === GameOver.FALSE && <div className="pt-1 pb-1">{myName}</div>}

      {gameOver !== GameOver.FALSE && (
        <Button
          onClick={onNewGameClick}
          variant="contained"
          endIcon={<SportsEsportsIcon sx={{ width: "32px", height: "32px" }} />}
          // fullWidth
          sx={{
            height: "44px",
            borderRadius: "12px",
            backgroundImage: "linear-gradient(#f87171, #9333ea)",
            fontSize: "20px",
            width: "80%"
          }}
        >
          NEW GAME
        </Button>)
      }

      <div className="flex items-center">
        <div className="pt-2 pb-2 pr-3 text-[28px]">{`You play with ${figure}`}</div>
        <div className="w-11 h-11">
          {figure === FieldData.TIC ? (
            <img className="p-[6px]" src="tic.png" alt="" />
          ) : null}
          {figure === FieldData.TAC ? (
            <img className="p-[5px]" src="tac.png" alt="" />
          ) : null}
        </div>
      </div>

      {gameOver === GameOver.FALSE && <div className="pl-4 pr-4 animate-pulse">
        {isYourTurn ? "Your Turn!!!" : `${playerName} Turn!!!`}
      </div>}

      {gameOver !== GameOver.FALSE && <div className="pl-4 pr-4 font-bold text-red-700 animate-pulse">
        {gameOver === GameOver.NOBODY && "TIC WIN!!!"}
        {gameOver === GameOver.WINTIC && "TIC WIN!!!"}
        {gameOver === GameOver.WINTAC && "TAC WIN!!!"}
      </div>}
    </div>
  );
}
