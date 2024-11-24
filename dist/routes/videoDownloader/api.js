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
exports.DownloadVideoFromY2Mate = exports.getHttpMethod = exports.convertY2mateData = exports.getFileName = exports.removeUnwantedChars = exports.getY2mateData = exports.fetchData = exports.WrapResponse = exports.instance = void 0;
const axios_1 = __importDefault(require("axios"));
const ytdl_core_1 = require("@distube/ytdl-core");
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const jet_logger_1 = __importDefault(require("jet-logger"));
function hasOwnProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
exports.instance = axios_1.default.create({
    baseURL: "https://www.y2mate.com",
});
function WrapResponse(fetchData) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetchData;
        if (res.status >= 300)
            throw new Error(`${res.statusText} With Code Status ${res.status}`);
        return (yield res.json());
    });
}
exports.WrapResponse = WrapResponse;
function fetchData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield WrapResponse(fetch("https://www.y2mate.com/mates/en948/analyzeV2/ajax", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                accept: "*/*",
                "accept-language": "en-GB,en;q=0.9,de-GB;q=0.8,de;q=0.7,ar-EG;q=0.6,ar;q=0.5,en-US;q=0.4",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                pragma: "no-cache",
                priority: "u=1, i",
                "sec-ch-ua": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
            },
            referrer: "https://www.y2mate.com/youtube/YtQKPJ2s86A",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: new URLSearchParams({
                k_query: `https://www.youtube.com/watch?v=${id}`,
                k_page: "home",
                hl: "en",
                q_auto: "0",
            }),
            method: "POST",
            mode: "cors",
            credentials: "include",
        }));
        if (isGoodY2mateData(data))
            return data;
        return null;
    });
}
exports.fetchData = fetchData;
function isGoodY2mateData(data) {
    if (!hasOwnProperty(data, "status") || data.status != "ok")
        return false;
    if (!hasOwnProperty(data, "links"))
        return false;
    return true;
}
function getY2mateData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let y2mateData = null;
        try {
            y2mateData = yield fetchData(id);
        }
        catch (error) {
            jet_logger_1.default.err(error);
        }
        const googleData = yield (0, ytdl_core_1.getInfo)(id, { requestOptions: {} });
        return {
            vid: googleData.vid,
            related_videos: googleData.related_videos,
            videoDetails: googleData.videoDetails,
            links: (y2mateData === null || y2mateData === void 0 ? void 0 : y2mateData.links) || { mp3: {}, mp4: {}, other: {} },
            formats: googleData.formats,
            info: {
                loudness: googleData.player_response.playerConfig.audioConfig.loudnessDb,
            },
        };
    });
}
exports.getY2mateData = getY2mateData;
function removeUnwantedChars(val) {
    return val.replace(/[/\\?%*:|"<>]/g, "-").replace(/#\w+/g, "");
}
exports.removeUnwantedChars = removeUnwantedChars;
function getFileName(data) {
    if (data.clipped) {
        return removeUnwantedChars(`YoutubeDownloader - ${data.title}_v${data.fquality} ${data.start}:${data.end}.${data.ftype}`);
    }
    else
        return removeUnwantedChars(`YoutubeDownloader - ${data.title}_v${data.fquality}.${data.ftype}`);
}
exports.getFileName = getFileName;
function convertY2mateData(id, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield WrapResponse(fetch("https://www.y2mate.com/mates/convertV2/index", {
            headers: {
                accept: "*/*",
                "accept-language": "en-GB,en;q=0.9,de-GB;q=0.8,de;q=0.7,ar-EG;q=0.6,ar;q=0.5,en-US;q=0.4",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                pragma: "no-cache",
                priority: "u=1, i",
                "sec-ch-ua": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
            },
            referrer: "https://www.y2mate.com/youtube/YtQKPJ2s86A",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: new URLSearchParams({
                k: key,
                vid: id,
            }),
            method: "POST",
            mode: "cors",
            credentials: "include",
        }));
        return {
            dlink: data.dlink,
            fquality: data.fquality,
            ftype: data.ftype,
            vid: id,
            title: data.title,
        };
    });
}
exports.convertY2mateData = convertY2mateData;
function getHttpMethod(dlink, range) {
    return new Promise((res) => {
        const headers = {
            "User-Agent": "Your User Agent Here",
        };
        if (range)
            headers["range"] = range;
        if (dlink.startsWith("https"))
            https_1.default.get(dlink, {
                headers,
            }, (response) => {
                res(response);
            });
        else
            http_1.default.get(dlink, {
                headers,
            }, (response) => {
                res(response);
            });
    });
}
exports.getHttpMethod = getHttpMethod;
function DownloadVideoFromY2Mate(id, key, range) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield convertY2mateData(id, key);
        const response = yield getHttpMethod(data.dlink, range);
        return [data, response];
    });
}
exports.DownloadVideoFromY2Mate = DownloadVideoFromY2Mate;
