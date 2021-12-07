# RN-Vconsole



A Logger that runs on the device is the same as the chrome console or vconsole. rn-vconsole can log the Console, Network, Router Stack, Storage, System Info automatic.



### Installation

```shell
npm install rn-vconsole
# or
yarn add rn-vconsole
```

### Quick Start

```jsx
import RNConsole, { handleRNNavigationStateChange } from 'rn-vconsole'
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
    {['dev', 'sit'].includes(RNConfig.NODE_ENV) ? <RNConsole
        definedData={{
          userInfo: props.userInfo,
        }} // Add user-defined data in "System" board
      /> : null}
  </View>
)
```

### Screenshots







### Configuration











tsc(tsconfig.json) compile react-native npm library：ReferenceError: React is not defined

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
    "outDir": "./lib",                        /* Redirect output structure to the directory. */
    "isolatedModules": true,
    "strict": false,                           /* Enable all strict type-checking options. */
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

OK, success.

https://stackoverflow.com/questions/57182197/react-native-jest-ts-jest-referenceerror-react-is-not-defined
