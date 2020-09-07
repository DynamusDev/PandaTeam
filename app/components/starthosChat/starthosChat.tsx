import React from "react"
import { FlatList, Text, View, ViewStyle } from "react-native"
import { color } from "../../theme"
import { ChatProps } from "./starthosChat.props"

const CONTAINER: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 5,
}
const FLATLISTSTYLE: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  height: '90%',
  width: '100%',
  
  padding: 5,
}
/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function StarthosChat(props: ChatProps) {
  // grab the props
  const {
    preset,
    tx,
    name,
    background,
    style,
    textStyle,
    children,
    onEndReached,
    messagesData,
    ...rest
  } = props

  return (
    <View style={CONTAINER}>
      <FlatList
        data={ messagesData }
        style={FLATLISTSTYLE}
        showsVerticalScrollIndicator={false}
        keyExtractor={message => String(message.id)}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        renderItem={({ item: messages }) => (
          <View>
            <Text>hey</Text>
          </View>
        )}
      />
    </View>
  )
}
