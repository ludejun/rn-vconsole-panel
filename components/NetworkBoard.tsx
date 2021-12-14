import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import logger from './NetworkLogger'
import NetworkRequestInfo from './NetworkRequestInfo'
import { LogContent } from './LogContent'
import { jsonParse } from '../utils'

export const Network = () => {
  const [data, setData] = useState<NetworkRequestInfo[]>([])
  const sc = useRef(null)

  useEffect(() => {
    setData(logger.getRequests())
  }, [])
  useEffect(() => {
    sc.current?.scrollToEnd()
  }, [data])
  const onClickClear = () => {
    logger.clearRequests()
    setData([])
  }

  return (
    <View style={defaultStyle.container}>
      <ScrollView ref={sc}>
        {
        data.sort((a, b) => Number(a.id) - Number(b.id)).map((request, index) => (
          <RequestOverview data={request} key={`${request.id}${index}`} />
        ))
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

const RequestOverview = (props: { data: NetworkRequestInfo }) => {
  const { data } = props
  const { method, status, url, duration, requestHeaders, responseHeaders, dataSent } = data
  const [show, setShow] = useState<'none' | 'flex'>('none')
  const [requestBody, setBody] = useState(dataSent)
  const [responseBody, setResp] = useState({})

  const colorMap = {
    statusGood: '#28a844',
    statusWarning: '#ffc007',
    statusBad: '#dd3444',
  }
  const chooseColor = (status: number) => {
    if (status < 400) return colorMap.statusGood
     if (status < 500) return colorMap.statusWarning
     if (status >= 500) return colorMap.statusBad
  }

  const onClickRequest = () => {
    setShow(show === 'none' ? 'flex' : 'none')
    setBody(jsonParse(requestBody))
    data.getResponseBody().then(resp => setResp(jsonParse(resp)))
  }

  return (
    <>
      <TouchableOpacity onPress={() => onClickRequest()}>
        <View style={defaultStyle.item}>
          <View style={defaultStyle.left}>
            <Text style={[defaultStyle.method, { color: chooseColor(status) }]}>{method}</Text>
            <Text style={defaultStyle.text}>{status}</Text>
            <Text style={defaultStyle.text}>{duration > 0 ? `${duration}ms` : 'pending'}</Text>
          </View>
          <View style={defaultStyle.right}><Text style={{ color: status < 400 ? undefined : chooseColor(status) }}>{url}</Text></View>
        </View>
      </TouchableOpacity>
      <View style={[defaultStyle.request, { display: show }]}>
        <Text style={defaultStyle.header}>Response Headers:</Text>
        <LogContent messages={responseHeaders} />
        <Text style={defaultStyle.header}>Request Headers:</Text>
        <LogContent messages={requestHeaders} />
        <Text style={defaultStyle.header}>Request Body:</Text>
        <LogContent messages={requestBody} />
        <Text style={defaultStyle.header}>Response Body:</Text>
        <LogContent messages={responseBody} />
      </View>
      <View style={defaultStyle.lineBank} />
    </>
  )
}

const defaultStyle = StyleSheet.create({
  container: {
    height: '100%',
  },
  lineBank: {
    height: 1,
    backgroundColor: '#eee',
  },
  item: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    width: '100%',
  },
  left: {
    flexDirection: 'column',
    width: 50,
  },
  method: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 14,
  },
  header: {
    fontSize: 14,
    fontWeight: '500',
  },
  request: {
    marginTop: 4,
    paddingTop: 4,
    backgroundColor: '#eee',
    paddingBottom: 4,
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
