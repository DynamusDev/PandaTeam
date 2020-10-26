import React from "react"
import { TouchableOpacity, ActivityIndicator } from "react-native"
import { Text } from "../text/text"
import { viewPresets, textPresets } from "./commonButton.presets"
import { ButtonProps } from "./commonButton.props"
import { mergeAll, flatten } from "ramda"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function CommonButton(props: ButtonProps) {
  // grab the props
  const {
    preset,
    tx,
    name,
    background,
    loading,
    disabled,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    ...rest
  } = props

  const viewStyle = mergeAll(flatten([viewPresets[preset] || viewPresets.primary, styleOverride]))
  const textStyle = mergeAll(
    flatten([textPresets[preset] || textPresets.primary, textStyleOverride]),
  )

  return (
    <TouchableOpacity disabled={loading ? true : false} style={{ ...viewStyle, backgroundColor: background }} {...rest}>
      
      {loading ?
        <ActivityIndicator color='#FFF'/> : name && <Text tx={tx} text={name} style={textStyle} />
      }
    </TouchableOpacity>
  )
}
