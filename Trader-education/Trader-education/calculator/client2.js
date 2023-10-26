// client.js
const express = require('express');
const WebSocket = require('ws')

const app = express();

const PORT = 5000;

app.listen(PORT, (req, res) => {
    console.log(`app is listening on port ${PORT}`);
});

app.get("/getsymbolrate", function (req, res) {
    let respdata = [];
    var WebSocket = require('ws');
    try {
        // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJheGlhbmNlLmNhbGN1bGF0b3JAZ21haWwuY29tIiwidXNlcl91dWlkIjoiUExBWUVSLTMwN2NjNjQxLTA0OTQtNDgwZi1iMGZlLWZiZGExMzg0OWFkMyIsInJvbGUiOiJQTEFZRVIiLCJicmFuZElkIjoiZnNhIiwiaXNzIjoiSFJaTiBBdXRoIiwiZXhwIjoxNjYyNjQxMjM1LCJkZXBhcnRtZW50IjoiUExBWUVSIiwic2Vzc2lvbl91dWlkIjoiY2U5ZWU4NWItZDRjMC00MjgxLWI4ODctNDEzMWMzNzU2YzY5IiwiaWF0IjoxNjYyNjM5OTE1fQ.F2vJpuGtbmD7H_4nWZEeDkGEL3dZl77pbBUB_ek0gVY9ET3rOezDJMd0AAHfUm0PDtXowb5Eja9-sAIUuDFccw";
        const host = "api.qa01.trds.pro";
        const uuid = "358c5162-7eaf-45e3-81d9-bec48f3cf3ab";
        let url = `wss://${host}/mt4-streaming/public/socket/prices?token=${req.query.token}`;

        var ws = new WebSocket(url);
        ws.on('open', function (data) {
            // console.log('connection opened');
            ws.resume();
            let subscribe = {
                subscribe: [req.query.symbol],
                accountUUID: `MT5-${uuid}`
            }
            let message = subscribe;
            // ws.send('{"subscribe": ["EURUSD","JP225","GBPUSD","TSLA.US","1958.HK","JD.US","BIDU.US","BABA.US","EOSUSD","AUDUSD","US500","USDCAD","USDJPY","XAUUSD"],"accountUUID": "MT(4/5)-"' + uuid + '}');
            // console.log(ws.eventNames());
            ws.emit('connect', message);
        });
        ws.on('connect', function (data) {
            setTimeout(() => {
                ws.send(JSON.stringify(data));
                // console.log('message sent');
                ws.emit('message');
            }, 3000);
        });
        ws.on('message', function (data, flags) {
            if (data != undefined) {
                let response = JSON.parse(data.toString());
                // if (response.hasOwnProperty('EURUSD') && response.hasOwnProperty('GBPUSD')) {
                if (response.hasOwnProperty(req.query.symbol)) {
                    respdata.push(response);
                    ws.emit('close', response);
                }
            }
        });
        ws.on("close", (data) => {
            // console.log("the client has closed connection");
            console.log('close data: ', data);
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