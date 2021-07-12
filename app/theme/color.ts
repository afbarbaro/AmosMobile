import { useColorMode } from "native-base"

/**
 * Roles for colors.  Prefer using these over the palette.  It makes it easier
 * to change things.
 *
 * The only roles we need to place in here are the ones that span through the app.
 *
 * If you have a specific use-case, like a spinner color.  It makes more sense to
 * put that in the <Spinner /> component.
 */
const ColorRoles = [
  /**
   * A helper for making something see-thru. Use sparingly as many layers of transparency
   * can cause older Android devices to slow down due to the excessive compositing required
   * by their under-powered GPUs.
   */
  "transparent",
  /**
   * The screen background.
   */
  "background",
  /**
   * The main tinting color.
   */
  "primary",
  /**
   * The main tinting color, but darker.
   */
  "primaryDarker",
  /**
   * A subtle color used for borders and lines.
   */
  "line",
  /**
   * The default color of text in many components.
   */
  "text",
  /**
   * Secondary information.
   */
  "dim",
  /**
   * Error messages and icons.
   */
  "error",
] as const

export type AppColor = Record<typeof ColorRoles[number], string>

export const palette = {
  black: "#1d1d1d",
  white: "#ffffff",
  offWhite: "#e6e6e6",
  orange: "#FBA928",
  orangeDarker: "#EB9918",
  grey: "#585c62",
  darkGrey: "#4a4d52",
  darkerGrey: "#1d1f21",
  lightGrey: "#939AA4",
  lighterGrey: "#CDD4DA",
  angry: "#dd3333",
  deepPurple: "#5D2555",
  transparent: "rgba(0, 0, 0, 0)",
}

export const light: AppColor = {
  transparent: palette.transparent,
  background: palette.white,
  primary: palette.lighterGrey,
  primaryDarker: palette.lightGrey,
  line: palette.lightGrey,
  text: palette.black,
  dim: palette.lightGrey,
  error: palette.angry,
}

export const dark: AppColor = {
  transparent: "rgba(0, 0, 0, 0)",
  background: palette.black,
  primary: palette.lightGrey,
  primaryDarker: palette.lighterGrey,
  line: palette.offWhite,
  text: palette.white,
  dim: palette.lightGrey,
  error: palette.angry,
}

export const useAppColor = (): AppColor => {
  const mode = useColorMode()
  return mode.colorMode === "light" ? light : dark
}
