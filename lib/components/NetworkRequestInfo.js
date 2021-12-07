// https://github.com/alexbrazier/react-native-network-logger/blob/6c11bb2b7b887fa75aead0fde44523aced84d62b/src/NetworkRequestInfo.ts
import BlobFileReader from 'react-native/Libraries/Blob/FileReader';
import { fromEntries } from '../utils';
export default class NetworkRequestInfo {
    constructor(id, type, method, url) {
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
    get duration() {
        return this.endTime - this.startTime;
    }
    get curlRequest() {
        let headersPart = this.requestHeaders &&
            Object.entries(this.requestHeaders)
                .map(([key, value]) => `'${key}: ${this.escapeQuotes(value)}'`)
                .join(' -H ');
        headersPart = headersPart ? `-H ${headersPart}` : '';
        const body = this.dataSent && this.escapeQuotes(this.dataSent);
        const methodPart = this.method !== 'GET' ? `-X${this.method.toUpperCase()}` : '';
        const bodyPart = body ? `-d '${body}'` : '';
        const parts = ['curl', methodPart, headersPart, bodyPart, `'${this.url}'`];
        return parts.filter(Boolean).join(' ');
    }
    update(values) {
        Object.assign(this, values);
        if (values.dataSent) {
            const data = this.parseData(values.dataSent);
            this.gqlOperation = data === null || data === void 0 ? void 0 : data.operationName;
        }
    }
    escapeQuotes(value) {
        var _a;
        return (_a = value.replace) === null || _a === void 0 ? void 0 : _a.call(value, /'/g, `\\'`);
    }
    parseData(data) {
        var _a;
        try {
            if ((_a = data === null || data === void 0 ? void 0 : data._parts) === null || _a === void 0 ? void 0 : _a.length) {
                return fromEntries(data === null || data === void 0 ? void 0 : data._parts);
            }
            return JSON.parse(data);
        }
        catch (e) {
            return { data };
        }
    }
    stringifyFormat(data) {
        return JSON.stringify(this.parseData(data), null, 2);
    }
    getRequestBody(replaceEscaped = false) {
        const body = this.stringifyFormat(this.dataSent);
        if (replaceEscaped) {
            return body.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        }
        return body;
    }
    async parseResponseBlob() {
        const blobReader = new BlobFileReader();
        blobReader.readAsText(this.response);
        return await new Promise((resolve, reject) => {
            const handleError = () => reject(blobReader.error);
            blobReader.addEventListener('load', () => {
                resolve(blobReader.result);
            });
            blobReader.addEventListener('error', handleError);
            blobReader.addEventListener('abort', handleError);
        });
    }
    async getResponseBody() {
        const body = await (this.responseType !== 'blob'
            ? this.response
            : this.parseResponseBlob());
        return this.stringifyFormat(body);
    }
}
