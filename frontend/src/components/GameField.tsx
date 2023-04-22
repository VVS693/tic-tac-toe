import Zoom from "@mui/material/Zoom";
import { FieldSquare } from "./FieldSquare";
import { FieldData, GameOver, Turn } from "../types";

export type GameFieldProps = {
  data: FieldData[][];
  onClick?: (data: Turn) => void
  isYourTurn: boolean
  isGameOver: GameOver
};


export function GameField({ data, onClick, isYourTurn, isGameOver }: GameFieldProps) {

  const onClickElement = (key: string) => {
      const data = {
        row: Number(key.split("_")[0]),
        col: Number(key.split("_")[1])
      }
      onClick && onClick(data)
  }

  return (
    <div className="pt-4 pb-4 aspect-square">
      <Zoom in={true} timeout={2000}>
        <div className="grid grid-cols-3 gap-2">
          {data.map((el, row) => {
            return (
              <div className="grid gap-2" key={row}>
                {el.map((e, col) => {
                  return (
                    <FieldSquare
                      key={`${row}_${col}`}
                      figure={e}
                      onClick={() => onClickElement(`${col}_${row}`)}
                      isYourTurn={isYourTurn}
                      isGameOver={isGameOver}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </Zoom>
    </div>
  );
}
