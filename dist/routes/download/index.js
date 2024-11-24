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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("./api");
const router = (0, express_1.Router)();
function isString(val) {
    return typeof val == "string" || val instanceof String;
}
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isString(req.body.imageUrl))
            return res.status(400).json({ error: "Image URL is required" });
        const response = yield (0, api_1.DownloadFile)(req.body.imageUrl);
        Object.entries(response.headers).map(([head, val]) => {
            res.setHeader(head, val);
        });
        response.data.pipe(res);
    });
});
exports.default = router;
