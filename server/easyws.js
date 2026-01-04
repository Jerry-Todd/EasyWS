const WebSocket = require('ws');

class EasyWS {

    constructor(port) {
        this.wss = new WebSocket.Server({ port: port });
        this.clients = new Set();

        this.connectionHandler = (ws) => { }
        this.closeHandler = () => { }
        this.errorHandler = (error) => console.error('WebSocket error:', error)
        this.requestHandlers = {}
        this.defaultHandler = (data) => { }
    }

    Start() {

        this.wss.on('connection', (ws) => {
            this.clients.add(ws);

            this.connectionHandler(ws)

            ws.on('message', (message) => {
                let data;
                try {
                    data = JSON.parse(message)
                } catch (error) {
                    console.log(error)
                    return;
                }

                if (data.request && this.requestHandlers[data.request]) {
                    this.requestHandlers[data.request](ws, data)
                } else {
                    this.defaultHandler(ws, data)
                }

            });

            ws.on('close', () => {
                this.clients.delete(ws);
                this.closeHandler(ws);
            });

            ws.on('error', this.errorHandler);
        })
    }

    SetConnectHandler(func) {
        this.connectionHandler = func
    }
    SetCloseHandler(func) {
        this.closeHandler = func
    }
    SetErrorHandler(func) {
        this.errorHandler = func
    }

    SetHandler(request, func) {
        this.requestHandlers[request] = func
    }

    RemoveHandler(request) {
        delete this.requestHandlers[request]
    }

    Broadcast(data) {
        const message = JSON.stringify(data);
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    Send(client, data) {
        const message = JSON.stringify(data);
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }

    Close() {
        this.wss.close()
    }

}

module.exports = EasyWS