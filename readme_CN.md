<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel@master/assets/logo.svg" width="96" height="96" alt="rn-vconsole-panel" />
</p>

<h1 align="center">rn-vconsole-panel</h1>

<p align="center">
  运行在设备上的 React Native 调试控制台 —— Console、网络请求、路由栈、缓存、系统信息五个面板，
  用起来和网页上的 Chrome DevTools 或 <a href="https://github.com/Tencent/vConsole">vConsole</a> 一样。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/rn-vconsole-panel"><img src="https://img.shields.io/npm/v/rn-vconsole-panel.svg?logo=npm&color=cb3837" alt="npm 版本" /></a>
  <a href="https://www.npmjs.com/package/rn-vconsole-panel"><img src="https://img.shields.io/npm/dm/rn-vconsole-panel.svg?color=cb3837" alt="npm 月下载量" /></a>
  <a href="https://www.npmjs.com/package/rn-vconsole-panel"><img src="https://img.shields.io/npm/types/rn-vconsole-panel.svg?logo=typescript&logoColor=white" alt="内置类型定义" /></a>
  <br />
  <a href="https://github.com/ludejun/rn-vconsole-panel/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/rn-vconsole-panel.svg?color=blue" alt="开源协议" /></a>
  <a href="https://github.com/ludejun/rn-vconsole-panel/stargazers"><img src="https://img.shields.io/github/stars/ludejun/rn-vconsole-panel?logo=github&color=yellow" alt="GitHub Star 数" /></a>
  <a href="https://github.com/ludejun/rn-vconsole-panel/blob/master/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PR-欢迎提交-brightgreen.svg" alt="欢迎 PR" /></a>
  <img src="https://img.shields.io/badge/react--native-%3E%3D0.59-61dafb?logo=react&logoColor=white" alt="react-native >= 0.59" />
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey" alt="iOS 和 Android" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/rn-vconsole-panel">npm</a>
  ·
  <a href="./CHANGELOG.md">更新日志</a>
  ·
  <a href="./CONTRIBUTING.md">贡献指南</a>
  ·
  <a href="./readme.md">English</a>
</p>

---

一个运行在设备上的日志工具，与 Chrome 控制台或 [vConsole](https://github.com/Tencent/vConsole) 类似。rn-vconsole-panel 可以自动记录 Console、网络请求、路由栈、存储、系统信息等。

## 功能

- 无侵入、分日志类型、数据类型分颜色展示 Console 日志

- 可以记录自定义 Console 类型的日志

- 记录 iOS 和 Android 的网络请求

- 在发布版本中调试 Console、网络请求和存储

- 监听 API 耗时

- 记录用户操作 App 时的页面栈变化及所携带参数

- 监听用户在每个页面停留时间

- 可以展示所有缓存数据，删除所有或者某一条缓存，修改某一条缓存

- 展示设备信息：os、版本、宽高、分辨率、状态栏高度等，可以展示用户自定义数据，如：用户信息、uuid、app version、当前环境等

## 安装

```shell
npm install rn-vconsole-panel
# 或
yarn add rn-vconsole-panel
```

## 快速开始

```jsx
import RNConsole, { handleRNNavigationStateChange } from 'rn-vconsole-panel'
import { NavigationContainer } from '@react-navigation/native'

return (
  <View flex>
    <NavigationContainer
      onStateChange={(state) => {
        handleRNNavigationStateChange(state) // 监听导航状态变化
        // ...
      }
    >
      // Stack & Screen & Tab
    </NavigationContainer>
    {['dev', 'sit'].includes(RNConfig.NODE_ENV) ?
      <RNConsole
        definedData={{
          userInfo: props.userInfo,
        }} // 在 "System" 面板中添加用户自定义数据
      /> : null}
  </View>
)
```

## 截图

入口 & Console 面板：

<p float="left" align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/entry-ios12.png" width="300" />
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/console-board-ios12.jpg" width="300" /> 
</p>

网络面板 & 栈面板：

<p float="left" align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/network-board-ios12.png" width="300" />
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/stack-board-ios12.png" width="300" /> 
</p>

存储面板 & 系统面板：

<p float="left" align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/storage-board-ios12.png" width="300" />
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/system-board-ios12.png" width="300" /> 
</p>

## 配置

```js
import RNConsole, {
  statusBarHeight,
  RNStackRef,
  handleRNNavigationStateChange,
  networkLogger,
} from 'rn-vconsole-panel';
```

下面分别介绍 rn-vconsole 导出的 RNConsole 组件和其余四个值：

#### 1. RNConsole 组件

一般接入在顶层 App 容器中，共分 5 个面板。

属性：

```tsx
interface RNConsole {
  entryVisible?: boolean; // 可以通过父组件控制面板是否展示
  entryText?: string; // 入口按钮显示的文字，默认为 "RNConsole"
  entryStyle?: ViewStyle; // 入口按钮的样式
  consoleType?: string[]; // Console 面板展示的日志类型，默认为 ['log', 'info', 'warn', 'error']
  maxLogLength?: number; // 各种类型日志数组的长度，超出长度则删除之前暂存的日志，默认 200
  ignoredHosts?: string[]; // Network 面板中需要忽略的 host
  storage?: {
    getAllKeys: () => Promise<string[]>;
    getItem: (key: string) => Promise<string | null>;
    setItem?: (key: string, value: string) => Promise<void>;
    removeItem?: (key: string) => Promise<void>;
    clear?: () => Promise<void>;
  }; // 读取缓存的各种方式，根据传入方法数展示功能，API 参考 https://github.com/react-native-async-storage/async-storage#react-native-async-storage
  definedData?: Record<string, any>; // 在 System 面板展示的自定义数据
}
```

##### consoleType

为 Console 面板展示的 console 类型，默认为 ['log', 'info', 'warn', 'error']，可以添加自定义类型。

```js
// 示例：添加 "monitor" 类型
console.monitor(111111, [1, { a: 'wefawef', c: { d: 1234134 } }, [4, 5, 6]]);
console.monitor(222222, [2, { a: 'wefawef', c: { d: 1234134 } }, [4, 5, 6]]);
```

```jsx
<RNConsole consoleType={['log', 'error', 'monitor']} />
```

结果：

<p float="left" align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/custom-console-type-ios12.png" width="300" />
</p>

##### maxLogLength

所有面板展示日志的长度，超出长度前面的出栈，默认为 200。

##### ignoredHosts

Network 面板中需要忽略的 host 数组，默认忽视 'localhost:8081'。

##### storage

操作 storage 所需的方法，如没有，则 Storage 面板展示为空，参考 [react-native-async-storage](https://github.com/react-native-async-storage/async-storage#react-native-async-storage) 的 API。

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage'

// 示例：使用 "AsyncStorage" 的方法操作存储
...
<RNConsole storage={{getAllKeys: AsyncStorage.getAllKeys, getItem: AsyncStorage.getItem, setItem: AsyncStorage.setItem, removeItem: AsyncStorage.removeItem, clear: AsyncStorage.clear}} />
```

##### definedData

需要在 System 面板展示的用户自定义数据。

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

Android 或 iOS 的状态栏高度。

#### 3. RNStackRef：createRef<stack[]>()

存储所有页面栈的数据，可以供监控或者埋点，当前页面就是栈中的最后一项。是 Stack 面板的数据源。

```tsx
interface stack {
  type: 'stack' | 'tab' | 'drawer'; // 页面类型，与 @react-navigation/native 一致
  name: string; // 页面名称
  params: Record<string, unknown> | undefined; // 页面参数
  changeTime: number; // 页面 DidMount 的时间
  duration?: number; // 页面停留时间
}
```

#### 4. handleRNNavigationStateChange: (state) => void

需要在 NavigationContainer 的 onStateChange 方法中调用，用来监听页面变化，如没有监听则 Stack 面板为空。

```jsx
<NavigationContainer
  onStateChange={(state) => {
    handleRNNavigationStateChange(state) // 监听导航状态变化
    // ...
  }
>
  // Stack & Screen & Tab
</NavigationContainer>
```

#### 5. networkLogger

`networkLogger` 的实例。可以获取或操作所有请求。

```js
networkLogger.getRequests(); // 获取所有请求数据
networkLogger.clearRequests(); // 清除所有请求数据
...
```

## 其他

"Clear" 表示清除该面板中的所有数据。

"Close" 表示关闭 rn-vconsole 的模型。

## 参与贡献

欢迎提 issue 和 PR —— fork → Pull Request 的流程见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 开源协议

[MIT](./LICENSE)
