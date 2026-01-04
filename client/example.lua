local ws = require("easyws")

ws.NewHandler("pong", function ()
    print("Pong")
    ws.Stop()
end)

function Main()
    print("Ping")
    ws.Send({request = "ping"})
end

ws.Run("ws://localhost:8080", Main)

