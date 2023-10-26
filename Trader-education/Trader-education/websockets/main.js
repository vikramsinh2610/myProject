var WebSocket = require('ws');
try {
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJheGlhbmNlLmNhbGN1bGF0b3JAZ21haWwuY29tIiwidXNlcl91dWlkIjoiUExBWUVSLTMwN2NjNjQxLTA0OTQtNDgwZi1iMGZlLWZiZGExMzg0OWFkMyIsInJvbGUiOiJQTEFZRVIiLCJicmFuZElkIjoiZnNhIiwiaXNzIjoiSFJaTiBBdXRoIiwiZXhwIjoxNjYyNTU2MzAyLCJkZXBhcnRtZW50IjoiUExBWUVSIiwic2Vzc2lvbl91dWlkIjoiMmM0NTc3YjUtMTliYS00NDU2LWI3ZTMtNWFjODZmNWQyMTg2IiwiaWF0IjoxNjYyNTU0OTgyfQ.DYvIxQGupS7zrN4pM_42ZiYimlUU2I1OK_Sjl9-RI5MJOlj4vvDdEHNpBSShY2z6YYgatAqg31iju-nzO51OOg";
  const host = "api.qa01.trds.pro";
  let url = `wss://${host}/mt4-streaming/public/socket/prices?token=${token}&efx=true`;

  console.log(url);

  var ws = new WebSocket(url);
  ws.on('open', function (data) {
    console.log('connection opened');
    ws.send('ping');
  });
  ws.on('connect', function () {
    console.log('socket connected');
  });
  ws.on('message', function (data, flags) {
    console.log(data, flags);
  });
  ws.on("close", (data) => {
    console.log("the client has closed connection");
    console.log('close data: ', data);
  });
  ws.on('error', function (error) {
    console.log(error);
  });
} catch (error) {
  console.log(error);
}