"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.StackBoard = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var LogContent_1 = require("./LogContent");
var __1 = require("..");
var StackBoard = function () {
    var sc = (0, react_1.useRef)(null);
    var _a = (0, react_1.useState)([]), data = _a[0], setData = _a[1];
    var colorMap = {
        stack: '#28a844',
        tab: '#ffc007',
        drawer: '#333',
    };
    (0, react_1.useEffect)(function () {
        var stackList = __1.RNStackRef.current;
        setData(stackList === null || stackList === void 0 ? void 0 : stackList.map(function (stack, index) { return (__assign(__assign({}, stack), { duration: stackList[index + 1] ? (stackList[index + 1].changeTime - stack.changeTime) : (new Date().getTime() - stack.changeTime) })); }));
    }, []);
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = sc.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd();
    }, [data]);
    var onClickClear = function () {
        // @ts-ignore
        __1.RNStackRef.current = [];
        setData([]);
    };
    return (<react_native_1.View style={defaultStyle.container}>
      <react_native_1.ScrollView ref={sc}>
        {data && data.length > 0 ? data.map(function (stack, index) { return (<react_native_1.View key={"".concat(stack.name).concat(index)} style={defaultStyle.item}>
              <react_native_1.Text style={defaultStyle.text}>{index}: <react_native_1.Text style={[defaultStyle.name, { color: colorMap[stack.type] }]}>{stack.name}</react_native_1.Text></react_native_1.Text>
              <react_native_1.Text style={defaultStyle.text}>    type: {stack.type}        {stack.duration ? <react_native_1.Text style={defaultStyle.text}>Time on Page: {stack.duration / 1000}s</react_native_1.Text> : null}</react_native_1.Text>
              <react_native_1.View style={defaultStyle.row}><react_native_1.Text>   params: </react_native_1.Text><LogContent_1.LogContent messages={stack.params}/></react_native_1.View>
            </react_native_1.View>); }) : <react_native_1.Text style={defaultStyle.disable}>StackBoard has not been enabled as the function "handleRNNavigationStateChange" is missing.</react_native_1.Text>}
      </react_native_1.ScrollView>
      <react_native_1.View style={defaultStyle.clear}>
        <react_native_1.TouchableOpacity onPress={function () { return onClickClear(); }}>
          <react_native_1.Text style={defaultStyle.label}>Clear</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.StackBoard = StackBoard;
var defaultStyle = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: '100%',
    },
    item: {
        flexDirection: 'column',
        paddingTop: 4,
        paddingBottom: 4,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    left: {
        width: 140,
    },
    right: {
        flex: 1,
    },
    disable: {
        paddingTop: 20,
        color: '#999',
    },
    text: {
        fontSize: 10,
    },
    name: {
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
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
