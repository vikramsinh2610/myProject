// client.js
const express = require('express');
const WebSocket = require('ws')

const app = express();

const PORT = 5000;

app.listen(PORT, (req, res) => {
    console.log(`app is listening on port ${PORT}`);
});
let lavateck = {}
let tradingeconomics = {}

app.get("/symbols-test", function (req, res) {
    console.log("test api called");
    res.send("test tettstst");
});

app.get("/symbols", function (req, res) {
    let respdata = [];
    var WebSocket = require('ws');
    try {
        let url = `wss://${req.query.host}/mt4-streaming/public/socket/prices?token=${req.query.token}`;

        var ws = new WebSocket(url);
        ws.on('open', function (data) {
            ws.resume();
            let subscribe = {
                subscribe: [req.query.symbol],
                accountUUID: req.query.uuid
            }
            let message = subscribe;
            ws.emit('connect', message);
        });
        ws.on('connect', function (data) {
            setTimeout(() => {
                ws.send(JSON.stringify(data));
                ws.emit('message');
            }, 3000);
        });
        ws.on('message', function (data, flags) {
            if (data != undefined) {

                lavateck = JSON.parse(data.toString());
                // if (lavateck.hasOwnProperty(req.query.symbol)) {
                //     console.log(lavateck);
                //     respdata.push(lavateck);
                //     // lavateck = lavateck;
                //     // ws.emit('close', lavateck);
                // }

                if (lavateck.hasOwnProperty(req.query.symbol)) {
                    respdata.push(lavateck);
                    ws.emit('close', lavateck);
                }
            }
        });
        ws.on("close", (data) => {
            console.log(data);
            let dataa;
            Object.entries(data).forEach(item => {
                dataa = item[1];
                dataa.Symbol = item[0];
            })

            ws.terminate();
            res.send(dataa);
        });
        ws.on('error', function (error) {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
})

// export const newlavatek = lavateck;
module.exports = { lavateck }

