# EasyWS

A simple WebSocket library with server (Node.js) and client (Lua) implementations.

## Server (Node.js)

### Installation
```bash
npm install ws
```

### Basic Usage

```javascript
const EasyWS = require('./easyws.js');

const server = new EasyWS(8080);

// Set up handlers
server.SetHandler('ping', (client, data) => {
    server.Send(client, { request: "pong" });
});

server.Start();
```

### API

- `new EasyWS(port)` - Create a new WebSocket server
- `Start()` - Start the server
- `SetHandler(request, func)` - Handle specific request types
- `RemoveHandler(request)` - Remove a handler
- `SetConnectHandler(func)` - Handle new connections
- `SetCloseHandler(func)` - Handle disconnections
- `SetErrorHandler(func)` - Handle errors
- `Send(client, data)` - Send data to specific client
- `Broadcast(data)` - Send data to all clients
- `Close()` - Close the server

## Client (Lua)

### Basic Usage

```lua
local ws = require("easyws")

ws.NewHandler("pong", function(data)
    print("Received pong!")
end)

function Main()
    ws.Send({ request = "ping" })
end

ws.Run("ws://localhost:8080", Main)
```

### API

- `Run(address, callback, ...)` - Connect to server and run callback
- `Stop()` - Close the connection
- `Send(data)` - Send data to server
- `NewHandler(request, func)` - Handle specific request types
- `RemoveHandler(request)` - Remove a handler
- `SetDefaultHandler(func)` - Handle unmatched requests

## Message Format

Messages are JSON objects. As long as there is a `request` field for routing, you can include any additional data:

```json
{ "request": "ping", "timestamp": 12345, "custom": "data" }
```

If a message has no `request` field, or the `request` doesn't have a registered handler, the message will be passed to the default handler.
