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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceBoard = exports.statusBarHeight = void 0;
// @ts-nocheck
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var LogContent_1 = require("./LogContent");
// 计算状态栏高度，iOS在无刘海屏为20、其余为44，这块可能需要改
exports.statusBarHeight = react_native_1.Platform.OS !== 'ios' ? react_native_1.StatusBar.currentHeight : ([667, 736].indexOf(react_native_1.Dimensions.get('window').height) > -1 ? 20 : 44);
var DeviceBoard = function (props) {
    var _a, _b, _c, _d;
    var definedData = props.definedData;
    var _e = ((_a = react_native_1.Platform.constants) === null || _a === void 0 ? void 0 : _a.reactNativeVersion) || {}, major = _e.major, minor = _e.minor, patch = _e.patch;
    var data = {
        os: react_native_1.Platform.OS,
        osVersion: react_native_1.Platform.Version,
        model: react_native_1.Platform.OS === 'ios' ? 'iPhone' : "".concat((_b = react_native_1.Platform.constants) === null || _b === void 0 ? void 0 : _b.Manufacturer, "/").concat((_c = react_native_1.Platform.constants) === null || _c === void 0 ? void 0 : _c.Brand, "/").concat((_d = react_native_1.Platform.constants) === null || _d === void 0 ? void 0 : _d.Model),
        RNVersion: "".concat(major, ".").concat(minor, ".").concat(patch),
        colorScheme: react_native_1.Appearance.getColorScheme(),
        windowWidth: react_native_1.Dimensions.get('window').width,
        windowHeight: react_native_1.Dimensions.get('window').height,
        pixelRatio: react_native_1.PixelRatio.get(),
        statusBarHeight: exports.statusBarHeight,
    };
    var sc = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = sc.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd();
    }, []);
    return (<react_native_1.View style={defaultStyle.container}>
      <react_native_1.ScrollView ref={sc}>
      {Object.keys(data).map(function (key) { return (<react_native_1.View key={key} style={defaultStyle.item}>
            <react_native_1.View style={defaultStyle.left}><react_native_1.Text>{key}</react_native_1.Text></react_native_1.View>
            <react_native_1.View style={defaultStyle.right}><LogContent_1.LogContent messages={data[key]}/></react_native_1.View>
          </react_native_1.View>); })}
      <react_native_1.View style={defaultStyle.lineHeight}/>
      {definedData ? Object.keys(definedData).map(function (key) { return (<react_native_1.View key={key} style={defaultStyle.item}>
              <react_native_1.View style={defaultStyle.left}><react_native_1.Text>{key}</react_native_1.Text></react_native_1.View>
              <react_native_1.View style={defaultStyle.right}><LogContent_1.LogContent messages={definedData[key]}/></react_native_1.View>
            </react_native_1.View>); }) : null}
      </react_native_1.ScrollView>
    </react_native_1.View>);
};
exports.DeviceBoard = DeviceBoard;
var defaultStyle = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: '100%',
    },
    item: {
        flexDirection: 'row',
        paddingTop: 4,
        paddingBottom: 4,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
    },
    left: {
        width: 120,
    },
    right: {
        flex: 1,
    },
    lineHeight: {
        height: 10,
        backgroundColor: '#eee',
    }
});
