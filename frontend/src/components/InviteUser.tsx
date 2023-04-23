import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {UsersOnline} from "../types";

type InviteUserProps = {
    isOpen: boolean;
    player: UsersOnline
    onSubmit?: (user: UsersOnline) => void;
    onCancel?: (user: UsersOnline) => void;
}

export function InviteUser({isOpen, player, onSubmit, onCancel}: InviteUserProps) {

    const handleCancel = () => {
        onCancel && player && onCancel(player);
    };

    const handleOK = () => {
        onSubmit && player && onSubmit(player);
    };

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={handleCancel}
                sx={{"& .MuiDialog-paper": {borderRadius: "12px"}}}
            >
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 3,
                        fontWeight: "700",
                        fontSize: "22px",
                        backgroundImage: "linear-gradient(to right, #fb923c, #ec4899)",
                    }}
                >
                    New invite to play game...
                </DialogTitle>
                <Divider/>
                <DialogContent sx={{m: 0, paddingBottom: 4, paddingTop: 4}}>
                    <div className="text-2xl font-medium  text-slate-800">
                        {`User ${player.userName} want to play with You!!!`}
                    </div>
                </DialogContent>
                <Divider/>
                <DialogActions
                    sx={{
                        m: 0,
                        p: 2,
                        backgroundImage: "linear-gradient(to right, #fb923c, #ec4899)",
                    }}
                >
                    <Button
                        size="large"
                        onClick={handleCancel}
                        sx={{color: "black", fontSize: "16px", fontWeight: "600"}}
                    >
                        Disagree
                    </Button>
                    <Button
                        size="large"
                        onClick={handleOK}
                        sx={{color: "black", fontSize: "16px", fontWeight: "600"}}
                    >
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
