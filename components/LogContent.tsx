// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { splitString } from '../utils';

export interface LogContent {
  messages: any;
  isConsole: boolean;
}
export class LogContent extends React.Component<any, LogContent> {
  constructor(props: LogContent) {
    super(props);
    this.state = {};
  }

  private renderMessage = (message, name, id) => (
    <View key={Math.random()} style={{ flex: 1 }}>
      {this.renderMessageContent(message, name, id)}
      {this.renderMessageChildren(message, id)}
    </View>
  );

  private renderMessageContent = (message, name, id) => {
    if (message instanceof Array)
      return (
        <LogContentArray
          key={`${name}${id}`}
          name={name}
          message={message}
          toggle={() => this.toggle(id)}
          isShow={this.state[id]}
        />
      );
    if (typeof message === 'object' && message !== null)
      return (
        <LogContentObject
          key={`${name}${id}`}
          name={name}
          message={message}
          toggle={() => this.toggle(id)}
          isShow={this.state[id]}
        />
      );

    return <LogContentString name={name} value={message} />;
  };

  private renderMessageChildren = (message, id) => {
    if (message instanceof Array && this.state[id])
      return (
        <View style={defaultStyle.object} key={id}>
          {message.map((child, i) => this.renderMessage(child, i, `${id}${i}`))}
        </View>
      );
    if (typeof message === 'object' && message && this.state[id])
      return (
        <View style={defaultStyle.object} key={id}>
          {Object.keys(message).map((child) =>
            this.renderMessage(message[child], child, id + child),
          )}
        </View>
      );
  };

  private toggle = (id) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ [id]: !this.state[id] });
  };

  render() {
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

export const LogContentString = (props) => {
  const { name, value } = props;
  const generateContent = () => {
    if (value === undefined) return <Text style={defaultStyle.valueUndefined}>undefined</Text>;
    if (value === null) return <Text style={defaultStyle.valueUndefined}>null</Text>;
    if (value === true || value === false)
      return <Text style={defaultStyle.valueBool}>{value.toString()}</Text>;
    if (Number.isInteger(value)) return <Text style={defaultStyle.valueNumber}>{value}</Text>;

    return <Text style={defaultStyle.valueString}>{`"${splitString(value.toString())}"`}</Text>;
  };

  return (
    <View style={defaultStyle.row}>
      {name !== undefined && <Text>{name}: </Text>}
      {generateContent()}
    </View>
  );
};

export const LogContentObject = (props) => {
  const { name, message, toggle, isShow } = props;
  const [showMsg, setShowMsg] = useState('');
  const icon = isShow ? '▼' : '▶';

  useEffect(() => {
    let msg = '{';
    Object.keys(message).forEach((key) => {
      if (message[key] instanceof Array) msg += `${key}: Array(${message[key].length}), `;
      else if (typeof message[key] === 'object' && message[key] !== null) msg += `${key}: {...}, `;
      else if (typeof message[key] === 'string') msg += `${key}: "${splitString(message[key])}", `;
      else msg += `${key}: ${splitString(String(message[key]))}, `;
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

export const LogContentArray = (props) => {
  const { name = '', message = [], toggle, isShow } = props;
  const [showMsg, setShowMsg] = useState('');
  const icon = isShow ? '▼' : '▶';

  useEffect(() => {
    let msg = '[';
    message.forEach((item) => {
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
