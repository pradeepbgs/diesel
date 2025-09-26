"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connInfo = connInfo;
function connInfo(req) {
    var _a, _b, _c, _d;
    var headers = {};
    console.log(req.socket);
    if ('headers' in req) {
        if ('get' in req.headers) {
            headers = Object.fromEntries((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.entries());
        }
        else {
            headers = req.headers;
        }
    }
    var protocol = ((_b = headers['x-forwarded-proto']) === null || _b === void 0 ? void 0 : _b.split(',')[0]) ||
        ('socket' in req && ((_c = req.socket) === null || _c === void 0 ? void 0 : _c.encrypted) ? 'https' : 'http');
    var host = headers['host'] || '';
    var ip;
    var forwarded = headers['x-forwarded-for'];
    if (forwarded) {
        ip = forwarded.split(',')[0].trim();
    }
    else if ('socket' in req && ((_d = req.socket) === null || _d === void 0 ? void 0 : _d.remoteAddress)) {
        ip = req.socket.remoteAddress;
    }
    var url = 'url' in req
        ? req.url
        : "".concat(protocol, "://").concat(host).concat(req.url || '');
    return {
        protocol: protocol,
        host: host,
        url: url,
        ip: ip,
        headers: headers,
    };
}
