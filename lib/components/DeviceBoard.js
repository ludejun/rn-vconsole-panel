// @ts-nocheck
import React, { useEffect, useRef } from "react";
import { Appearance, Dimensions, PixelRatio, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { LogContent } from "./LogContent";
// 计算状态栏高度，iOS在无刘海屏为20、其余为44，这块可能需要改
export const statusBarHeight = Platform.OS !== 'ios' ? StatusBar.currentHeight : ([667, 736].indexOf(Dimensions.get('window').height) > -1 ? 20 : 44);
export const DeviceBoard = (props) => {
    var _a, _b, _c, _d;
    const { definedData } = props;
    const { major, minor, patch } = ((_a = Platform.constants) === null || _a === void 0 ? void 0 : _a.reactNativeVersion) || {};
    const data = {
        os: Platform.OS,
        osVersion: Platform.Version,
        model: Platform.OS === 'ios' ? 'iPhone' : `${(_b = Platform.constants) === null || _b === void 0 ? void 0 : _b.Manufacturer}/${(_c = Platform.constants) === null || _c === void 0 ? void 0 : _c.Brand}/${(_d = Platform.constants) === null || _d === void 0 ? void 0 : _d.Model}`,
        RNVersion: `${major}.${minor}.${patch}`,
        colorScheme: Appearance.getColorScheme(),
        windowWidth: Dimensions.get('window').width,
        windowHeight: Dimensions.get('window').height,
        pixelRatio: PixelRatio.get(),
        statusBarHeight,
    };
    const sc = useRef(null);
    useEffect(() => {
        var _a;
        (_a = sc.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd();
    }, []);
    return (<View style={defaultStyle.container}>
      <ScrollView ref={sc}>
      {Object.keys(data).map(key => (<View key={key} style={defaultStyle.item}>
            <View style={defaultStyle.left}><Text>{key}</Text></View>
            <View style={defaultStyle.right}><LogContent messages={data[key]}/></View>
          </View>))}
      <View style={defaultStyle.lineHeight}/>
      {definedData ? Object.keys(definedData).map(key => (<View key={key} style={defaultStyle.item}>
              <View style={defaultStyle.left}><Text>{key}</Text></View>
              <View style={defaultStyle.right}><LogContent messages={definedData[key]}/></View>
            </View>)) : null}
      </ScrollView>
    </View>);
};
const defaultStyle = StyleSheet.create({
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
