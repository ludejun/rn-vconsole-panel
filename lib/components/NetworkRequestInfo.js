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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/alexbrazier/react-native-network-logger/blob/6c11bb2b7b887fa75aead0fde44523aced84d62b/src/NetworkRequestInfo.ts
var FileReader_1 = __importDefault(require("react-native/Libraries/Blob/FileReader"));
var utils_1 = require("../utils");
var NetworkRequestInfo = /** @class */ (function () {
    function NetworkRequestInfo(id, type, method, url) {
        this.id = '';
        this.type = '';
        this.url = '';
        this.status = -1;
        this.dataSent = '';
        this.responseContentType = '';
        this.responseSize = 0;
        this.requestHeaders = {};
        this.responseHeaders = {};
        this.response = '';
        this.responseURL = '';
        this.responseType = '';
        this.timeout = 0;
        this.closeReason = '';
        this.messages = '';
        this.serverClose = undefined;
        this.serverError = undefined;
        this.startTime = 0;
        this.endTime = 0;
        this.id = id;
        this.type = type;
        this.method = method;
        this.url = url;
    }
    Object.defineProperty(NetworkRequestInfo.prototype, "duration", {
        get: function () {
            return this.endTime - this.startTime;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NetworkRequestInfo.prototype, "curlRequest", {
        get: function () {
            var _this = this;
            var headersPart = this.requestHeaders &&
                Object.entries(this.requestHeaders)
                    .map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return "'".concat(key, ": ").concat(_this.escapeQuotes(value), "'");
                })
                    .join(' -H ');
            headersPart = headersPart ? "-H ".concat(headersPart) : '';
            var body = this.dataSent && this.escapeQuotes(this.dataSent);
            var methodPart = this.method !== 'GET' ? "-X".concat(this.method.toUpperCase()) : '';
            var bodyPart = body ? "-d '".concat(body, "'") : '';
            var parts = ['curl', methodPart, headersPart, bodyPart, "'".concat(this.url, "'")];
            return parts.filter(Boolean).join(' ');
        },
        enumerable: false,
        configurable: true
    });
    NetworkRequestInfo.prototype.update = function (values) {
        Object.assign(this, values);
        if (values.dataSent) {
            var data = this.parseData(values.dataSent);
            this.gqlOperation = data === null || data === void 0 ? void 0 : data.operationName;
        }
    };
    NetworkRequestInfo.prototype.escapeQuotes = function (value) {
        var _a;
        return (_a = value.replace) === null || _a === void 0 ? void 0 : _a.call(value, /'/g, "\\'");
    };
    NetworkRequestInfo.prototype.parseData = function (data) {
        var _a;
        try {
            if ((_a = data === null || data === void 0 ? void 0 : data._parts) === null || _a === void 0 ? void 0 : _a.length) {
                return (0, utils_1.fromEntries)(data === null || data === void 0 ? void 0 : data._parts);
            }
            return JSON.parse(data);
        }
        catch (e) {
            return { data: data };
        }
    };
    NetworkRequestInfo.prototype.stringifyFormat = function (data) {
        return JSON.stringify(this.parseData(data), null, 2);
    };
    NetworkRequestInfo.prototype.getRequestBody = function (replaceEscaped) {
        if (replaceEscaped === void 0) { replaceEscaped = false; }
        var body = this.stringifyFormat(this.dataSent);
        if (replaceEscaped) {
            return body.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        }
        return body;
    };
    NetworkRequestInfo.prototype.parseResponseBlob = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blobReader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blobReader = new FileReader_1.default();
                        blobReader.readAsText(this.response);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var handleError = function () { return reject(blobReader.error); };
                                blobReader.addEventListener('load', function () {
                                    resolve(blobReader.result);
                                });
                                blobReader.addEventListener('error', handleError);
                                blobReader.addEventListener('abort', handleError);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NetworkRequestInfo.prototype.getResponseBody = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (this.responseType !== 'blob'
                            ? this.response
                            : this.parseResponseBlob())];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.stringifyFormat(body)];
                }
            });
        });
    };
    return NetworkRequestInfo;
}());
exports.default = NetworkRequestInfo;
