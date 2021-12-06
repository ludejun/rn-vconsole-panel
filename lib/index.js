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
exports.handleRNNavigationStateChange = exports.RNStackRef = exports.statusBarHeight = void 0;
// @ts-nocheck
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var components_1 = require("./components");
Object.defineProperty(exports, "statusBarHeight", { enumerable: true, get: function () { return components_1.statusBarHeight; } });
exports.RNStackRef = (0, react_1.createRef)(); // 记录监控App路由变化，都存这个栈里
var handleRNNavigationStateChange = function (state) {
    var _a, _b;
    var changeTime = new Date().getTime();
    var stack;
    var index = state.index, _c = state.routes, routes = _c === void 0 ? [] : _c, type = state.type;
    var _d = routes[index] || {}, routeState = _d.state, name = _d.name, params = _d.params;
    stack = {
        type: type,
        name: name,
        params: params,
        changeTime: changeTime,
    };
    if (routeState && routeState instanceof Object) {
        var index_1 = routeState.index, _e = routeState.routes, routes_1 = _e === void 0 ? [] : _e, type_1 = routeState.type;
        stack.name = (_a = routes_1[index_1]) === null || _a === void 0 ? void 0 : _a.name;
        stack.type = type_1;
        stack.params = (_b = routes_1[index_1]) === null || _b === void 0 ? void 0 : _b.params;
    }
    if (Array.isArray(exports.RNStackRef.current)) {
        exports.RNStackRef.current.push(stack);
    }
    else {
        exports.RNStackRef.current = [stack];
    }
};
exports.handleRNNavigationStateChange = handleRNNavigationStateChange;
var RNConsole = function (props) {
    var entryVisible = props.entryVisible, _a = props.entryText, entryText = _a === void 0 ? '' : _a, entryStyle = props.entryStyle, _b = props.consoleType, consoleType = _b === void 0 ? ['log', 'info', 'warn', 'error'] : _b, _c = props.maxLogLength, maxLogLength = _c === void 0 ? 200 : _c, storage = props.storage, definedData = props.definedData, ignoredHosts = props.ignoredHosts;
    var _d = (0, react_1.useState)(entryVisible !== null && entryVisible !== void 0 ? entryVisible : false), visible = _d[0], setVisible = _d[1]; // 控制面板是否展示
    var _e = (0, react_1.useState)('Console'), boardType = _e[0], setBoardType = _e[1]; // 当前面板
    var init = function () {
        global['$BOARD_LOGGER'] = {
            Console: [],
        };
    };
    var addLog = function (boardType, log) {
        if (global.$BOARD_LOGGER[boardType].length > maxLogLength)
            global.$BOARD_LOGGER[boardType].shift();
        global.$BOARD_LOGGER[boardType].push(log);
    };
    (0, react_1.useEffect)(function () {
        init();
        var $console = __assign({}, global.console);
        consoleType.forEach(function (type) {
            global.console[type] = function () {
                var _a;
                var messages = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    messages[_i] = arguments[_i];
                }
                (_a = $console[type]) === null || _a === void 0 ? void 0 : _a.apply(null, messages);
                addLog('Console', { type: type, messages: messages });
            };
        });
        // 使用react-native-network-logger中的代理
        components_1.logger.enableXHRInterception({
            ignoredHosts: ignoredHosts || ['localhost:8081'],
            maxRequests: maxLogLength,
        });
    }, []);
    var onClickEntryButton = function () {
        setVisible(true);
    };
    var onClickBoardType = function (type) {
        setBoardType(type);
    };
    return (<>
      <react_native_1.View style={[defaultStyle.entry, entryStyle]}>
        <react_native_1.TouchableOpacity onPress={function () { return onClickEntryButton(); }}>
          <react_native_1.Text style={{ color: '#fff' }}>{entryText || 'RNConsole'}</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
      <react_native_1.Modal visible={visible}>
        <react_native_1.View style={[defaultStyle.modal, { height: react_native_1.Dimensions.get('window').height - 30 }]}>
          <react_native_1.View style={defaultStyle.type}>
            {(['Console', 'Network', 'Stack', 'Storage', 'System']).map(function (type) { return (<react_native_1.TouchableOpacity key={type} onPress={function () { return onClickBoardType(type); }} style={[defaultStyle.button, boardType === type ? defaultStyle.activeButton : null]}>
                  <react_native_1.Text style={defaultStyle.label}>{type}</react_native_1.Text>
                </react_native_1.TouchableOpacity>); })}
          </react_native_1.View>
          <react_native_1.View style={defaultStyle.list}>
            {boardType === 'Console' ? <components_1.ConsoleBoard types={consoleType}/>
            : boardType === 'Network' ? <components_1.Network />
                : boardType === 'System' ? <components_1.DeviceBoard definedData={definedData}/>
                    : boardType === 'Storage' ? <components_1.StorageBoard storage={storage}/>
                        : boardType === 'Stack' ? <components_1.StackBoard /> : null}

          </react_native_1.View>
          <react_native_1.View style={defaultStyle.close}>
            <react_native_1.TouchableOpacity onPress={function () { return setVisible(false); }}>
              <react_native_1.Text style={defaultStyle.label}>Close</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>
    </>);
};
var defaultStyle = react_native_1.StyleSheet.create({
    entry: {
        position: 'absolute',
        left: 16,
        bottom: 88,
        zIndex: 1,
        borderRadius: 5,
        backgroundColor: '#91d300',
        padding: 3,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
    },
    modal: {
        padding: 10,
        paddingTop: 64,
        display: 'flex',
    },
    button: {
        backgroundColor: '#ddd',
        padding: 3,
        height: 25,
        width: 65,
        borderRadius: 5,
        // marginRight: 8,
    },
    activeButton: {
        backgroundColor: '#eee',
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
    },
    type: {
        flexDirection: 'row',
        height: 30,
        justifyContent: 'space-between',
    },
    list: {
        flex: 1,
        paddingTop: 10,
    },
    close: {
        position: 'absolute',
        top: 40,
        right: 10,
        backgroundColor: '#ffc007',
        padding: 3,
        height: 20,
        width: 65,
        borderRadius: 5,
    },
});
exports.default = RNConsole;
