import { ViewStyle, TextStyle } from "react-native"
import { spacing } from "../../theme"

/**
 * A list of preset names.
 */
export type ButtonPresetNames = "primary" | "link"

/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[2],
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
}

const BASE_TEXT: TextStyle = {
  paddingHorizontal: spacing[3],
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const viewPresets = {
  /**
   * A smaller piece of secondard information.
   */
  primary: { ...BASE_VIEW } as ViewStyle,

  /**
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "flex-start",
  } as ViewStyle,
} as const

export const textPresets = {
  primary: { ...BASE_TEXT, fontSize: 9 } as TextStyle,
  link: {
    ...BASE_TEXT,
    paddingHorizontal: 0,
    paddingVertical: 0,
  } as TextStyle,
} as const
