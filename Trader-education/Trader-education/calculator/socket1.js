const express = require('express');
const WebSocket = require('ws')

// const app = express();
// let lavateck = require('./client')
let lavateck = {}
let tradingeconomics = {}
// let myKey = require('./userKey')
let myKey = 'p99rxqwqkyeeiyz:mu94vctmog0lxs9'
let keySecretArray = myKey.split(':')

let key = keySecretArray[0];
let secret = keySecretArray[1];




let respdata = [];
// var WebSocket = require('ws');

const sockserver = new WebSocket.Server({ port: 5001 });
// console.log("sockserver", sockserver);
let symbol = '';
sockserver.on('connection', (ws, req) => {
    // let token = '';
    var axios = require('axios');
    var data = JSON.stringify({
        "brandId": "fsa",
        "device": "API",
        "login": "axiance.calculator@gmail.com",
        "password": "Axiance96!"
    });

    var config = {
        method: 'post',
        url: 'https://api.qa01.trds.pro/auth/signin',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            let token = response.data.token;
            let url = `wss://api.qa01.trds.pro/mt4-streaming/public/socket/prices?token=${token}`;

            var wss = new WebSocket(url);
            wss.on('open', function (data) {
                wss.resume();
                let subscribe = {
                    subscribe: [req.headers.symbol],
                    accountUUID: 'MT5-b1605e9d-f61f-4883-84fc-da1145c4883e'
                }
                let message = subscribe;
                wss.emit('connect', message);
            });
            wss.on('connect', function (data) {
                setTimeout(() => {
                    wss.send(JSON.stringify(data));
                    wss.emit('message');
                }, 3000);
            });
            wss.on('message', function (data, flags) {
                if (data != undefined) {

                    lavateck = JSON.parse(data.toString());
                }
            });
            wss.on("close", (data) => {
                // console.log(data);
                let dataa;
                Object.entries(data).forEach(item => {
                    dataa = item[1];
                    dataa.Symbol = item[0];
                })

                wss.terminate();
                // res.send(dataa);
            });
            wss.on('error', function (error) {
                console.log(error);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    symbol = req.headers.symbol;

    var te_client = require('./te_client'),
        Client = new te_client({
            url: 'ws://stream.tradingeconomics.com/',
            key: key,
            secret: secret,
        })

    // Client.subscribe(['CURRENCIES', 'commodities'])
    let sbscribe_symbole = `${req.headers.symbol}:CUR`;
    Client.subscribe(sbscribe_symbole)

    Client.on('message', function (msg) {
        tradingeconomics = msg
    })

    ws.on('close', () => console.log('Client has disconnected!'));
});

setInterval(() => {
    sockserver.clients.forEach((client) => {

        let bid = lavateck.bid !== undefined ? lavateck.bid : (tradingeconomics.bid !== undefined ? tradingeconomics.bid : '');
        let ask = lavateck.ask !== undefined ? lavateck.ask : (tradingeconomics.ask !== undefined ? tradingeconomics.ask : '');
        let timestamp = lavateck.timestamp !== undefined ? lavateck.timestamp : (tradingeconomics.timestamp !== undefined ? tradingeconomics.timestamp : '');
        let pdc = lavateck.pdc !== undefined ? lavateck.pdc : (tradingeconomics.pch !== undefined ? tradingeconomics.pch : '');
        let cdh = lavateck.cdh !== undefined ? lavateck.cdh : (tradingeconomics.dhigh !== undefined ? tradingeconomics.dhigh : '');
        let cdl = lavateck.cdl !== undefined ? lavateck.cdl : (tradingeconomics.dlow !== undefined ? tradingeconomics.dlow : '');

        let response = {
            symbol: symbol,
            bid: bid,
            ask: ask,
            timestamp: timestamp,
            pdc: pdc,
            cdh: cdh,
            cdl: cdl
        }

        // if (Object.keys(lavateck).length === 0) {
        //     response.symbol = symbol;
        //     response.bid = tradingeconomics.bid;
        //     response.ask = tradingeconomics.ask;
        //     response.timestamp = tradingeconomics.dt;
        //     response.pdc = tradingeconomics.pch;
        //     response.cdh = tradingeconomics.dhigh;
        //     response.cdl = tradingeconomics.dlow;
        //     response.viku = "trade";
        // } else {
        //     response.symbol = symbol;
        //     response.bid = lavateck.bid;
        //     response.ask = lavateck.ask;
        //     response.timestamp = lavateck.timestamp;
        //     response.pdc = lavateck.pdc;
        //     response.cdh = lavateck.cdh;
        //     response.cdl = lavateck.cdl;
        //     response.viku = "lava";
        // }
        // let test = Object.keys(lavateck).length === 0 ? tradingeconomics : lavateck;
        // console.log("tradingeconomics", test);
        // const newData = [{ lavateck }, { tradingeconomics }]
        const newData = [response]
        const data = JSON.stringify(newData);
        client.send(data);
    });
}, 1000);