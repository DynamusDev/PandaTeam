/* eslint-disable react-native/no-inline-styles */
import React from "react"
import { FlatList, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { color } from "../../theme"
import { HeaderButton } from '../headerButton/headerButton'
import { Text } from "../text/text"
import { ChatProps } from "./chat.props"

const CONTAINER: ViewStyle = {
  backgroundColor: color.palette.offWhite,
  flex: 1,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 5,
}

const FLATLISTSTYLE: ViewStyle = {
  flex: 1,
  height: '100%',
  width: '100%'
}
const PASSWORD: TextStyle = {
  height: 'auto',
  fontFamily: 'Montserrat',
  width: '80%',
  borderRadius: 8,
  textAlign: 'left',
  fontSize: 15,
}
const PASS: ViewStyle = {
  width: '98%',
  height: 'auto',
  maxHeight: '30%',
  paddingHorizontal: 5,
  flexDirection: 'row',
  borderRadius: 30,
  borderWidth: 0.6,
  borderColor: color.palette.Pista,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 12,
  backgroundColor: '#E2E2E0'
}
const SEPARATE: ViewStyle = {
  width: '10%',
  height: 45,
  alignItems: 'flex-start',
  justifyContent: 'center'
}
/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Chat(props: ChatProps) {
  // grab the props
  const {
    preset,
    tx,
    messages,
    onEndReached,
    background,
    msgbkgcolor,
    showUser,
    position,
    onSendPress,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    ...rest
  } = props

  // const messages = [
  //   {
  //     id: 'kjbkhbkjbkjbkj',
  //     author: 'Alexandre Nascimento',
  //     message: 'jjkjkkckjahbchkjashckjsbckahsbcksabcjasbckajbckjsbcksjcbkasjbckasjbckasjbkasjcbkasjjbkbkb',
  //     date: '11/07/2020',
  //     time: '16:27'
  //   },
  //   {
  //     id: 'kjbklk;lkokj',
  //     author: 'Priscila Nascimento',
  //     message: 'jjkjkkcjbckasjbkasjcbkasjjbkbkb',
  //     date: '11/07/2020',
  //     time: '16:27'
  //   },
  //   {
  //     id: 'kjbklk;okj',
  //     author: 'Xanddy Nascimento',
  //     message: 'jjkjkkcjbckasjbkasjcbkasjjbkbkb',
  //     date: '11/07/2020',
  //     time: '16:27'
  //   },
  //   {
  //     id: 'kjbkjbkj',
  //     author: 'Alexandre Nascimento',
  //     message: 'jjkjkkckjahbchkjashckjsbckahsbcksabcjasbckajbckjsbcksjcbkasjbckasjbckasjbkasjcbkasjjbkbkb',
  //     date: '11/07/2020',
  //     time: '16:27'
  //   },
  //   {
  //     id: 'kjbklsdk;lkokj',
  //     author: 'Priscila Nascimento',
  //     message: 'jjkjkkcjbckasjbkasjcbkasjjbkbkb',
  //     date: '11/07/2020',
  //     time: '16:27'
  //   },
  //   {
  //     id: 'kjbkl;;lk;lk;okj',
  //     author: 'Xanddy Nascimento',
  //     message: 'jjkjkkcjbckasjbkasjcbkasjjbkbkb',
  //     date: '11/07/2020',
  //     time: '16:27'
  //   },
  // ]

  return (
    <View style={CONTAINER}>
      <FlatList
        data={ messages }
        style={FLATLISTSTYLE}
        contentContainerStyle={{ flex: 1, justifyContent: 'flex-end' }}
        showsVerticalScrollIndicator={true}
        keyExtractor={message => String(message.id)}
        renderItem={({ item: messages }) => (
          <View style={{ height: 'auto', width: '100%', justifyContent: 'center', alignItems: position }}>
            <View style={{ height: 'auto', width: 'auto', maxWidth: '80%', marginBottom: 15, padding: 10, borderRadius: 15, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: msgbkgcolor }}>
              {showUser === true ? (
                <Text style={{ textAlign: 'left', fontSize: 11.5, color: color.whiteChick }} text={'˜' + messages.author} />
              ) : null}
              <Text style={{ textAlign: 'left' }} text={messages.message} />
              <View style={{ height: 'auto', width: 'auto', alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={{ textAlign: 'right', fontSize: 11.5, color: color.whiteChick, marginRight: 10 }} text={messages.time} />
                <Text style={{ textAlign: 'right', fontSize: 11.5, color: color.whiteChick }} text={messages.date} />
              </View>
            </View>
          </View>
        )}
      />
      <View style={PASS}>
        <HeaderButton name='eye' />
        <TextInput style={PASSWORD} multiline={true} placeholder='Digite sua mensagem' />
        <HeaderButton name='eye' onPress={onSendPress} />
      </View>
    </View>
  )
}
