import * as React from "react"
import { FC } from "react"
import { ViewStyle, KeyboardAvoidingView, Platform } from "react-native"

const ROOT: ViewStyle = { backgroundColor: "#f0f0f0", flex: 1 }

export interface StoryScreenProps {
  children?: React.ReactNode
}

const behavior = Platform.OS === "ios" ? "padding" : undefined
export const StoryScreen: FC = (props) => (
  <KeyboardAvoidingView style={ROOT} behavior={behavior} keyboardVerticalOffset={50}>
    {props.children}
  </KeyboardAvoidingView>
)
