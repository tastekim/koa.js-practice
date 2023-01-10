"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var ws_1 = __importDefault(require("ws"));
var app = new koa_1.default();
var WsServer = /** @class */ (function () {
    function WsServer() {
        var _this = this;
        if (!this.wss) {
            this.wss = new ws_1.default.Server({ port: 4001 });
        }
        this.wss.on('connection', function (ws) {
            _this.ws = ws;
        });
    }
    Object.defineProperty(WsServer.prototype, "socket", {
        get: function () {
            if (!this.ws) {
                console.log("ws\uAC00 \uB110\uC774\uB2E4.....");
            }
            else {
                return this.ws;
            }
        },
        enumerable: false,
        configurable: true
    });
    return WsServer;
}());
var wss = new WsServer();
wss.socket.on('message', function (data) { });
app.use(function (ctx) {
    ctx.body = 'hi koa';
});
app.listen(3000);
//# sourceMappingURL=index.js.map