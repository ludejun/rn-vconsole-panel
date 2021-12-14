import React, { FC, useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { LogContent } from './LogContent'
import { jsonParse } from '../utils'

export interface StorageBoard {
  storage?: {
    getAllKeys: () => Promise<string[]>;
    getItem: (key: string) => Promise<string> | null;
    setItem?: (key: string, value: string) => Promise<void>;
    removeItem?: (key: string) => Promise<void>;
    clear?: () => Promise<void>;
  }; // 读取缓存的各种方式，根据传入方法数展示功能，API参考 https://github.com/react-native-async-storage/async-storage#react-native-async-storage
}

export const StorageBoard: FC<StorageBoard> = props => {
  const { getAllKeys, getItem, setItem, removeItem, clear } = props.storage || {}
  const sc = useRef(null)
  const [data, setData] = useState<Record<string, any>>({})
  const [itemData, setItemData] = useState<Record<string, any> | null>(null) // 点击某一项可以编辑或者删除
  const [edit, setEdit] = useState(false) // 标明input的编辑状态
  const [text, setText] = useState('')

  const getStorage = async () => {
    if (getAllKeys && getItem) {
      const obj: Record<string, any> = {}
      const keys = await getAllKeys()
      await Promise.all(keys.map(key => getItem(key).then(value => obj[key] = jsonParse(value))))
      setData(obj)
    }
  }
  useEffect(() => {
    getStorage()
  }, [])
  useEffect(() => {
    sc.current?.scrollToEnd()
  }, [data])
  const onClickClear = () => {
    clear && clear()
    setData([])
  }
  const onClickItem = (key: string) => {
    if (setItem || removeItem) {
      setItemData({ key, value: data[key] })
    }

    setText(JSON.stringify(data[key]))
  }
  const onClickEdit = () => {
    if (edit) {
      itemData && setItem && setItem(itemData.key, text)
      setEdit(false)
      getStorage()
    } else {
      setEdit(true)
    }
  }
  const onClearItem = async() => {
    if(itemData && itemData.key && removeItem) await removeItem(itemData.key)
    setItemData(null)
    getStorage()
  }
  
  return (
    <View style={defaultStyle.container}>
      <ScrollView ref={sc}>
        <View style={defaultStyle.list}>
        {
          Object.keys(data).length > 0 ? Object.keys(data).map(key => (
            <TouchableOpacity key={key} onPress={() => onClickItem(key)}>
              <View key={key} style={defaultStyle.item}>
                <View style={defaultStyle.left}><Text>{key}</Text></View>
                <View style={defaultStyle.right}>
                  <LogContent messages={data[key]} />
                </View>
              </View>
            </TouchableOpacity>
          )) : <Text style={defaultStyle.disable}>StorageBoard has not been enabled as the functions "getAllKeys", "getItem" are missing.</Text>
        }
        </View>
        <View style={[defaultStyle.bottom, {
          display: !!itemData ? 'flex' : 'none',
          // position: !!itemData ? 'absolute' : 'relative',
          // top: Dimensions.get('screen').height - 260
          }]}>
          <View style={defaultStyle.edit}>
            <Text style={defaultStyle.left}>{itemData?.key}</Text>
            <TextInput value={text} multiline editable={edit} style={defaultStyle.input} onChangeText={(text: string) => setText(text)} />
          </View>
          <View style={defaultStyle.row}>
            <TouchableOpacity onPress={() => onClickEdit()} style={defaultStyle.button}><Text style={defaultStyle.label}>{edit ? 'Save' : 'Edit'} Item</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => onClearItem()} style={defaultStyle.button}><Text style={defaultStyle.label}>Clear Item</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {clear ? <View style={defaultStyle.clear}>
        <TouchableOpacity onPress={() => onClickClear()}>
          <Text style={defaultStyle.label}>Clear All</Text>
        </TouchableOpacity>
      </View> : null}
    </View>
  )
}

const defaultStyle = StyleSheet.create({
  container: {
    height: '100%',
  },
  list: {

  },
  item: {
    flexDirection: 'row',
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  left: {
    width: 120,
  },
  right: {
    flex: 1,
    paddingLeft: 10,
  },
  disable: {
    paddingTop: 20,
    color: '#999',
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
  edit: {
    flexDirection: 'row',
    height: 80,
  }
  ,
  input: {
    borderWidth: 1,
    flex: 1,
    padding: 3,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  button: {
    backgroundColor: '#ffc007',
    padding: 3,
    height: 20,
    width: 80,
    borderRadius: 5,
    marginRight: 8,
  },
  bottom: {
    paddingTop: 4,
    width: '100%',
    height: 112,
    backgroundColor: '#eee',
  },
})
