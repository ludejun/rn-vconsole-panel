"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var NetworkLogger_1 = __importDefault(require("./NetworkLogger"));
var LogContent_1 = require("./LogContent");
var utils_1 = require("../utils");
var Network = function () {
    var _a = (0, react_1.useState)([]), data = _a[0], setData = _a[1];
    var sc = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        setData(NetworkLogger_1.default.getRequests());
    }, []);
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = sc.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd();
    }, [data]);
    var onClickClear = function () {
        NetworkLogger_1.default.clearRequests();
        setData([]);
    };
    return (<react_native_1.View style={defaultStyle.container}>
      <react_native_1.ScrollView ref={sc}>
        {data.sort(function (a, b) { return Number(a.id) - Number(b.id); }).map(function (request, index) { return (<RequestOverview data={request} key={"".concat(request.id).concat(index)}/>); })}
      </react_native_1.ScrollView>
      <react_native_1.View style={defaultStyle.clear}>
        <react_native_1.TouchableOpacity onPress={function () { return onClickClear(); }}>
          <react_native_1.Text style={defaultStyle.label}>Clear</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.Network = Network;
var RequestOverview = function (props) {
    var data = props.data;
    var method = data.method, status = data.status, url = data.url, duration = data.duration, requestHeaders = data.requestHeaders, responseHeaders = data.responseHeaders, dataSent = data.dataSent;
    var _a = (0, react_1.useState)('none'), show = _a[0], setShow = _a[1];
    var _b = (0, react_1.useState)(dataSent), requestBody = _b[0], setBody = _b[1];
    var _c = (0, react_1.useState)({}), responseBody = _c[0], setResp = _c[1];
    var colorMap = {
        statusGood: '#28a844',
        statusWarning: '#ffc007',
        statusBad: '#dd3444',
    };
    var chooseColor = function (status) {
        if (status < 400)
            return colorMap.statusGood;
        if (status < 500)
            return colorMap.statusWarning;
        if (status >= 500)
            return colorMap.statusBad;
    };
    var onClickRequest = function () {
        setShow(show === 'none' ? 'flex' : 'none');
        setBody((0, utils_1.jsonParse)(requestBody));
        data.getResponseBody().then(function (resp) { return setResp((0, utils_1.jsonParse)(resp)); });
    };
    return (<>
      <react_native_1.TouchableOpacity onPress={function () { return onClickRequest(); }}>
        <react_native_1.View style={defaultStyle.item}>
          <react_native_1.View style={defaultStyle.left}>
            <react_native_1.Text style={[defaultStyle.method, { color: chooseColor(status) }]}>{method}</react_native_1.Text>
            <react_native_1.Text style={defaultStyle.text}>{status}</react_native_1.Text>
            <react_native_1.Text style={defaultStyle.text}>{duration > 0 ? "".concat(duration, "ms") : 'pending'}</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={defaultStyle.right}><react_native_1.Text style={{ color: status < 400 ? undefined : chooseColor(status) }}>{url}</react_native_1.Text></react_native_1.View>
        </react_native_1.View>
      </react_native_1.TouchableOpacity>
      <react_native_1.View style={[defaultStyle.request, { display: show }]}>
        <react_native_1.Text style={defaultStyle.header}>Response Headers:</react_native_1.Text>
        <LogContent_1.LogContent messages={responseHeaders}/>
        <react_native_1.Text style={defaultStyle.header}>Request Headers:</react_native_1.Text>
        <LogContent_1.LogContent messages={requestHeaders}/>
        <react_native_1.Text style={defaultStyle.header}>Request Body:</react_native_1.Text>
        <LogContent_1.LogContent messages={requestBody}/>
        <react_native_1.Text style={defaultStyle.header}>Response Body:</react_native_1.Text>
        <LogContent_1.LogContent messages={responseBody}/>
      </react_native_1.View>
      <react_native_1.View style={defaultStyle.lineBank}/>
    </>);
};
var defaultStyle = react_native_1.StyleSheet.create({
    container: {
        height: '100%',
    },
    lineBank: {
        height: 1,
        backgroundColor: '#eee',
    },
    item: {
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        width: '100%',
    },
    left: {
        flexDirection: 'column',
        width: 50,
    },
    method: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    text: {
        fontSize: 10,
        textAlign: 'center',
    },
    right: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 14,
    },
    header: {
        fontSize: 14,
        fontWeight: '500',
    },
    request: {
        marginTop: 4,
        paddingTop: 4,
        backgroundColor: '#eee',
        paddingBottom: 4,
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
    },
    clear: {
        position: 'absolute',
        top: -12,
        right: 0,
        backgroundColor: '#ffc007',
        padding: 3,
        height: 20,
        width: 65,
        borderRadius: 5,
    },
});
