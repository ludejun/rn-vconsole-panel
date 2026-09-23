<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel@master/assets/logo.svg" width="96" height="96" alt="rn-vconsole-panel" />
</p>

<h1 align="center">rn-vconsole-panel</h1>

<p align="center">
  An on-device debug console for React Native — Console, Network, Router stack,
  Storage and System panels, the way Chrome DevTools or
  <a href="https://github.com/Tencent/vConsole">vConsole</a> work on the web.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/rn-vconsole-panel"><img src="https://img.shields.io/npm/v/rn-vconsole-panel.svg?logo=npm&color=cb3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/rn-vconsole-panel"><img src="https://img.shields.io/npm/dm/rn-vconsole-panel.svg?color=cb3837" alt="npm downloads" /></a>
  <a href="https://www.npmjs.com/package/rn-vconsole-panel"><img src="https://img.shields.io/npm/types/rn-vconsole-panel.svg?logo=typescript&logoColor=white" alt="types included" /></a>
  <br />
  <a href="https://github.com/ludejun/rn-vconsole-panel/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/rn-vconsole-panel.svg?color=blue" alt="license" /></a>
  <a href="https://github.com/ludejun/rn-vconsole-panel/stargazers"><img src="https://img.shields.io/github/stars/ludejun/rn-vconsole-panel?logo=github&color=yellow" alt="GitHub stars" /></a>
  <a href="https://github.com/ludejun/rn-vconsole-panel/blob/master/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" /></a>
  <img src="https://img.shields.io/badge/react--native-%3E%3D0.59-61dafb?logo=react&logoColor=white" alt="react-native >= 0.59" />
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey" alt="iOS and Android" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/rn-vconsole-panel">npm</a>
  ·
  <a href="./CHANGELOG.md">Changelog</a>
  ·
  <a href="./CONTRIBUTING.md">Contributing</a>
  ·
  <a href="./readme_CN.md">中文文档</a>
</p>

---

A Logger that runs on the device, the same way the Chrome console or [vConsole](https://github.com/Tencent/vConsole) does. rn-vconsole-panel records the Console, network requests, the router stack, storage and system info automatically.

## Features

- Non-intrusive, categorized by log type, and displayed in different colors for Console logs

- Can record custom Console log types

- Log networks requests on iOS and Android

- Debug console, network requests, and storage on release builds

- Monitor API response time

- Record the page stack changes and parameters when users navigate through the app

- Track the time users spend on each page

- Display all cached data, delete all or specific cache entries, and modify specific cache entries

- Show device information: OS, version, dimensions, resolution, status bar height, etc., and display user-defined data such as user info, UUID, app version, current environment, etc.

## Installation

```shell
pnpm add rn-vconsole-panel
# or
npm install rn-vconsole-panel
# or
yarn add rn-vconsole-panel
```

TypeScript declarations ship with the package — no `@types/…` needed.

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
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/entry-ios12.png" width="300" />
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/console-board-ios12.jpg" width="300" /> 
</p>

Network Board & Stack Board:

<p float="left" align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/network-board-ios12.png" width="300" />
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/stack-board-ios12.png" width="300" /> 
</p>

Storage Board & System Board:

<p float="left" align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/storage-board-ios12.png" width="300" />
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/system-board-ios12.png" width="300" /> 
</p>

## Configuration

```js
import RNConsole, {
  statusBarHeight,
  RNStackRef,
  handleRNNavigationStateChange,
  networkLogger,
} from 'rn-vconsole-panel';
```

Below are the details of the RNConsole component and other exported values:

#### 1. RNConsole Component

Typically integrated into the top-level App container, divided into 5 panels.

Properties:

```tsx
interface RNConsole {
  entryVisible?: boolean; // Control whether the panel is displayed
  entryText?: string; // Text displayed on the entry button, default is "RNConsole"
  entryStyle?: ViewStyle; // Style of the entry button
  consoleType?: string[]; // Types of logs to display in the Console panel, default is ['log', 'info', 'warn', 'error']
  maxLogLength?: number; // Maximum length of log arrays, older logs are removed when exceeded, default is 200
  ignoredHosts?: string[]; // Hosts to ignore in the Network panel
  storage?: {
    getAllKeys: () => Promise<string[]>;
    getItem: (key: string) => Promise<string | null>;
    setItem?: (key: string, value: string) => Promise<void>;
    removeItem?: (key: string) => Promise<void>;
    clear?: () => Promise<void>;
  }; // Methods for interacting with storage, API reference: https://github.com/react-native-async-storage/async-storage#react-native-async-storage
  definedData?: Record<string, any>; // Custom data to display in the System panel
}
```

##### consoleType

Defines the types of logs displayed in the Console panel. Default is ['log', 'info', 'warn', 'error']. Custom types can be added.

```js
// example: Add "monitor" type
console.monitor(111111, [1, { a: 'wefawef', c: { d: 1234134 } }, [4, 5, 6]]);
console.monitor(222222, [2, { a: 'wefawef', c: { d: 1234134 } }, [4, 5, 6]]);
```

```jsx
<RNConsole consoleType={['log', 'error', 'monitor']} />
```

Result:

<p float="left" align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/rn-vconsole-panel/examples/custom-console-type-ios12.png" width="300" />
</p>

##### maxLogLength

Maximum length of logs displayed in all panels. Older logs are removed when exceeded. Default is 200.

##### ignoredHosts

Array of hosts to ignore in the Network panel. Default is ['localhost:8081'].

##### storage

Methods for interacting with storage. If not provided, the Storage panel will be empty. Refer to [react-native-async-storage](https://github.com/react-native-async-storage/async-storage#react-native-async-storage) for API details.

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage'

// example: Use the functions of "AsyncStorage" to operate storage
...
<RNConsole storage={{getAllKeys: AsyncStorage.getAllKeys, getItem: AsyncStorage.getItem, setItem: AsyncStorage.setItem, removeItem: AsyncStorage.removeItem, clear: AsyncStorage.clear}} />
```

##### definedData

Custom data to display in the System panel.

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

The status bar height for Android or iOS.

#### 3. RNStackRef: createRef<stack[]>()

Stores all page stack data, useful for monitoring or analytics. The current page is the last item in the stack. This is the data source for the Stack panel.

```tsx
interface stack {
  type: 'stack' | 'tab' | 'drawer'; // The type of screen, same as @react-navigation/native
  name: string; // Screen name
  params: Record<string, unknown> | undefined; // The params of this screen
  changeTime: number; // The time of this screen's DidMount
  duration?: number; // Time spent on this screen
}
```

#### 4. handleRNNavigationStateChange: (state) => void

Should be called in the `onStateChange` method of `NavigationContainer` to monitor navigation changes. Without this, the Stack panel will be empty.

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

The instance of `networkLogger`. You can retrieve or handle all requests.

```js
networkLogger.getRequests(); // get all data of request list
networkLogger.clearRequests(); // clear all data
...
```

## Others

"Clear" means clear all data in this board.

"Close" means close the model of rn-vconsole.

## Contributing

Bug reports and pull requests are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) for the
fork → pull request flow.

## License

[MIT](./LICENSE)
