"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromEntries = exports.extractHost = exports.jsonParse = void 0;
var jsonParse = function (data) {
    var body = null;
    try {
        body = JSON.parse(data);
    }
    catch (e) {
        body = data;
    }
    return body;
};
exports.jsonParse = jsonParse;
var extractHost = function (url) {
    var _a;
    // const host = url.split('//')[1]?.split(':')[0]?.split('/')[0] || undefined;
    var host = ((_a = url.split('//')[1]) === null || _a === void 0 ? void 0 : _a.split('/')[0]) || undefined;
    return host;
};
exports.extractHost = extractHost;
var fromEntries = function (arr) { return arr.reduce(function (acc, _a) {
    var k = _a[0], v = _a[1];
    acc[k] = v;
    return acc;
}, {}); };
exports.fromEntries = fromEntries;
