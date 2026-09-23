import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { splitString } from '../utils';

/** Any value the console, network or storage panels want rendered. */
export type LogValue = unknown;

export interface LogContentProps {
  messages: LogValue;
  /** Console entries render without the array index as a key prefix. */
  isConsole?: boolean;
}

/** A node's key path, used both as a React key and as the expand/collapse id. */
type NodeId = string | number | undefined;

/** Which nested nodes are currently expanded, keyed by node id. */
type ExpandedState = Record<string, boolean>;

export class LogContent extends React.Component<LogContentProps, ExpandedState> {
  constructor(props: LogContentProps) {
    super(props);
    this.state = {};
  }

  private isExpanded = (id: NodeId) => (id === undefined ? false : !!this.state[String(id)]);

  private renderMessage = (message: LogValue, name: NodeId, id: NodeId) => (
    <View key={Math.random()} style={{ flex: 1 }}>
      {this.renderMessageContent(message, name, id)}
      {this.renderMessageChildren(message, id)}
    </View>
  );

  private renderMessageContent = (message: LogValue, name: NodeId, id: NodeId) => {
    if (message instanceof Array)
      return (
        <LogContentArray
          key={`${name}${id}`}
          name={name}
          message={message}
          toggle={() => this.toggle(id)}
          isShow={this.isExpanded(id)}
        />
      );
    if (typeof message === 'object' && message !== null)
      return (
        <LogContentObject
          key={`${name}${id}`}
          name={name}
          message={message}
          toggle={() => this.toggle(id)}
          isShow={this.isExpanded(id)}
        />
      );

    return <LogContentString name={name} value={message} />;
  };

  private renderMessageChildren = (message: LogValue, id: NodeId) => {
    if (!this.isExpanded(id)) return undefined;
    if (message instanceof Array)
      return (
        <View style={defaultStyle.object} key={id}>
          {message.map((child, i) => this.renderMessage(child, i, `${id}${i}`))}
        </View>
      );
    if (typeof message === 'object' && message !== null) {
      const record = message as Record<string, LogValue>;
      return (
        <View style={defaultStyle.object} key={id}>
          {Object.keys(record).map((child) =>
            this.renderMessage(record[child], child, `${id}${child}`),
          )}
        </View>
      );
    }
    return undefined;
  };

  private toggle = (id: NodeId) => {
    if (id === undefined) return;
    const key = String(id);
    this.setState((previous) => ({ [key]: !previous[key] }));
  };

  override render() {
    const { messages, isConsole = false } = this.props;
    return Array.isArray(messages)
      ? messages.map((message, index) =>
          this.renderMessage(message, isConsole ? undefined : index, isConsole ? undefined : index),
        )
      : this.renderMessage(messages, undefined, undefined);
  }
}

export const defaultStyle = StyleSheet.create({
  object: {
    paddingLeft: 20,
  },
  row: {
    flexDirection: 'row',
  },
  valueUndefined: {
    color: '#bbb',
  },
  valueBool: {
    color: '#0074D9',
  },
  valueNumber: {
    color: '#0074D9',
  },
  valueString: {
    flex: 1,
    color: '#0a3069',
  },
});

export interface LogContentStringProps {
  name?: string | number;
  value?: LogValue;
}

export const LogContentString = (props: LogContentStringProps) => {
  const { name, value } = props;
  const generateContent = () => {
    if (value === undefined) return <Text style={defaultStyle.valueUndefined}>undefined</Text>;
    if (value === null) return <Text style={defaultStyle.valueUndefined}>null</Text>;
    if (value === true || value === false)
      return <Text style={defaultStyle.valueBool}>{value.toString()}</Text>;
    if (Number.isInteger(value))
      return <Text style={defaultStyle.valueNumber}>{value as number}</Text>;

    return <Text style={defaultStyle.valueString}>{`"${splitString(value.toString())}"`}</Text>;
  };

  return (
    <View style={defaultStyle.row}>
      {name !== undefined && <Text>{name}: </Text>}
      {generateContent()}
    </View>
  );
};

export interface LogContentNodeProps {
  name?: string | number;
  toggle?: () => void;
  isShow?: boolean;
}

export const LogContentObject = (props: LogContentNodeProps & { message: object }) => {
  const { name, message, toggle, isShow } = props;
  const [showMsg, setShowMsg] = useState('');
  const icon = isShow ? '▼' : '▶';

  useEffect(() => {
    let msg = '{';
    const record = message as Record<string, LogValue>;
    Object.keys(record).forEach((key) => {
      const value = record[key];
      if (value instanceof Array) msg += `${key}: Array(${value.length}), `;
      else if (typeof value === 'object' && value !== null) msg += `${key}: {...}, `;
      else if (typeof value === 'string') msg += `${key}: "${splitString(value)}", `;
      else msg += `${key}: ${splitString(String(value))}, `;
    });
    setShowMsg(`${msg.length > 1 ? msg.slice(0, -2) : msg}}`);
  }, []);

  return (
    <TouchableOpacity onPress={toggle}>
      <Text numberOfLines={1}>
        {icon} {name}
        {name || name === 0 ? ': ' : ''} {!isShow ? showMsg : ''}
      </Text>
    </TouchableOpacity>
  );
};

export const LogContentArray = (props: LogContentNodeProps & { message?: LogValue[] }) => {
  const { name = '', message = [], toggle, isShow } = props;
  const [showMsg, setShowMsg] = useState('');
  const icon = isShow ? '▼' : '▶';

  useEffect(() => {
    let msg = '[';
    message.forEach((item: LogValue) => {
      if (item instanceof Array) msg += `Array(${item.length}), `;
      else if (typeof item === 'object' && item !== null) msg += '{...}, ';
      else if (typeof item === 'string') msg += `"${splitString(item)}", `;
      else msg += `${splitString(String(item))}, `;
    });
    setShowMsg(`${msg.length > 1 ? msg.slice(0, -2) : msg}]`);
  }, []);

  return (
    <TouchableOpacity onPress={toggle}>
      <Text numberOfLines={1}>
        {icon} {`${name}${name || name === 0 ? ': ' : ''}(${message.length})${showMsg}`}
      </Text>
    </TouchableOpacity>
  );
};
