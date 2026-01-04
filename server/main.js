const EasyWS = require('./easyws.js');

const wss = new EasyWS(8080)

wss.SetHandler('ping', (client) => {
    wss.Send(client, {request: "pong"})
})

wss.Start()
console.log('Server running on ws://localhost:8080')