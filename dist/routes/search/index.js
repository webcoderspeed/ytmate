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
const api_1 = require("./api");
const jet_logger_1 = __importDefault(require("jet-logger"));
const router = (0, express_1.Router)();
router.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof req.query.search_query !== "string")
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ status: false, msg: "the video id must be exist" });
        try {
            const search = yield (0, api_1.getSearchData)(req.query.search_query);
            res.status(200).json({ msg: "Success", status: true, data: search });
        }
        catch (err) {
            jet_logger_1.default.warn(err);
            return res
                .status(404)
                .json({ msg: "The Video not found", status: false, err });
        }
    });
});
exports.default = router;
