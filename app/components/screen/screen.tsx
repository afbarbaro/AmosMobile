import * as React from "react"
import { forwardRef } from "react"
import { FlatList, KeyboardAvoidingView, Platform, ScrollViewProps, StatusBar, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppColor } from "../../theme"
import { isNonScrolling, offsets, presets } from "./screen.presets"
import { ScreenProps } from "./screen.props"


const isIos = Platform.OS === "ios"

const ScreenWithoutScrolling = forwardRef<KeyboardAvoidingView, ScreenProps>((props, ref) => {
  const color = useAppColor()
  const insets = useSafeAreaInsets()
  const preset = presets.fixed
  const style = props.style || {}
  const backgroundStyle = { backgroundColor: props.backgroundColor ?? color.background }
  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

  return (
    <KeyboardAvoidingView
      ref={ref}
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? "padding" : undefined}
      keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
    >
      <StatusBar barStyle={props.statusBar || "light-content"} />
      <View style={[preset.inner, style, insetStyle]}>{props.children}</View>
    </KeyboardAvoidingView>
  )
})

const ScreenWithScrolling = forwardRef<ScrollView, ScreenProps>((props, ref) => {
  const color = useAppColor()
  const insets = useSafeAreaInsets()
  const preset = presets.scroll
  const style = props.style || {}
  const backgroundStyle = { backgroundColor: props.backgroundColor ?? color.background }
  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? "padding" : undefined}
      keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
    >
      <StatusBar barStyle={props.statusBar || "light-content"} />
      <View style={[preset.outer, backgroundStyle, insetStyle]}>
        <ScrollView
          ref={ref}
          style={[preset.outer, backgroundStyle]}
          contentContainerStyle={[preset.inner, style]}
          keyboardShouldPersistTaps={props.keyboardShouldPersistTaps || "handled"}
        >
          {props.children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
})

const ScreenWithVirtualization = forwardRef<FlatList, ScreenProps>((props, ref) => {
  const color = useAppColor()
  const insets = useSafeAreaInsets()
  const preset = presets.scroll
  const style = props.style || {}
  const backgroundStyle = { backgroundColor: props.backgroundColor ?? color.background }
  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? "padding" : undefined}
      keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
    >
      <StatusBar barStyle={props.statusBar || "light-content"} />
      <View style={[preset.outer, backgroundStyle, insetStyle]}>
        <VirtualizedView
          ref={ref}
          style={[preset.outer, backgroundStyle]}
          contentContainerStyle={[preset.inner, style]}
          keyboardShouldPersistTaps={props.keyboardShouldPersistTaps || "handled"}
        >
          {props.children}
        </VirtualizedView>
      </View>
    </KeyboardAvoidingView>
  )
})

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export const Screen = forwardRef<KeyboardAvoidingView | ScrollView | FlatList, ScreenProps>((props, ref) => {
  if (props.preset === 'virtualized') {
    return <ScreenWithVirtualization {...props} ref={ref as React.ForwardedRef<FlatList>} />
  } else if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} ref={ref as React.ForwardedRef<KeyboardAvoidingView>} />
  } else {
    return <ScreenWithScrolling {...props} ref={ref as React.ForwardedRef<ScrollView>} />
  }
})

const dummy = [{ key: '0' }];
const VirtualizedView = forwardRef<FlatList, ScrollViewProps>((props, ref) => {
  return (
    <FlatList
      {...props}
      ref={ref}
      nestedScrollEnabled={true}
      data={dummy}
      // ListEmptyComponent={null}
      // keyExtractor={() => "dummy"}
      renderItem={undefined}
      ListHeaderComponent={<>{props.children}</>}
    />
  )
})