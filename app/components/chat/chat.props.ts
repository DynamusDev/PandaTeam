import { TextStyle, TouchableOpacityProps, ViewStyle } from "react-native"
import { ChatPresetNames } from "./chat.presets"

export interface ChatProps extends TouchableOpacityProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  showUser?: boolean

  onSendPress?: object

  /**
   * The text to display if not using `tx` or nested components.
   */
  messages?: any[]

  msgbkgcolor?: "#002A4E" | "#0056A7"

  position?: "flex-start" | "flex-end"

  onEndReached?: void | any[]

  icon?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle | ViewStyle[]

  background?: ViewStyle | ViewStyle[] | string

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: TextStyle | TextStyle[]

  /**
   * One of the different types of text presets.
   */
  preset?: ChatPresetNames

  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode
}
