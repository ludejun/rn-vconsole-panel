import React, { FC, useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LogContent } from './LogContent'
import { stack, RNStackRef } from '../index'

export const StackBoard: FC = () => {
  const sc = useRef(null)
  const [data, setData] = useState<stack[] | undefined>([])
  const colorMap = {
    stack: '#28a844',
    tab: '#ffc007',
    drawer: '#333',
  }

  useEffect(() => {
    const stackList = RNStackRef?.current
    // console.log(stackList)
    setData(stackList?.map((stack, index) => ({
      ...stack,
      duration: stackList[index + 1] ? (stackList[index + 1].changeTime - stack.changeTime) : (new Date().getTime() - stack.changeTime),
    })) || [])
  }, [])
  useEffect(() => {
    sc.current?.scrollToEnd()
  }, [data])
  const onClickClear = () => {
    // @ts-ignore
    RNStackRef.current = []
    setData([])
  }

  return (
    <View style={defaultStyle.container}>
      <ScrollView ref={sc}>
        {
          data && data.length > 0 ? data.map((stack, index) => (
            <View key={`${stack.name}${index}`} style={defaultStyle.item}>
              <Text style={defaultStyle.text}>{index}: <Text style={[defaultStyle.name, { color: colorMap[stack.type] }]}>{stack.name}</Text></Text>
              <Text style={defaultStyle.text}>    type: {stack.type}        {stack.duration ? <Text style={defaultStyle.text}>Time on Page: {stack.duration / 1000}s</Text> : null}</Text>
              <View style={defaultStyle.row}><Text>   params: </Text><LogContent messages={stack.params} /></View>
            </View>
          )) : <Text style={defaultStyle.disable}>StackBoard has not been enabled as the function "handleRNNavigationStateChange" is missing.</Text>
        }
      </ScrollView>
      <View style={defaultStyle.clear}>
        <TouchableOpacity onPress={() => onClickClear()}>
          <Text style={defaultStyle.label}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const defaultStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
  },
  item: {
    flexDirection: 'column',
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  left: {
    width: 140,
  },
  right: {
    flex: 1,
  },
  disable: {
    paddingTop: 20,
    color: '#999',
  },
  text: {
    fontSize: 10,
  },
  name: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
  clear: {
    position: 'absolute',
    top: -8,
    right: 0,
    backgroundColor: '#ffc007',
    justifyContent: 'center',
    height: 24,
    width: 65,
    borderRadius: 5,
  },
})
