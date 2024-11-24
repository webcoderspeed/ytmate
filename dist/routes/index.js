"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playlist_1 = __importDefault(require("./playlist"));
const videoDownloader_1 = __importDefault(require("./videoDownloader"));
const download_1 = __importDefault(require("./download"));
const search_1 = __importDefault(require("./search"));
const cache_1 = __importDefault(require("@serv/util/cache"));
const node_cache_1 = __importDefault(require("node-cache"));
const EnvVars_1 = __importDefault(require("@serv/declarations/major/EnvVars"));
const enums_1 = require("@serv/declarations/enums");
const cors_1 = __importDefault(require("cors"));
const router = (0, express_1.Router)();
if (EnvVars_1.default.nodeEnv === enums_1.NodeEnvs.Production)
    router.use((0, cache_1.default)(new node_cache_1.default({
        stdTTL: 60 * 60,
        checkperiod: 60 * 60,
    })));
router.use((0, cors_1.default)({ origin: "*" }));
router.use("/playlist", playlist_1.default);
router.use("/watch", videoDownloader_1.default);
router.use("/search", search_1.default);
router.use("/download", download_1.default);
exports.default = router;
