import React, { useEffect } from "react";
import Header from "../components/Header";
import io from "socket.io-client";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AlertTitle from "@mui/material/AlertTitle";
import { useHistory } from "react-router-dom";
import { globalData } from "../App";
import {
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";

const Home = () => {
  const [loading, setLoading] = React.useState(false);
  const [idExsit, setIdExsit] = React.useState(true);
  const [msg, setMsg] = React.useState("");
  const history = useHistory();
  const { socket } = globalData;
  const [msgList, setMsgList] = React.useState<[any] | []>([]);
  useEffect(() => {
    socket.off("msg" + globalData.id);
    socket.on("msg" + globalData.id, (data: any) => {
      setLoading(false);
      if (data.r) {
        setIdExsit(true);
        msgList.unshift(data as never);
        setMsgList([...msgList]);
      } else {
        setIdExsit(false);
      }
    });
    return () => {
      socket.off("msg" + globalData.id);
    };
  }, []);
  return (
    <React.Fragment>
      {/* <Header title="Home" /> */}
      <main>
        {(!idExsit || globalData.id == "") && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {globalData.id || "undefined"}
            <strong> unexpected id!</strong>
          </Alert>
        )}
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Send message"
              defaultValue={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <LoadingButton
              sx={{ p: "10px" }}
              size="small"
              onClick={() => {
                setLoading(true);
                socket.emit("msg", { id: globalData.id, msg });
              }}
              loading={loading}
              disabled={!msg}
              color={!idExsit || globalData.id == "" ? "error" : "primary"}
            >
              <ArrowUpwardIcon />
            </LoadingButton>
          </Paper>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {/* <Divider variant="inset" /> */}
            {msgList.map((d: any) => (
              <>
                <ListItem disablePadding key={d.msg}>
                  <ListItemButton>
                    <ListItemIcon>
                      {d.s ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                    </ListItemIcon>
                    <ListItemText primary={d.msg} />
                  </ListItemButton>
                </ListItem>
                <Divider variant="inset" />
              </>
            ))}
          </List>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home;
