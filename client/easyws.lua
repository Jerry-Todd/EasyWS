local M = {}

local ws, err

local requestHandlers = {}
local defaultHandler = function(message)
    return false, "WS: No default handler."
end

local running = false

function M.Run(address, callback, ...)
    ws, err = http.websocket(address)

    if not ws then
        print(err)
        return false, err
    end

    running = true

    local args = { ... }

    parallel.waitForAll(
        function()
            while true do
                ::receive::
                if not running then break end
                local message = ws.receive()
                if not message then
                    print("WS: Connection closed, no message")
                    ws.close()
                    break
                end
                local success, data = pcall(textutils.unserialiseJSON, message)
                if not success or not data or not data.request then
                    print("WS: Invalid JSON or data format.")
                    goto receive
                end

                -- Handler
                if requestHandlers[data.request] then
                    requestHandlers[data.request](data)
                else
                    defaultHandler(data)
                end
            end
        end,
        function()
            callback(table.unpack(args))
        end
    )

    return true
end

function M.Stop()
    running = false
    if ws then
        ws.close()
        ws = nil
    end
end

function M.Send(data)
    if ws then
        ws.send(textutils.serializeJSON(data))
    end
end

function M.SetDefaultHandler(func)
    defaultHandler = func
end

function M.NewHandler(request, func)
    requestHandlers[request] = func
    return request
end

function M.RemoveHandler(request)
    requestHandlers[request] = nil
end

return M
