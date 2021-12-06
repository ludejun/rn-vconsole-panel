import React from 'react';
export interface LogContent {
    messages: any;
}
export declare class LogContent extends React.Component<any, LogContent> {
    constructor(props: LogContent);
    private renderMessage;
    private renderMessageContent;
    private renderMessageChildren;
    private toggle;
    render(): JSX.Element | JSX.Element[];
}
export declare const defaultStyle: {
    object: {
        paddingLeft: number;
    };
    row: {
        flexDirection: "row";
    };
    valueUndefined: {
        color: string;
    };
    valueBool: {
        color: string;
    };
    valueNumber: {
        color: string;
    };
    valueString: {
        flex: number;
        color: string;
    };
};
export declare const LogContentString: (props: any) => JSX.Element;
export declare const LogContentObject: (props: any) => JSX.Element;
export declare const LogContentArray: (props: any) => JSX.Element;
