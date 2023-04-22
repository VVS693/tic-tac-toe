import Button from "@mui/material/Button";
import {FieldData, GameOver} from "../types";

export type FieldSquareProps = {
    figure: FieldData;
    onClick: () => void;
    isYourTurn: boolean;
    isGameOver: GameOver
};

export function FieldSquare({
                                figure,
                                onClick,
                                isYourTurn = true,
                                isGameOver
                            }: FieldSquareProps) {
    const winBgColor = "#f9a8d4";
    return (
        <Button
            sx={{
                backgroundColor:
                    figure !== FieldData.WINTAC && figure !== FieldData.WINTIC
                        ? "#94a3b8"
                        : winBgColor,
                borderRadius: "6px",
                "&:hover": {
                    backgroundColor: "#cbd5e1",
                },
            }}
            disabled={!isYourTurn || (figure !== FieldData.NULL ? true : false) || isGameOver !== GameOver.FALSE}
            onClick={onClick}
        >
            {figure === FieldData.TIC || figure === FieldData.WINTIC ? (
                <img className="p-5" src="tic.png" alt=""/>
            ) : null}
            {figure === FieldData.TAC || figure === FieldData.WINTAC ? (
                <img className="p-5" src="tac.png" alt=""/>
            ) : null}
            {figure === FieldData.NULL ? (
                <img className="p-5" src="null.png" alt=""/>
            ) : null}
        </Button>
    );
}
