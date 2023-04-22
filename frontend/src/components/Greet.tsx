import Zoom from "@mui/material/Zoom";

export function Greet() {
    return (
        <div className="flex flex-col items-center  max-w-md min-w-[360px] ">
            <Zoom in={true} timeout={2000}>
                <img
                    className="w-full text-center mb-4 mt-10 text-3xl font-semibold rounded-xl aspect-square"
                    src="tic-tac-toe-cover.png"
                    alt="LET'S PLAY!!!"
                />
            </Zoom>
        </div>
    );
}
