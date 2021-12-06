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
exports.ConsoleBoard = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var LogContent_1 = require("./LogContent");
var ConsoleBoard = function (props) {
    var types = props.types;
    // @ts-ignore
    var data = global.$BOARD_LOGGER.Console;
    var _a = (0, react_1.useState)(data), listData = _a[0], setData = _a[1];
    var sc = (0, react_1.useRef)(null);
    var colorMap = {
        log: '#AAA',
        info: '#0074D9',
        warn: '#FF851B',
        error: '#FF4136',
    };
    var onClickType = function (type) {
        if (type === 'all')
            setData(data);
        else
            setData(data.filter(function (_a) {
                var msgTypee = _a.type;
                return msgTypee === type;
            }));
    };
    var onClickClear = function () {
        // @ts-ignore
        global.$BOARD_LOGGER.Console = [];
        setData([]);
    };
    (0, react_1.useEffect)(function () {
        var _a;
        setData(data);
        (_a = sc.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd();
    }, []);
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = sc.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd();
    }, [listData]);
    return (<react_native_1.View style={defaultStyle.container}>
      <react_native_1.View style={defaultStyle.logContent}>
        <react_native_1.ScrollView ref={sc}>
          {listData.map(function (_a, i) {
            var type = _a.type, messages = _a.messages;
            return <react_native_1.View style={defaultStyle.item} key={"".concat(type).concat(i)}>
            <react_native_1.Text style={[defaultStyle.dot, { color: colorMap[type] }]}>•</react_native_1.Text>
            <react_native_1.View style={defaultStyle.messages}>
              <LogContent_1.LogContent key={i} messages={messages}/>
            </react_native_1.View>
          </react_native_1.View>;
        })}
        </react_native_1.ScrollView>
      </react_native_1.View>

      <react_native_1.View style={defaultStyle.buttonContainer}>
        <react_native_1.TouchableOpacity onPress={function () { return onClickType('all'); }} style={[defaultStyle.button]}>
          <react_native_1.Text style={defaultStyle.label}>All</react_native_1.Text>
        </react_native_1.TouchableOpacity>
        {types.map(function (type) { return <react_native_1.TouchableOpacity key={type} onPress={function () { return onClickType(type); }} style={[defaultStyle.button, { backgroundColor: colorMap[type] }]}>
          <react_native_1.Text style={defaultStyle.label}>{type}</react_native_1.Text>
        </react_native_1.TouchableOpacity>; })}
      </react_native_1.View>
      <react_native_1.View style={defaultStyle.clear}>
        <react_native_1.TouchableOpacity onPress={function () { return onClickClear(); }}>
          <react_native_1.Text style={defaultStyle.label}>Clear</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.ConsoleBoard = ConsoleBoard;
var defaultStyle = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
    },
    logContent: {
        flex: 1,
        paddingBottom: 10,
    },
    item: {
        flexDirection: 'row',
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingTop: 4,
        paddingBottom: 4,
    },
    dot: {
        borderRadius: 5,
        marginRight: 5,
        color: '#eee',
    },
    messages: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#ddd',
        padding: 3,
        height: 20,
        width: 45,
        borderRadius: 5,
        marginRight: 8,
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
    }
});
