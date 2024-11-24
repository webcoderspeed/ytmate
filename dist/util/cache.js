"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = (cache, timeToLive) => {
    const t = timeToLive || cache.options.stdTTL || 20;
    const sendFun = function (req, res, next) {
        if (req.method != "GET")
            return next();
        const url = req.originalUrl;
        const result = cache.get(url);
        if (result) {
            res.send(result);
        }
        else {
            res.originalSend = res.send;
            res.send = (body) => {
                res.originalSend(body);
                cache.set(url, body, t);
            };
            next();
        }
    };
    return sendFun;
};
exports.default = cache;
