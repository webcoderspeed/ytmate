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
exports.getPlayListData = void 0;
const youtube_playlists_js_1 = require("youtube-playlists-js");
function getPlayListData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, youtube_playlists_js_1.GetData)((0, youtube_playlists_js_1.MergeUrl)(id));
    });
}
exports.getPlayListData = getPlayListData;
