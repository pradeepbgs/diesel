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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = serve;
var http = require("node:http");
function convertNodeReqToWebReq(req) {
    return __awaiter(this, void 0, void 0, function () {
        var protocol, url, init;
        var _a;
        return __generator(this, function (_b) {
            protocol = ((_a = req.headers['x-forwarded-proto']) === null || _a === void 0 ? void 0 : _a.split(',')[0]) || 'http';
            url = "".concat(protocol, "://").concat(req.headers.host).concat(req.url);
            init = {
                method: req.method,
                headers: req.headers,
                body: null
            };
            if (req.method !== 'GET' && req.method !== 'PUT') {
                init.body = new ReadableStream({
                    start: function (controller) {
                        req.on('data', function (chunk) { return controller.enqueue(new Uint8Array(chunk)); });
                        req.on('end', function () { return controller.close(); });
                        req.on('error', function (err) { return controller.error(err); });
                    }
                });
            }
            return [2 /*return*/, new Request(url, init)];
        });
    });
}
function sendWebResToNodeRes(webRes, nodeRes) {
    return __awaiter(this, void 0, void 0, function () {
        var reader, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nodeRes.writeHead(webRes.status, Object.fromEntries(webRes.headers));
                    reader = (_a = webRes.body) === null || _a === void 0 ? void 0 : _a.getReader();
                    if (!reader) return [3 /*break*/, 3];
                    result = void 0;
                    _b.label = 1;
                case 1: return [4 /*yield*/, reader.read()];
                case 2:
                    if (!!(result = _b.sent()).done) return [3 /*break*/, 3];
                    nodeRes.write(Buffer.from(result.value));
                    return [3 /*break*/, 1];
                case 3:
                    nodeRes.end();
                    return [2 /*return*/];
            }
        });
    });
}
function serve(options) {
    var _this = this;
    var server = http.createServer(function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var webRequest, webRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, convertNodeReqToWebReq(request)];
                case 1:
                    webRequest = _a.sent();
                    return [4 /*yield*/, options.fetch(webRequest, server)];
                case 2:
                    webRes = _a.sent();
                    return [4 /*yield*/, sendWebResToNodeRes(webRes, response)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    server.listen(options.port, function () { return console.log('node server running on port 3000'); });
}
