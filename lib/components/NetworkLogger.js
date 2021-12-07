// https://github.com/alexbrazier/react-native-network-logger/blob/6c11bb2b7b887fa75aead0fde44523aced84d62b/src/Logger.ts
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import NetworkRequestInfo from './NetworkRequestInfo';
import { extractHost } from '../utils';
let nextXHRId = 0;
class Logger {
    constructor() {
        this.requests = [];
        this.xhrIdMap = {};
        this.maxRequests = 500;
        this.enabled = false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.callback = (requests) => { };
        this.setCallback = (callback) => {
            this.callback = callback;
        };
        this.getRequest = (xhrIndex) => {
            if (xhrIndex === undefined)
                return undefined;
            const requestIndex = this.requests.length - this.xhrIdMap[xhrIndex] - 1;
            return this.requests[requestIndex];
        };
        this.updateRequest = (index, update) => {
            const networkInfo = this.getRequest(index);
            if (!networkInfo)
                return;
            networkInfo.update(update);
        };
        this.openCallback = (method, url, xhr) => {
            xhr._index = nextXHRId++;
            const xhrIndex = this.requests.length;
            this.xhrIdMap[xhr._index] = xhrIndex;
            if (this.ignoredHosts) {
                const host = extractHost(url);
                if (host && this.ignoredHosts.has(host)) {
                    return;
                }
            }
            const newRequest = new NetworkRequestInfo(`${nextXHRId}`, 'XMLHttpRequest', method, url);
            if (this.requests.length >= this.maxRequests) {
                this.requests.pop();
            }
            this.requests.unshift(newRequest);
        };
        this.requestHeadersCallback = (header, value, xhr) => {
            const networkInfo = this.getRequest(xhr._index);
            if (!networkInfo)
                return;
            networkInfo.requestHeaders[header] = value;
        };
        this.headerReceivedCallback = (responseContentType, responseSize, responseHeaders, xhr) => {
            this.updateRequest(xhr._index, {
                responseContentType,
                responseSize,
                responseHeaders: xhr.responseHeaders,
            });
        };
        this.sendCallback = (data, xhr) => {
            this.updateRequest(xhr._index, {
                startTime: Date.now(),
                dataSent: data,
            });
            this.callback(this.requests);
        };
        this.responseCallback = (status, timeout, response, responseURL, responseType, xhr) => {
            this.updateRequest(xhr._index, {
                endTime: Date.now(),
                status,
                timeout,
                response,
                responseURL,
                responseType,
            });
            this.callback(this.requests);
        };
        this.enableXHRInterception = (options) => {
            if (this.enabled ||
                (XHRInterceptor.isInterceptorEnabled() && !(options === null || options === void 0 ? void 0 : options.forceEnable))) {
                if (!this.enabled) {
                    console.warn('network interceptor has not been enabled as another interceptor is already running (e.g. another debugging program). Use option `forceEnable: true` to override this behaviour.');
                }
                return;
            }
            if ((options === null || options === void 0 ? void 0 : options.maxRequests) !== undefined) {
                if (typeof options.maxRequests !== 'number' || options.maxRequests < 1) {
                    console.warn('maxRequests must be a number greater than 0. The logger has not been started.');
                    return;
                }
                this.maxRequests = options.maxRequests;
            }
            if (options === null || options === void 0 ? void 0 : options.ignoredHosts) {
                if (!Array.isArray(options.ignoredHosts) ||
                    typeof options.ignoredHosts[0] !== 'string') {
                    console.warn('ignoredHosts must be an array of strings. The logger has not been started.');
                    return;
                }
                this.ignoredHosts = new Set(options.ignoredHosts);
            }
            XHRInterceptor.setOpenCallback(this.openCallback);
            XHRInterceptor.setRequestHeaderCallback(this.requestHeadersCallback);
            XHRInterceptor.setHeaderReceivedCallback(this.headerReceivedCallback);
            XHRInterceptor.setSendCallback(this.sendCallback);
            XHRInterceptor.setResponseCallback(this.responseCallback);
            XHRInterceptor.enableInterception();
            this.enabled = true;
        };
        this.getRequests = () => {
            return this.requests;
        };
        this.clearRequests = () => {
            this.requests = [];
            this.callback(this.requests);
        };
    }
}
export default new Logger();
