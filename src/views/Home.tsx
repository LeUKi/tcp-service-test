import React from "react";
import Header from "../components/Header";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useHistory } from "react-router-dom";
import { globalData } from "../App";
import { LoadingButton } from "@mui/lab";

const Home = () => {
  const history = useHistory();
  const [id, setId] = React.useState(globalData.id);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const { socket } = globalData;
  socket.off("getID");
  socket.on("getID", (data) => {
    console.log(data);
    setLoading(false);
    if (data.r) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  });
  return (
    <React.Fragment>
      <Header title="Test." />
      <main>
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <TextField
              id="outlined-basic"
              label="Id"
              variant="outlined"
              size="small"
              defaultValue={id}
              onChange={(e) => {
                setId(e.target.value);
                id !== "" && setLoading(true);
                id !== "" && socket.emit("getID", e.target.value);
              }}
            />

            <span className="ml-1">
              <LoadingButton
                onClick={() => {
                  globalData.id = id;
                  history.push("/opendoor");
                }}
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                disabled={id == "" || disabled}
              >
                开门
              </LoadingButton>
            </span>

            <span className="ml-1">
              <LoadingButton
                onClick={() => {
                  globalData.id = id;
                  history.push("/sendmsg");
                }}
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                disabled={id == "" || disabled}
              >
                实时通讯
              </LoadingButton>
            </span>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home;
