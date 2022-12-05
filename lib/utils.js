export const jsonParse = (data) => {
    let body = null;
    try {
        body = JSON.parse(data);
    }
    catch (e) {
        body = data;
    }
    return body;
};
export const extractHost = (url) => {
    var _a;
    // const host = url.split('//')[1]?.split(':')[0]?.split('/')[0] || undefined;
    const host = ((_a = url.split('//')[1]) === null || _a === void 0 ? void 0 : _a.split('/')[0]) || undefined;
    return host;
};
export const fromEntries = (arr) => arr.reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
}, {});
export const splitString = (str, length = 200) => {
    return str.length > length ? `${str.substring(0, length)}...` : str;
};
