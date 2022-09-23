import React, { useEffect } from "react";
import Header from "../components/Header";
import io from "socket.io-client";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useHistory } from "react-router-dom";
const SendMsg = () => {
  const [loading, setLoading] = React.useState(true);
  const [idExsit, setIdExsit] = React.useState(false);
  const history = useHistory();
  const socket = io("114.115.247.94:3000", { transports: ["websocket"] });
  socket.on("opendoor", (data) => {
    console.log(data);
    setLoading(false);
  });
  socket.on("test", (data) => {
    console.log(data);
  });
  socket.on("getID", (data) => {
    console.log(data);
    if (data.r) {
      setLoading(false);
    } else {
      setIdExsit(true);
    }
  });
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");

      socket.emit(
        "getID",
        (location.search.split("?")[1] &&
          location.search.split("?")[1].split("=")[0]) ||
          "undefined"
      );
    });
  }, []);
  return (
    <React.Fragment>
      {/* <Header title="Home" /> */}
      <main>
        {idExsit && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {(location.search.split("?")[1] &&
              location.search.split("?")[1].split("=")[0]) ||
              "undefined"}
            <strong> unexpected id!</strong>
          </Alert>
        )}
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <LoadingButton
            size="small"
            onClick={() => {
              setLoading(true);
              socket.emit(
                "opendoor",
                location.search.split("?")[1].split("=")[0]
              );
            }}
            loading={loading}
            loadingIndicator="Loading…"
            variant="contained"
          >
            open the door!
          </LoadingButton>
        </div>
      </main>
    </React.Fragment>
  );
};

export default SendMsg;
