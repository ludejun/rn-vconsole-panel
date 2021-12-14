// @ts-nocheck
import React, { createRef, useEffect, useState } from 'react'
import { View, TouchableOpacity, Text, Modal, StyleSheet, ViewStyle, Dimensions } from 'react-native'
import {
  ConsoleBoard,
  Network,
  logger,
  DeviceBoard,
  statusBarHeight,
  StorageBoard,
  StackBoard,
} from './components'

export { 
  statusBarHeight, // 状态栏高度
  logger as networkLogger,
} 
export const RNStackRef = createRef<stack[]>() // 记录监控App路由变化，都存这个栈里
export interface stack {
  type: 'stack' | 'tab' | 'drawer';
  name: string;
  params: Record<string, unknown> | undefined;
  changeTime: number;
  duration?: number;
}
export const handleRNNavigationStateChange = (state: any) => {
  const changeTime = new Date().getTime()
  let stack: stack
  const { index, routes = [], type } = state
  const { state: routeState, name, params } = routes[index] || {}
  stack = {
    type,
    name,
    params,
    changeTime,
  }
  if (routeState && routeState instanceof Object) {
    const {index, routes = [], type} = routeState
    stack.name = routes[index]?.name
    stack.type = type
    stack.params = routes[index]?.params
  }
  if(Array.isArray(RNStackRef.current)) {
    RNStackRef.current.push(stack)
  } else {
    RNStackRef.current = [stack]
  }
}

 export interface RNConsole {
  entryVisible?: boolean; // 可以通过父组件控制面板是否展示
  entryText?: string; // 入口Button显示的文字，默认为RNConsole
  entryStyle?: ViewStyle; // 入口Button的样式
  consoleType?: string[]; // 需要console打印出来的日志类型，可以传入自定义类型，默认为['log', 'info', 'warn', 'error']
  maxLogLength?: number; // 各种类型日志数组的长度，超出长度则删除之前暂存的日志，默认200
  ignoredHosts?: string[]; // Network中需要忽略的host
  storage?: {
    getAllKeys: () => Promise<string[]>;
    getItem: (key: string) => Promise<string> | null;
    setItem?: (key: string, value: string) => Promise<void>;
    removeItem?: (key: string) => Promise<void>;
    clear?: () => Promise<void>;
   }; // 读取缓存的各种方式，根据传入方法数展示功能，API参考 https://github.com/react-native-async-storage/async-storage#react-native-async-storage
   definedData?: Record<string, any>; // 在SystemBoard展示的自定义数据
}
export type BoardType = 'Console' | 'Network' | 'Stack' | 'Storage' | 'System'
export type consoleLog = {type: string, messages: unknown}[]

const RNConsole: React.FC<RNConsole> = props => {
  const {
    entryVisible,
    entryText = '',
    entryStyle,
    consoleType = ['log', 'info', 'warn', 'error'],
    maxLogLength = 200,
    storage,
    definedData,
    ignoredHosts,
  } = props
  const [visible, setVisible] = useState(entryVisible ?? false) // 控制面板是否展示
  const [boardType, setBoardType] = useState<BoardType>(null) // 当前面板

  const init = () => {
    global['$BOARD_LOGGER'] = {
      Console: [], 
    }
  }
  
  const addLog = (boardType: BoardType, log: any) => {
    if (global.$BOARD_LOGGER[boardType].length > maxLogLength) global.$BOARD_LOGGER[boardType].shift()

    global.$BOARD_LOGGER[boardType].push(log)
  }

  useEffect(() => {
    init()

    // 代理console
    const $console = { ...global.console }
    consoleType.forEach(type => {
      global.console[type] = (...messages) => {
        $console[type]?.apply(null, messages)
        addLog('Console', { type, messages })
      }
    })

    // 使用react-native-network-logger中的代理
    logger.enableXHRInterception({
      ignoredHosts: ignoredHosts || ['localhost:8081'],
      maxRequests: maxLogLength,
    })
  }, [])
  const onClickEntryButton = () => {
    setVisible(true)
    setBoardType('Console')
  }
  const onClickBoardType = (type: string) => {
    setBoardType(type)
  }

  return (
    <>
      <View style={[defaultStyle.entry, entryStyle]}>
        <TouchableOpacity onPress={() => onClickEntryButton()}>
          <Text style={{ color: '#fff' }}>{entryText || 'RNConsole'}</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={visible}>
        <View style={[defaultStyle.modal, { height: Dimensions.get('window').height - 30, paddingTop: Platform.OS === 'ios' ? 70 : 30 }]}>
          <View style={defaultStyle.type}>
            {
              (['Console', 'Network', 'Stack', 'Storage', 'System']).map(type => (
                <TouchableOpacity key={type} onPress={() => onClickBoardType(type)} style={[defaultStyle.button, boardType === type ? defaultStyle.activeButton : null]}>
                  <Text style={defaultStyle.label}>{type}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
          <View style={defaultStyle.list}>
            {
              boardType === 'Console' ? <ConsoleBoard types={consoleType} />
                : boardType === 'Network' ? <Network />
                : boardType === 'System' ? <DeviceBoard definedData={definedData}/>
                : boardType === 'Storage' ? <StorageBoard storage={storage} />
                : boardType === 'Stack' ? <StackBoard /> : null
            }

          </View>
          <View style={[defaultStyle.close, { top: Platform.OS === 'ios' ? 40 : 2 }]}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={defaultStyle.label}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

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
})

export default RNConsole
