import React from 'react';
import { ViewStyle } from 'react-native';
import { statusBarHeight } from './components';
export { statusBarHeight };
export declare const RNStackRef: React.RefObject<stack[]>;
export interface stack {
    type: 'stack' | 'tab' | 'drawer';
    name: string;
    params: Record<string, unknown> | undefined;
    changeTime: number;
    duration?: number;
}
export declare const handleRNNavigationStateChange: (state: any) => void;
export interface RNConsole {
    entryVisible?: boolean;
    entryText?: string;
    entryStyle?: ViewStyle;
    consoleType?: string[];
    maxLogLength?: number;
    ignoredHosts?: string[];
    storage?: {
        getAllKeys: () => Promise<string[]>;
        getItem: (key: string) => Promise<string>;
        setItem?: (key: string, value: string) => Promise<void>;
        removeItem?: (key: string) => Promise<void>;
        clear?: () => Promise<void>;
    };
    definedData?: Record<string, any>;
}
export declare type BoardType = 'Console' | 'Network' | 'Stack' | 'Storage' | 'System';
export declare type consoleLog = {
    type: string;
    messages: unknown;
}[];
declare const RNConsole: React.FC<RNConsole>;
export default RNConsole;
