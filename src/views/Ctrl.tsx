import React, { useEffect } from "react";
import Header from "../components/Header";
import io from "socket.io-client";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useHistory } from "react-router-dom";
import { globalData } from "../App";
import { HuePicker } from "react-color";

const Home = () => {
  const [loading, setLoading] = React.useState(false);
  const [idExsit, setIdExsit] = React.useState(true);
  const [color, setColor] = React.useState("#ff0000");
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
            开门
          </LoadingButton>
          <div className="mt-2">
            <HuePicker
              color={color}
              onChangeComplete={(color) => {
                setColor(color.hex);
                !(!idExsit || globalData.id == "") &&
                  socket.emit("msg", {
                    id: globalData.id,
                    msg: `color=${color.hex.slice(1)}`,
                  });
              }}
              height="60px"
              width="100%"
              // @ts-ignore
              pointer={() => (
                <div
                  style={{
                    width: "20px",
                    height: "70px",
                    borderRadius: "10px",
                    background: color,
                    border: "1px solid #000",
                    transform: "translate(-10px, -5px)",
                  }}
                />
              )}
            />
          </div>
          <div className=" text-gray-400 text-xs">
            {color} 设备更新有延迟，请勿频繁操作
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home;
