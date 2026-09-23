import React, { useEffect, useRef } from 'react';
import {
  Appearance,
  Dimensions,
  PixelRatio,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LogContent } from './LogContent';

// 计算状态栏高度，iOS在无刘海屏为20、其余为44，这块可能需要改
export const statusBarHeight =
  Platform.OS !== 'ios'
    ? StatusBar.currentHeight
    : [667, 736].indexOf(Dimensions.get('window').height) > -1
      ? 20
      : 44;
export interface DeviceBoardProps {
  definedData?: Record<string, any>;
}

/**
 * Manufacturer, Brand and Model live only on the Android member of
 * Platform.constants, which TypeScript cannot narrow from Platform.OS alone.
 */
const androidModel = () => {
  const constants = Platform.constants as Partial<
    Record<'Manufacturer' | 'Brand' | 'Model', string>
  >;
  return `${constants.Manufacturer}/${constants.Brand}/${constants.Model}`;
};

export const DeviceBoard = (props: DeviceBoardProps) => {
  const { definedData } = props;
  const { major, minor, patch } = Platform.constants?.reactNativeVersion || {};
  const data = {
    os: Platform.OS,
    osVersion: Platform.Version,
    model: Platform.OS === 'ios' ? 'iPhone' : androidModel(),
    RNVersion: `${major}.${minor}.${patch}`,
    colorScheme: Appearance.getColorScheme(),
    windowWidth: Dimensions.get('window').width,
    windowHeight: Dimensions.get('window').height,
    pixelRatio: PixelRatio.get(),
    statusBarHeight,
  };
  const sc = useRef<React.ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    sc.current?.scrollToEnd();
  }, []);

  return (
    <View style={defaultStyle.container}>
      <ScrollView ref={sc}>
        {Object.keys(data).map((key) => (
          <View key={key} style={defaultStyle.item}>
            <View style={defaultStyle.left}>
              <Text>{key}</Text>
            </View>
            <View style={defaultStyle.right}>
              <LogContent messages={(data as Record<string, unknown>)[key]} />
            </View>
          </View>
        ))}
        <View style={defaultStyle.lineHeight} />
        {definedData
          ? Object.keys(definedData).map((key) => (
              <View key={key} style={defaultStyle.item}>
                <View style={defaultStyle.left}>
                  <Text>{key}</Text>
                </View>
                <View style={defaultStyle.right}>
                  <LogContent messages={definedData[key]} />
                </View>
              </View>
            ))
          : null}
      </ScrollView>
    </View>
  );
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
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  left: {
    width: 120,
  },
  right: {
    flex: 1,
    paddingLeft: 10,
  },
  lineHeight: {
    height: 10,
    backgroundColor: '#eee',
  },
});
