"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/alexbrazier/react-native-network-logger/blob/6c11bb2b7b887fa75aead0fde44523aced84d62b/src/Logger.ts
var XHRInterceptor_1 = __importDefault(require("react-native/Libraries/Network/XHRInterceptor"));
var NetworkRequestInfo_1 = __importDefault(require("./NetworkRequestInfo"));
var utils_1 = require("../utils");
var nextXHRId = 0;
var Logger = /** @class */ (function () {
    function Logger() {
        var _this = this;
        this.requests = [];
        this.xhrIdMap = {};
        this.maxRequests = 500;
        this.enabled = false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.callback = function (requests) { };
        this.setCallback = function (callback) {
            _this.callback = callback;
        };
        this.getRequest = function (xhrIndex) {
            if (xhrIndex === undefined)
                return undefined;
            var requestIndex = _this.requests.length - _this.xhrIdMap[xhrIndex] - 1;
            return _this.requests[requestIndex];
        };
        this.updateRequest = function (index, update) {
            var networkInfo = _this.getRequest(index);
            if (!networkInfo)
                return;
            networkInfo.update(update);
        };
        this.openCallback = function (method, url, xhr) {
            xhr._index = nextXHRId++;
            var xhrIndex = _this.requests.length;
            _this.xhrIdMap[xhr._index] = xhrIndex;
            if (_this.ignoredHosts) {
                var host = (0, utils_1.extractHost)(url);
                if (host && _this.ignoredHosts.has(host)) {
                    return;
                }
            }
            var newRequest = new NetworkRequestInfo_1.default("".concat(nextXHRId), 'XMLHttpRequest', method, url);
            if (_this.requests.length >= _this.maxRequests) {
                _this.requests.pop();
            }
            _this.requests.unshift(newRequest);
        };
        this.requestHeadersCallback = function (header, value, xhr) {
            var networkInfo = _this.getRequest(xhr._index);
            if (!networkInfo)
                return;
            networkInfo.requestHeaders[header] = value;
        };
        this.headerReceivedCallback = function (responseContentType, responseSize, responseHeaders, xhr) {
            _this.updateRequest(xhr._index, {
                responseContentType: responseContentType,
                responseSize: responseSize,
                responseHeaders: xhr.responseHeaders,
            });
        };
        this.sendCallback = function (data, xhr) {
            _this.updateRequest(xhr._index, {
                startTime: Date.now(),
                dataSent: data,
            });
            _this.callback(_this.requests);
        };
        this.responseCallback = function (status, timeout, response, responseURL, responseType, xhr) {
            _this.updateRequest(xhr._index, {
                endTime: Date.now(),
                status: status,
                timeout: timeout,
                response: response,
                responseURL: responseURL,
                responseType: responseType,
            });
            _this.callback(_this.requests);
        };
        this.enableXHRInterception = function (options) {
            if (_this.enabled ||
                (XHRInterceptor_1.default.isInterceptorEnabled() && !(options === null || options === void 0 ? void 0 : options.forceEnable))) {
                if (!_this.enabled) {
                    console.warn('network interceptor has not been enabled as another interceptor is already running (e.g. another debugging program). Use option `forceEnable: true` to override this behaviour.');
                }
                return;
            }
            if ((options === null || options === void 0 ? void 0 : options.maxRequests) !== undefined) {
                if (typeof options.maxRequests !== 'number' || options.maxRequests < 1) {
                    console.warn('maxRequests must be a number greater than 0. The logger has not been started.');
                    return;
                }
                _this.maxRequests = options.maxRequests;
            }
            if (options === null || options === void 0 ? void 0 : options.ignoredHosts) {
                if (!Array.isArray(options.ignoredHosts) ||
                    typeof options.ignoredHosts[0] !== 'string') {
                    console.warn('ignoredHosts must be an array of strings. The logger has not been started.');
                    return;
                }
                _this.ignoredHosts = new Set(options.ignoredHosts);
            }
            XHRInterceptor_1.default.setOpenCallback(_this.openCallback);
            XHRInterceptor_1.default.setRequestHeaderCallback(_this.requestHeadersCallback);
            XHRInterceptor_1.default.setHeaderReceivedCallback(_this.headerReceivedCallback);
            XHRInterceptor_1.default.setSendCallback(_this.sendCallback);
            XHRInterceptor_1.default.setResponseCallback(_this.responseCallback);
            XHRInterceptor_1.default.enableInterception();
            _this.enabled = true;
        };
        this.getRequests = function () {
            return _this.requests;
        };
        this.clearRequests = function () {
            _this.requests = [];
            _this.callback(_this.requests);
        };
    }
    return Logger;
}());
exports.default = new Logger();
