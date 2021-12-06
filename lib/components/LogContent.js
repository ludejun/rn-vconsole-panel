"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.LogContentArray = exports.LogContentObject = exports.LogContentString = exports.defaultStyle = exports.LogContent = void 0;
// @ts-nocheck
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var LogContent = /** @class */ (function (_super) {
    __extends(LogContent, _super);
    function LogContent(props) {
        var _this = _super.call(this, props) || this;
        _this.renderMessage = function (message, name, id) { return (<react_native_1.View key={Math.random()} style={{ flex: 1 }}>
      {_this.renderMessageContent(message, name, id)}
      {_this.renderMessageChildren(message, id)}
    </react_native_1.View>); };
        _this.renderMessageContent = function (message, name, id) {
            if (message instanceof Array)
                return <exports.LogContentArray key={"".concat(name).concat(id)} name={name} message={message} toggle={function () { return _this.toggle(id); }} isShow={_this.state[id]}/>;
            if (typeof message === 'object' && message !== null)
                return <exports.LogContentObject key={"".concat(name).concat(id)} name={name} message={message} toggle={function () { return _this.toggle(id); }} isShow={_this.state[id]}/>;
            return <exports.LogContentString name={name} value={message}/>;
        };
        _this.renderMessageChildren = function (message, id) {
            if (message instanceof Array && _this.state[id])
                return (<react_native_1.View style={exports.defaultStyle.object} key={id}>
        {message.map(function (child, i) { return _this.renderMessage(child, i, "".concat(id).concat(i)); })}
      </react_native_1.View>);
            if (typeof message === 'object' && message && _this.state[id])
                return (<react_native_1.View style={exports.defaultStyle.object} key={id}>
        {Object.keys(message).map(function (child) { return _this.renderMessage(message[child], child, id + child); })}
      </react_native_1.View>);
        };
        _this.toggle = function (id) {
            var _a;
            // eslint-disable-next-line react/no-access-state-in-setstate
            _this.setState((_a = {}, _a[id] = !_this.state[id], _a));
        };
        _this.state = {};
        return _this;
    }
    LogContent.prototype.render = function () {
        var _this = this;
        return Array.isArray(this.props.messages) ? this.props.messages.map(function (message) { return _this.renderMessage(message, undefined, undefined); }) : this.renderMessage(this.props.messages, undefined, undefined);
    };
    return LogContent;
}(react_1.default.Component));
exports.LogContent = LogContent;
exports.defaultStyle = react_native_1.StyleSheet.create({
    object: {
        paddingLeft: 20,
    },
    row: {
        flexDirection: 'row',
    },
    valueUndefined: {
        color: '#bbb',
    },
    valueBool: {
        color: '#0074D9',
    },
    valueNumber: {
        color: '#0074D9',
    },
    valueString: {
        flex: 1,
        color: '#0a3069',
    },
});
var LogContentString = function (props) {
    var name = props.name, value = props.value;
    var generateContent = function () {
        if (value === undefined)
            return <react_native_1.Text style={exports.defaultStyle.valueUndefined}>undefined</react_native_1.Text>;
        if (value === null)
            return <react_native_1.Text style={exports.defaultStyle.valueUndefined}>null</react_native_1.Text>;
        if (value === true || value === false)
            return <react_native_1.Text style={exports.defaultStyle.valueBool}>{value.toString()}</react_native_1.Text>;
        if (Number.isInteger(value))
            return <react_native_1.Text style={exports.defaultStyle.valueNumber}>{value}</react_native_1.Text>;
        return <react_native_1.Text style={exports.defaultStyle.valueString}>{"\"".concat(value.toString(), "\"")}</react_native_1.Text>;
    };
    return (<react_native_1.View style={exports.defaultStyle.row}>
    {name !== undefined
            && <react_native_1.Text>{name}: </react_native_1.Text>}
    {generateContent()}
  </react_native_1.View>);
};
exports.LogContentString = LogContentString;
var LogContentObject = function (props) {
    var name = props.name, message = props.message, toggle = props.toggle, isShow = props.isShow;
    var _a = (0, react_1.useState)(''), showMsg = _a[0], setShowMsg = _a[1];
    var icon = isShow ? '▼' : '▶';
    (0, react_1.useEffect)(function () {
        var msg = '{';
        Object.keys(message).forEach(function (key) {
            if (message[key] instanceof Array)
                msg += "".concat(key, ": Array(").concat(message[key].length, "), ");
            else if (typeof message[key] === 'object' && message[key] !== null)
                msg += "".concat(key, ": {...}, ");
            else if (typeof message[key] === 'string')
                msg += "".concat(key, ": \"").concat(message[key], "\", ");
            else
                msg += "".concat(key, ": ").concat(String(message[key]), ", ");
        });
        setShowMsg("".concat(msg.length > 1 ? msg.slice(0, -2) : msg, "}"));
    }, []);
    return (<react_native_1.TouchableOpacity onPress={toggle}>
      <react_native_1.Text numberOfLines={1}>
        {icon} {name}{name ? ': ' : ''} {!isShow ? showMsg : ''}
      </react_native_1.Text>
    </react_native_1.TouchableOpacity>);
};
exports.LogContentObject = LogContentObject;
var LogContentArray = function (props) {
    var _a = props.name, name = _a === void 0 ? '' : _a, _b = props.message, message = _b === void 0 ? [] : _b, toggle = props.toggle, isShow = props.isShow;
    var _c = (0, react_1.useState)(''), showMsg = _c[0], setShowMsg = _c[1];
    var icon = isShow ? '▼' : '▶';
    (0, react_1.useEffect)(function () {
        var msg = '[';
        message.forEach(function (item) {
            if (item instanceof Array)
                msg += "Array(".concat(item.length, "), ");
            else if (typeof item === 'object' && item !== null)
                msg += '{...}, ';
            else if (typeof item === 'string')
                msg += "\"".concat(item, "\", ");
            else
                msg += "".concat(String(item), ", ");
        });
        setShowMsg("".concat(msg.length > 1 ? msg.slice(0, -2) : msg, "]"));
    }, []);
    return (<react_native_1.TouchableOpacity onPress={toggle}>
      <react_native_1.Text numberOfLines={1}>
        {icon} {"".concat(name).concat(name ? ': ' : '', "(").concat(message.length, ")").concat(showMsg)}
      </react_native_1.Text>
    </react_native_1.TouchableOpacity>);
};
exports.LogContentArray = LogContentArray;
