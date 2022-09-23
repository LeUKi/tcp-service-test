const net = require('net')
const http = require("http");
const server = http.createServer();
const tssport = 3001;
const sioport = 3000;
let io = require('socket.io')(server);
server.on("request", (req, res) => {
    switch (req.url.split("?")[0]) {
        case "/lafish/opendoor":
            let id = req.url.split("?")[1]
            if (!socketPool.has(id)) {
                res.end("Error. Id is unexpected. Made by lafish with love.\r\n")
                console.log("http Server: opendoor Error. Id is unexpected.");
            } else {
                socketPool.get(id).scoket.write("open\r\n");
                res.end("ok")
                console.log(`http Server: ${id} is open`);
            }
            break;
        case "/lafish/newpwd":
            let cmd = req.url.split("?")[1]
            let [id2, pwd] = cmd.split("&")
            if (!socketPool.has(id2)) {
                res.end("Error. Id is unexpected. Made by lafish with love.\r\n")
                console.log("http Server: newpwd Error. Id is unexpected.");
            } else {
                socketPool.get(id2).scoket.write(`pwd=${pwd}\r\n`);
                res.end("ok")
                console.log(`http Server: ${id2}'s pwd is setting`);
            }
            break;
        case "/lafish/  ":
            let cmd1 = req.url.split("?")[1]
            let [id3, msg] = cmd1.split("&")
            if (!socketPool.has(id3)) {
                res.end("Error. Id is unexpected. Made by lafish with love.\r\n")
                console.log("http Server: sendmsg Error. Id is unexpected.");
            } else {
                socketPool.get(id3).scoket.write(`${msg}\r\n`);
                res.end("ok")
                console.log(`http Server: ${id3} is sent '${msg}'`);
            }
            break;
        default:
            res.end("bad cmd")
            console.log("http Server: bad cmd");
            break;
    }
});
server.listen(sioport, () => {
    console.log("http Server: listening on 3000");
});
// setInterval(() => {
//     io.emit("test", "test");
// }, 1000);
io.on("connection", (ws) => {
    console.log("a ws connected");
    ws.on("message", (d) => console.log(d))
    ws.on("opendoor", (d) => {
        if (!socketPool.has(d)) {
            console.log(`wss: Id <${d}> is unexpected.`);
            ws.emit("opendoor", { c: `wss: Id is unexpected.`, r: false })
        } else {
            socketPool.get(d).scoket.write("open\r\n");
            ws.emit("opendoor", { c: `ok`, r: true })
            console.log(`wss: ${d} is open`);
        }
    })
    ws.on("getID", (d) => {
        if (!socketPool.has(d)) {
            console.log(`wss: Id <${d}> is unexpected.`);
            ws.emit("getID", { c: `wss: Id is unexpected.`, r: false })
        } else {
            ws.emit("getID", { c: `ok`, r: true })
            console.log(`wss: ${d} is exist`);
        }
    })
    ws.on("msg", (d) => {
        if (!socketPool.has(d.id)) {
            console.log(`wss: Id <${d.id}> is unexpected.`);
            ws.emit("msg" + d.id, { c: `wss: Id is unexpected.`, r: false })
        } else {
            socketPool.get(d.id).scoket.write(d.msg);
            ws.emit("msg" + d.id, { s: true, msg: d.msg, r: true })
            console.log(`wss: "${d.msg}" is send to <${d.id}>`);
        }
    })
});



const socketPool = new Map();

const socketEnd = (socketID) => {
    if (socketPool.has(socketID)) {
        const { scoket } = socketPool.get(socketID);
        scoket && scoket.end();
        scoket && scoket.destroy();
        scoket && scoket.unref();
        scoket && socketPool.delete(socketID);
    }
}
net.createServer((scoket) => {
    const sk = {
        scoket,
        remoteAddressPort: `${scoket.remoteAddress}:${scoket.remotePort}`,
        id: "NOT REGISTER",
        s: undefined,
    }
    scoket.on("error", (e) => {
        console.log(e);
        socketEnd(sk.id)
    })
    console.log(`${sk.remoteAddressPort}已经连接成功`)
    let tempData
    scoket.on('data', (data) => {
        console.log(`${sk.remoteAddressPort}收到数据:`);
        if (data.length > 20) {
            scoket.write("Error. Cmd size is limmited 20b! Made by lafish with love.\r\n");
            scoket.end();
            return;
        }
        console.log(data);
        // console.log(data.toString());
        let str = data.toString();
        tempData = data;
        sk.s && clearTimeout(s)
        switch (str.split('=')[0]) {
            case "regID":
                sk.id = str.split('=')[1];
                socketPool.has(sk.id) && socketPool.delete(sk.id)
                socketPool.set(sk.id, sk)
                scoket.write("ok\r\n")
                break;
            case "getID":
                scoket.write(sk.id + "\r\n")
                break;
            case "ot":
                scoket.write(sk.id + "\r\n")
                break;
            case "msg":
                io.emit("msg" + sk.id, { s: false, r: true, msg: str.split('=')[1] })
                scoket.write("ok\r\n")
                break;

            default:
                scoket.write("Error. Cmd type is unexpected. Made by lafish with love.\r\n")
                break;
        }
        io.emit(sk.id, str);

    })
    scoket.on('close', (data) => {
        clearTimeout(sk.s)
        socketEnd(sk.id)
        console.log(`${sk.remoteAddressPort}正在关闭`)
        console.log(`当前连接池数量${socketPool.size}`)

    })

}).listen(tssport, '0.0.0.0')

console.log(`Socket Server is listening on ${tssport}`)