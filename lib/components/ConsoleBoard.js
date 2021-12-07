import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LogContent } from './LogContent';
export const ConsoleBoard = (props) => {
    const { types } = props;
    // @ts-ignore
    const data = global.$BOARD_LOGGER.Console;
    const [listData, setData] = useState(data);
    const sc = useRef(null);
    const colorMap = {
        log: '#AAA',
        info: '#0074D9',
        warn: '#FF851B',
        error: '#FF4136',
    };
    const onClickType = (type) => {
        if (type === 'all')
            setData(data);
        else
            setData(data.filter(({ type: msgTypee }) => msgTypee === type));
    };
    const onClickClear = () => {
        // @ts-ignore
        global.$BOARD_LOGGER.Console = [];
        setData([]);
    };
    useEffect(() => {
        var _a;
        setData(data);
        (_a = sc.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd();
    }, []);
    useEffect(() => {
        var _a;
        (_a = sc.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd();
    }, [listData]);
    return (<View style={defaultStyle.container}>
      <View style={defaultStyle.logContent}>
        <ScrollView ref={sc}>
          {listData.map(({ type, messages }, i) => <View style={defaultStyle.item} key={`${type}${i}`}>
            <Text style={[defaultStyle.dot, { color: colorMap[type] }]}>•</Text>
            <View style={defaultStyle.messages}>
              <LogContent key={i} messages={messages}/>
            </View>
          </View>)}
        </ScrollView>
      </View>

      <View style={defaultStyle.buttonContainer}>
        <TouchableOpacity onPress={() => onClickType('all')} style={[defaultStyle.button]}>
          <Text style={defaultStyle.label}>All</Text>
        </TouchableOpacity>
        {types.map(type => <TouchableOpacity key={type} onPress={() => onClickType(type)} style={[defaultStyle.button, { backgroundColor: colorMap[type] }]}>
          <Text style={defaultStyle.label}>{type}</Text>
        </TouchableOpacity>)}
      </View>
      <View style={defaultStyle.clear}>
        <TouchableOpacity onPress={() => onClickClear()}>
          <Text style={defaultStyle.label}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>);
};
const defaultStyle = StyleSheet.create({
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
