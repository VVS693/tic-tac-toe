import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {useState} from "react";

type AddNameProps = {
    isOpen: boolean;
    onSubmit?: (name: string) => void;
    onCancel?: () => void;
}

export function AddName({isOpen, onSubmit, onCancel}: AddNameProps) {
    const [value, setValue] = useState("");

    const handleCancel = () => {
        onCancel && onCancel();
        setValue("");
    };

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        if (value.trim().length === 0) {
            return;
        }
        // console.log(value);
        onSubmit && onSubmit(value);
        setValue("");
    };

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={handleCancel}
                sx={{"& .MuiDialog-paper": {borderRadius: "12px"}}}
            >
                <form onSubmit={submitHandler}>
                    <DialogTitle
                        sx={{
                            m: 0,
                            p: 3,
                            fontWeight: "700",
                            fontSize: "22px",
                            backgroundImage: "linear-gradient(to right, #fb923c, #ec4899)",
                        }}
                    >
                        Input your name
                    </DialogTitle>
                    <Divider/>
                    <DialogContent sx={{m: 0, paddingBottom: 4, paddingTop: 4}}>
                        <TextField
                            value={value}
                            onChange={changeHandler}
                            autoFocus
                            margin="none"
                            id="name"
                            label="UserName"
                            type="text"
                            fullWidth
                            variant="standard"
                            sx={{"& .MuiInputBase-input": {fontSize: 28}}}
                        />
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
                            Cancel
                        </Button>
                        <Button
                            size="large"
                            type="submit"
                            sx={{color: "black", fontSize: "16px", fontWeight: "600"}}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}
