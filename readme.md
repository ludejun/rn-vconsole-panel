# rn-vconsole-panel



A Logger that runs on the device is the same as the chrome console or [vConsole](https://github.com/Tencent/vConsole). rn-vconsole can log the Console, Network, Router Stack, Storage, System Info automatic.

## Features

- 无侵入、分类型、分颜色展示Console日志

- 可以记录自定义Console类型的日志

- Log networks requests on iOS and Android

- View network requests made with in app viewer

- Debug console, network requests and storage on release builds

- 监听API耗时

- 记录用户操作App时的页面栈变化及所携带参数

- 监听用户在每个页面停留时间

- 可以展示所有缓存数据，删除所有或者某一条缓存，修改某一条缓存

- 展示设备信息，可以展示用户自定义数据

  

## Installation

```shell
npm install rn-vconsole-panel
# or
yarn add rn-vconsole-panel
```

## Quick Start

```jsx
import RNConsole, { handleRNNavigationStateChange } from 'rn-vconsole-panel'
import { NavigationContainer } from '@react-navigation/native'

return (
	<View flex>
  	<NavigationContainer
      onStateChange={(state) => {
        handleRNNavigationStateChange(state) // listen to the change of navigation
        // ...
      }
    >
      // Stack & Screen & Tab
    </NavigationContainer>
    {['dev', 'sit'].includes(RNConfig.NODE_ENV) ? 
      <RNConsole
        definedData={{
          userInfo: props.userInfo,
        }} // Add user-defined data in "System" board
      /> : null}
  </View>
)
```

## Screenshots

Entry & Console Board:

<p float="left" align="center">
  <img src="https://raw.githubusercontent.com/ludejun/rn-vconsole/master/examples/entry-ios12.png" width="300" />
  <img src="https://raw.githubusercontent.com/ludejun/rn-vconsole/master/examples/console-board-ios12.jpg" width="300" /> 
</p>

Network Board & Stack Board:

<p float="left" align="center">
  <img src="https://raw.githubusercontent.com/ludejun/rn-vconsole/master/examples/network-board-ios12.png" width="300" />
  <img src="https://raw.githubusercontent.com/ludejun/rn-vconsole/master/examples/stack-board-ios12.png" width="300" /> 
</p>

Storage Board & System Board:

<p float="left" align="center">
  <img src="https://raw.githubusercontent.com/ludejun/rn-vconsole/master/examples/storage-board-ios12.png" width="300" />
  <img src="https://raw.githubusercontent.com/ludejun/rn-vconsole/master/examples/system-board-ios12.png" width="300" /> 
</p>




## Configuration

```js
import RNConsole, { statusBarHeight, RNStackRef, handleRNNavigationStateChange, networkLogger } from 'rn-vconsole-panel';
```

下面分别介绍rn-vconsole导出的RNConsole组件和其余四个值：

#### 1. RNConsole Component

一般接入在顶层App容器中，共分5个面板

Properties：

```tsx
interface RNConsole {
  entryVisible?: boolean; // 可以通过父组件控制面板是否展示
  entryText?: string; // 入口Button显示的文字，默认为RNConsole
  entryStyle?: ViewStyle; // 入口Button的样式
  consoleType?: string[]; // 需要console打印出来的日志类型，可以传入自定义类型，默认为['log', 'info', 'warn', 'error']
  maxLogLength?: number; // 各种类型日志数组的长度，超出长度则删除之前暂存的日志，默认200
  ignoredHosts?: string[]; // Network中需要忽略的host
  storage?: {
    getAllKeys: () => Promise<string[]>;
    getItem: (key: string) => Promise<string>;
    setItem?: (key: string, value: string) => Promise<void>;
    removeItem?: (key: string) => Promise<void>;
    clear?: () => Promise<void>;
   }; // 读取缓存的各种方式，根据传入方法数展示功能，API参考 https://github.com/react-native-async-storage/async-storage#react-native-async-storage
  definedData?: Record<string, any>; // 在SystemBoard展示的自定义数据
}
```

##### consoleType

为Console面板展示的console类型，默认为['log', 'info', 'warn', 'error']，可以添加自定义类型

```js
// example: Add "monitor" type
console.monitor(111111, [1,{a: 'wefawef', c: { d: 1234134}}, [4,5,6]])
console.monitor(222222, [2, { a: 'wefawef', c: { d: 1234134 } }, [4, 5, 6]])
```

```jsx
<RNConsole consoleType={['log', 'error', 'monitor']} />
```

Result:

<p float="left" align="center">
  <img src="https://raw.githubusercontent.com/ludejun/rn-vconsole/master/examples/custom-console-type-ios12.png" width="300" />
</p>

##### maxLogLength

所有面板展示日志的长度，超出长度前面的出栈，默认为200

##### ignoredHosts

Network面板中需要忽略的host数组，默认忽视'localhost:8081'

##### storage

操作storage所需的方法，如没有，则Storage面板展示为空，参考[react-native-async-storage](https://github.com/react-native-async-storage/async-storage#react-native-async-storage) 的API

有getAllKeys、getItem方法则正常展示storage列表

有setItem方法允许重新设置每一项

有removeItem方法允许删除某一项

有clear方法允许删除所有storage列表

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage'

// example: Use the functions of "AsyncStorage" to operate storage
...
<RNConsole storage={{getAllKeys: AsyncStorage.getAllKeys, getItem: AsyncStorage.getItem, setItem: AsyncStorage.setItem, removeItem: AsyncStorage.removeItem, clear: AsyncStorage.clear}} />
```

##### definedData

需要在System面板展示的用户自定义Data

```jsx
<RNConsole
  definedData={{
    userInfo: props.userInfo,
    version: configs.version,
      ...
  }}
/>
```



#### 2. statusBarHeight: number

The statusBar height of Android or iOS.



#### 3. RNStackRef：createRef<stack[]>()

存储所有页面栈的数据，可以供监控或者埋点，当前页面就是栈中的最后一项。是Stack面板的数据源。

```tsx
interface stack {
  type: 'stack' | 'tab' | 'drawer'; // The type of screen, same as @react-navigation/native
  name: string; // Screen name
  params: Record<string, unknown> | undefined; // The params of this screen
  changeTime: number; // The time of this screen's DidMount, similar
  duration?: number; // Time on this screen, similar
}
```



#### 4. handleRNNavigationStateChange:  (state) => void

需要在NavigationContainer的onStateChange方法中调用，用来监听页面变化，如没有监听则Stack面板为空

```jsx
<NavigationContainer
  onStateChange={(state) => {
    handleRNNavigationStateChange(state) // listen to the change of navigation
    // ...
  }
>
  // Stack & Screen & Tab
</NavigationContainer>
```



#### 5. networkLogger

The instance of networkLogger. You can get or handle all requests.

```js
networkLogger.getRequests(); // get all data of request list
networkLogger.clearRequests(); // clear all data
...
```





## Others 

"Clear" means clear all data in this board.

"Close" means close the model of rn-vconsole.



## Issues

tsc(tsconfig.json) compile react-native npm library：ReferenceError: React is not defined

Origin tsconfig.json:

```json
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",
    "module": "commonjs",
    "lib": [],
    "allowJs": true,                          /* Allow javascript files to be compiled. */
    "jsx": "react-native",
    "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    "outDir": "./lib",
    "isolatedModules": true,
    "strict": false,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  },
  "exclude": [
    "node_modules", "babel.config.js", "metro.config.js", "jest.config.js"
  ],
}

```

Change "target、modules、lib" to:

```json
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es2017", 
    "module": "ESNext",
    "lib": [ "es2017" ],
	...
}
```

OK, success. https://stackoverflow.com/questions/57182197/react-native-jest-ts-jest-referenceerror-react-is-not-defined
