// @ts-nocheck
import React, { createRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Dimensions } from 'react-native';
import { ConsoleBoard, Network, logger, DeviceBoard, statusBarHeight, StorageBoard, StackBoard, } from './components';
export { statusBarHeight, // 状态栏高度
logger as networkLogger, };
export const RNStackRef = createRef(); // 记录监控App路由变化，都存这个栈里
export const handleRNNavigationStateChange = (state) => {
    var _a, _b;
    const changeTime = new Date().getTime();
    let stack;
    const { index, routes = [], type } = state;
    const { state: routeState, name, params } = routes[index] || {};
    stack = {
        type,
        name,
        params,
        changeTime,
    };
    if (routeState && routeState instanceof Object) {
        const { index, routes = [], type } = routeState;
        stack.name = (_a = routes[index]) === null || _a === void 0 ? void 0 : _a.name;
        stack.type = type;
        stack.params = (_b = routes[index]) === null || _b === void 0 ? void 0 : _b.params;
    }
    if (Array.isArray(RNStackRef.current)) {
        RNStackRef.current.push(stack);
    }
    else {
        RNStackRef.current = [stack];
    }
};
const RNConsole = props => {
    const { entryVisible, entryText = '', entryStyle, consoleType = ['log', 'info', 'warn', 'error'], maxLogLength = 200, storage, definedData, ignoredHosts, } = props;
    const [visible, setVisible] = useState(entryVisible !== null && entryVisible !== void 0 ? entryVisible : false); // 控制面板是否展示
    const [boardType, setBoardType] = useState(null); // 当前面板
    const init = () => {
        global['$BOARD_LOGGER'] = {
            Console: [],
        };
    };
    const addLog = (boardType, log) => {
        if (global.$BOARD_LOGGER[boardType].length > maxLogLength)
            global.$BOARD_LOGGER[boardType].shift();
        global.$BOARD_LOGGER[boardType].push(log);
    };
    useEffect(() => {
        init();
        // 代理console
        const $console = Object.assign({}, global.console);
        consoleType.forEach(type => {
            global.console[type] = (...messages) => {
                var _a;
                (_a = $console[type]) === null || _a === void 0 ? void 0 : _a.apply(null, messages);
                addLog('Console', { type, messages });
            };
        });
        // 使用react-native-network-logger中的代理
        logger.enableXHRInterception({
            ignoredHosts: ignoredHosts || ['localhost:8081'],
            maxRequests: maxLogLength,
        });
    }, []);
    const onClickEntryButton = () => {
        setVisible(true);
        setBoardType('Console');
    };
    const onClickBoardType = (type) => {
        setBoardType(type);
    };
    return (<>
      <View style={[defaultStyle.entry, entryStyle]}>
        <TouchableOpacity onPress={() => onClickEntryButton()}>
          <Text style={{ color: '#fff' }}>{entryText || 'RNConsole'}</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={visible}>
        <View style={[defaultStyle.modal, { height: Dimensions.get('window').height - 30, paddingTop: Platform.OS === 'ios' ? 70 : 30 }]}>
          <View style={defaultStyle.type}>
            {(['Console', 'Network', 'Stack', 'Storage', 'System']).map(type => (<TouchableOpacity key={type} onPress={() => onClickBoardType(type)} style={[defaultStyle.button, boardType === type ? defaultStyle.activeButton : null]}>
                  <Text style={defaultStyle.label}>{type}</Text>
                </TouchableOpacity>))}
          </View>
          <View style={defaultStyle.list}>
            {boardType === 'Console' ? <ConsoleBoard types={consoleType}/>
            : boardType === 'Network' ? <Network />
                : boardType === 'System' ? <DeviceBoard definedData={definedData}/>
                    : boardType === 'Storage' ? <StorageBoard storage={storage}/>
                        : boardType === 'Stack' ? <StackBoard /> : null}

          </View>
          <View style={[defaultStyle.close, { top: Platform.OS === 'ios' ? 40 : 2 }]}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={defaultStyle.label}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>);
};
const defaultStyle = StyleSheet.create({
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
        display: 'flex',
    },
    button: {
        backgroundColor: '#ddd',
        height: 24,
        width: 65,
        borderRadius: 5,
        justifyContent: 'center',
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
        height: 26,
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
        justifyContent: 'center',
        height: 24,
        width: 65,
        borderRadius: 5,
    },
});
export default RNConsole;
