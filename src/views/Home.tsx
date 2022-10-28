import React, { useEffect } from "react";
import Header from "../components/Header";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useHistory } from "react-router-dom";
import { globalData } from "../App";
import { LoadingButton } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";

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
  useEffect(() => {
    id !== "" && setLoading(true);
    id !== "" && socket.emit("getID", id);
  }, []);
  return (
    <React.Fragment>
      <Header title="TCP Socket Service." />
      <main>
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <TextField
              sx={{ mr: 1 }}
              id="outlined-basic"
              label="设备ID"
              variant="outlined"
              size="small"
              defaultValue={id}
              onChange={(e) => {
                setId(e.target.value);
                id !== "" && setLoading(true);
                id !== "" && socket.emit("getID", e.target.value);
              }}
            />

            <span className="mr-1">
              <LoadingButton
                onClick={() => {
                  globalData.id = id;
                  history.push("/ctrl");
                }}
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                disabled={id == "" || disabled}
              >
                开始控制
              </LoadingButton>
            </span>

            <span className="mr-1">
              <LoadingButton
                onClick={() => {
                  globalData.id = id;
                  history.push("/test");
                }}
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                disabled={id == "" || disabled}
              >
                开始调试
              </LoadingButton>
            </span>
          </div>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>这是什么</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {
                  "这是一个简单的Web应用，用于控制或调试基于TCP Socket中间件服务的板子。后台基于node实现socket连接池并通过http与websocket协议向上层暴露接口，你可以使用这些接口开发自己的应用。"
                }
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>开始使用</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{"首先需要将TCP服务端设置为"}</Typography>
              <Typography align="center">{"114.115.247.94:3001"}</Typography>
              <Typography>{"可以用网络串口助手等工具辅助调试。"}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>注册设备id</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {
                  "为了在连接池中找到你的设备，需要为你的设备绑定一个id，请在透传下发送设备的id，尽量复杂但简短，无需\\r\\n，绑定成功将返回ok，二次绑定将覆盖之前的id。"
                }
              </Typography>
              <Typography align="center">{"regID=<id>"}</Typography>
              <Typography align="center">{"例子：regID=device1"}</Typography>
              <Typography>
                {
                  "查询设备id，在透传下发送下面指令，一定要带上等于号，成功将返回设备id，失败将返回NOT REGISTER。"
                }
              </Typography>
              <Typography align="center">{"getID="}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>在网页中调试</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {
                  "在这个页面上方输入你的设备id，点击开始实时调试，你可以在页面中向设备发送指令，也可以接收设备的消息。"
                }
              </Typography>
              <Typography>
                {"板子发送消息需要在透传下发送下面的指令，发送成功将返回ok。"}
              </Typography>
              <Typography align="center">{"msg=<msg>"}</Typography>
              <Typography align="center">{"例子：msg=helloworld!"}</Typography>
              <Typography>
                {"当按钮不可点击时，说明设备不在线，或者设备id未注册。"}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>WebSocket API</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {
                  "WS支持双向通信，如果您恰巧掌握websocket使用方法，可以直接使用ws协议与设备交互。请直接使用下方的websocket地址，发送指令即可。"
                }
              </Typography>
              <Typography align="center">
                {"ws://114.115.247.94:3000"}
              </Typography>
              <Typography>
                {`发送 emit("msg",{id:"<id>",msg:"<msg>"})`}
              </Typography>
              <Typography>{`接收 on("msg<id>")`}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>HTTP API</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {
                  "HTTP仅支持单向通信，如果您恰巧掌握HTTP协议，可以直接使用GET方法与设备交互。请直接使用下方的地址，发送请求即可。"
                }
              </Typography>
              <Typography align="center">
                {"http://114.115.247.94:3000/lafish/sendmsg?<id>&<msg>"}
              </Typography>
              <Typography align="center">
                {"例子：http://114.115.247.94:3000/lafish/sendmsg?device1&helloworld"}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>关于</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {
                  "中间件主要功能就是面向纯TCP连接、管理连接池、转发消息、向上层提供接口，更多的应该是在上层实现，比如说用户设备绑定、设备在线状态、设备消息推送等等。 "
                }
              </Typography>
              <Typography>
                {"可以的话给个"}
                <a href="https://github.com/LeUKi/tcp-service-test">🌟</a>{" "}
                {"，祝玩得开心。"}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home;
