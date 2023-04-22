import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Message, UserStatus, UsersOnline } from "../types";
import { sendMessage } from "../socket.service";

type UsersOnlineListProps = {
  isOpen: boolean;
  me: UsersOnline;
  users: UsersOnline[];
  onClick: (el: UsersOnline) => void
};

export function UserOnlineList({ isOpen, users, me, onClick }: UsersOnlineListProps) {

  return (
    <div>
      <Dialog
        open={isOpen}
        fullWidth
        maxWidth="xs"
        sx={{ "& .MuiDialog-paper": { borderRadius: "12px" } }}
      >
        <DialogTitle
          sx={{
            fontWeight: "700",
            fontSize: "22px",
            backgroundImage: "linear-gradient(to right, #fb923c, #ec4899)",
          }}
        >
          Invite the user to play...
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ padding: 0, marginTop: 1, marginBottom: 1 }}>
          <List disablePadding>
            {users.map((el) => {
              if (el.userName !== me?.userName) {
                return (
                  <ListItem key={el.socketId} disablePadding>
                    <ListItemButton
                      onClick={() => onClick(el)}
                      disabled={el.status !== "WAITING" ? true : false}
                    >
                      <div className="text-2xl font-medium pl-5 pr-5 text-slate-800">
                        {el.userName}
                      </div>
                    </ListItemButton>
                  </ListItem>
                );
              }
            })}
            {users?.length === 1 && me && (
              <ListItem key="noUsersOnline" disablePadding>
                <ListItemButton disableRipple>
                  <div className="text-2xl font-medium pl-5 pr-5 text-slate-800">
                    Nobody online... only You)))
                  </div>
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </DialogContent>
        <Divider />
        <DialogTitle
          sx={{
            fontWeight: "700",
            fontSize: "22px",
            backgroundImage: "linear-gradient(to right, #fb923c, #ec4899)",
          }}
        >
          <div>{`Users online: ${users ? users.length : 0}`}</div>
        </DialogTitle>
      </Dialog>
    </div>
  );
}
