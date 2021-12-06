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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageBoard = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var LogContent_1 = require("./LogContent");
var utils_1 = require("../utils");
var StorageBoard = function (props) {
    var _a = props.storage || {}, getAllKeys = _a.getAllKeys, getItem = _a.getItem, setItem = _a.setItem, removeItem = _a.removeItem, clear = _a.clear;
    var sc = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)({}), data = _b[0], setData = _b[1];
    var _c = (0, react_1.useState)(null), itemData = _c[0], setItemData = _c[1]; // 点击某一项可以编辑或者删除
    var _d = (0, react_1.useState)(false), edit = _d[0], setEdit = _d[1]; // 标明input的编辑状态
    var _e = (0, react_1.useState)(''), text = _e[0], setText = _e[1];
    var getStorage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var obj_1, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(getAllKeys && getItem)) return [3 /*break*/, 3];
                    obj_1 = {};
                    return [4 /*yield*/, getAllKeys()];
                case 1:
                    keys = _a.sent();
                    return [4 /*yield*/, Promise.all(keys.map(function (key) { return getItem(key).then(function (value) { return obj_1[key] = (0, utils_1.jsonParse)(value); }); }))];
                case 2:
                    _a.sent();
                    setData(obj_1);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        getStorage();
    }, []);
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = sc.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd();
    }, [data]);
    var onClickClear = function () {
        clear && clear();
        setData([]);
    };
    var onClickItem = function (key) {
        if (setItem || removeItem) {
            setItemData({ key: key, value: data[key] });
        }
        setText(JSON.stringify(data[key]));
    };
    var onClickEdit = function () {
        console.info(3333, edit, itemData, text);
        if (edit) {
            itemData && setItem && setItem(itemData.key, text);
            setEdit(false);
            getStorage();
        }
        else {
            setEdit(true);
        }
    };
    var onClearItem = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(itemData && itemData.key && removeItem)) return [3 /*break*/, 2];
                    return [4 /*yield*/, removeItem(itemData.key)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    setItemData(null);
                    getStorage();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<react_native_1.View style={defaultStyle.container}>
      <react_native_1.ScrollView ref={sc}>
        {Object.keys(data).length > 0 ? Object.keys(data).map(function (key) { return (<react_native_1.TouchableOpacity key={key} onPress={function () { return onClickItem(key); }}>
              <react_native_1.View key={key} style={defaultStyle.item}>
                <react_native_1.View style={defaultStyle.left}><react_native_1.Text>{key}</react_native_1.Text></react_native_1.View>
                <react_native_1.View style={defaultStyle.right}>
                  <LogContent_1.LogContent messages={data[key]}/>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.TouchableOpacity>); }) : <react_native_1.Text style={defaultStyle.disable}>StorageBoard has not been enabled as the functions "getAllKeys", "getItem" are missing.</react_native_1.Text>}
      </react_native_1.ScrollView>

      <react_native_1.View style={[defaultStyle.bottom, { display: itemData ? 'flex' : 'none' }]}>
        <react_native_1.View style={defaultStyle.edit}>
          <react_native_1.Text style={defaultStyle.left}>{itemData === null || itemData === void 0 ? void 0 : itemData.key}</react_native_1.Text>
          <react_native_1.TextInput value={text} multiline editable={edit} style={defaultStyle.input} onChangeText={function (text) { return setText(text); }}/>
        </react_native_1.View>
        <react_native_1.View style={defaultStyle.row}>
          <react_native_1.TouchableOpacity onPress={function () { return onClickEdit(); }} style={defaultStyle.button}><react_native_1.Text style={defaultStyle.label}>{edit ? 'Save' : 'Edit'} Item</react_native_1.Text></react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity onPress={function () { return onClearItem(); }} style={defaultStyle.button}><react_native_1.Text style={defaultStyle.label}>Clear Item</react_native_1.Text></react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>

      {clear ? <react_native_1.View style={defaultStyle.clear}>
        <react_native_1.TouchableOpacity onPress={function () { return onClickClear(); }}>
          <react_native_1.Text style={defaultStyle.label}>Clear All</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View> : null}
    </react_native_1.View>);
};
exports.StorageBoard = StorageBoard;
var defaultStyle = react_native_1.StyleSheet.create({
    container: {
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
    disable: {
        paddingTop: 20,
        color: '#999',
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
    edit: {
        flexDirection: 'row',
        height: 80,
    },
    input: {
        borderWidth: 1,
        flex: 1,
        padding: 3,
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 8,
    },
    button: {
        backgroundColor: '#ffc007',
        padding: 3,
        height: 20,
        width: 80,
        borderRadius: 5,
        marginRight: 8,
    },
    bottom: {
        paddingTop: 4,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 112,
        backgroundColor: '#eee',
    },
});
