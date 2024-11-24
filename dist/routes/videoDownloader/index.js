"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HttpStatusCodes_1 = __importDefault(require("@serv/declarations/major/HttpStatusCodes"));
const ytdl_core_1 = require("@distube/ytdl-core");
const api_1 = require("./api");
const router = (0, express_1.Router)();
router.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof req.query.v !== "string" || !(0, ytdl_core_1.validateID)(req.query.v))
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ status: false, msg: "the video id must be exist" });
        try {
            const data = yield (0, api_1.getY2mateData)(req.query.v);
            res.status(200).json({ msg: "Success", status: true, data });
        }
        catch (err) {
            return res.status(404).json({
                msg: "The video is not exist",
                status: false,
                err: err.toString(),
            });
        }
    });
});
router.get("/convert", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof req.query.vid !== "string" || !(0, ytdl_core_1.validateID)(req.query.vid))
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ status: false, msg: "the video id must be exist" });
        if (typeof req.query.k !== "string")
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ status: false, msg: "the key must be exist" });
        try {
            const data = yield (0, api_1.convertY2mateData)(req.query.vid, req.query.k);
            res.status(200).json({ msg: "Success", status: true, data });
        }
        catch (err) {
            return res
                .status(404)
                .json({ msg: "The video is not exist", status: false, err });
        }
    });
});
router.get("/download", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof req.query.vid !== "string" || !(0, ytdl_core_1.validateID)(req.query.vid))
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ status: false, msg: "the video id must be exist" });
        if (typeof req.query.k !== "string")
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ status: false, msg: "the key must be exist" });
        const [data, response] = yield (0, api_1.DownloadVideoFromY2Mate)(req.query.vid, req.query.k, req.headers.range);
        if (!response.statusCode || response.statusCode >= 300)
            return res
                .status(response.statusCode || HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({
                msg: "Error happened on the server",
                status: false,
            });
        res.writeHead(response.statusCode, {
            date: response.headers["date"],
            connection: response.headers["connection"],
            "cache-control": response.headers["cache-control"],
            "content-type": response.headers["content-type"],
            "content-length": response.headers["content-length"],
            expires: response.headers["expires"],
            "accept-ranges": response.headers["accept-ranges"],
            "cf-cache-status": response.headers["cf-cache-status"],
            "content-disposition": `attachment; filename="${encodeURIComponent((0, api_1.getFileName)(Object.assign(Object.assign({}, data), { clipped: false })))}"`,
        });
        response.pipe(res);
    });
});
exports.default = router;
