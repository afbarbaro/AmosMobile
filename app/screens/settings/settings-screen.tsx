import { observer } from "mobx-react-lite"
import React from "react"
import { View, ViewStyle } from "react-native"
import { Screen } from "../../components"
import { palette, spacing } from "../../theme"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: palette.transparent,
  paddingHorizontal: spacing[4],
}

export const SettingsScreen = observer(function SettingsScreen() {
  return (
    <View testID="SettingsScreen" style={FULL}>
      <Screen style={CONTAINER} preset="fixed">
      </Screen>
    </View>
  )
})
