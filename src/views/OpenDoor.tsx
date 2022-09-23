import React, { useEffect } from "react";
import Header from "../components/Header";
import io from "socket.io-client";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useHistory } from "react-router-dom";
import { globalData } from "../App";

const Home = () => {
  const [loading, setLoading] = React.useState(false);
  const [idExsit, setIdExsit] = React.useState(true);
  const history = useHistory();
  const { socket } = globalData;
  socket.off("opendoor");
  socket.on("opendoor", (data) => {
    setLoading(false);
    if (data.r) {
      setIdExsit(true);
    } else {
      setIdExsit(false);
    }
  });
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
          <LoadingButton
            size="small"
            onClick={() => {
              setLoading(true);
              socket.emit("opendoor", globalData.id);
            }}
            loading={loading}
            variant="contained"
            disabled={!idExsit || globalData.id == ""}
          >
            open the door!
          </LoadingButton>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home;
