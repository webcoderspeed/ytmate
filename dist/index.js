"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./pre-start");
const jet_logger_1 = __importDefault(require("jet-logger"));
const EnvVars_1 = __importDefault(require("@serv/declarations/major/EnvVars"));
const server_1 = __importDefault(require("./server"));
const next_1 = __importDefault(require("next"));
const dev = EnvVars_1.default.nodeEnv == "development";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app.prepare()
    .then(() => {
    server_1.default.get("*", (req, res) => {
        return handle(req, res);
    });
    const msg = "Express server started on port: " + EnvVars_1.default.port.toString();
    server_1.default.listen(EnvVars_1.default.port, () => jet_logger_1.default.info(msg));
})
    .catch((ex) => {
    jet_logger_1.default.err(ex.stack);
    process.exit(1);
});
