import { observer } from "mobx-react-lite"
import React from "react"
import { ImageStyle, SafeAreaView, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native"
import { AutoImage as Image, Screen, Text } from "../../components"
import { palette, spacing, typography } from "../../theme"

const chartPicture = require("./chart.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: palette.darkerGrey,
  fontFamily: typography.primary,
}
const TITLE: TextStyle = {
  ...TEXT,
  fontWeight: "bold", fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}

const IMAGE: ImageStyle = {
  alignSelf: "center",
}

const CONTENT: TextStyle = {
  ...TEXT,
  color: palette.darkGrey,
  fontSize: 15,
  lineHeight: 22,
  textAlign: 'center',
  paddingHorizontal: spacing[3],
  paddingVertical: spacing[5]

}

export const WelcomeScreen = observer(function WelcomeScreen() {
  const dimensions = useWindowDimensions();

  return (
    <View testID="WelcomeScreen" style={FULL}>
      <Screen style={CONTAINER} preset="fixed">
        <SafeAreaView>
          <Text style={TITLE} text="Amos Predictor" />
          <Text style={CONTENT}>
            A forecasting tool for Stock, ETF, and Crypto prices, powered by a machine-learning algorithm using historical data.
          </Text>
          <Image source={chartPicture} resizeMode="cover" style={{
            ...IMAGE,
            width: dimensions.width,
            height: dimensions.width * (320 / 390)
          }} />
          <Text style={CONTENT}>
            Knowing the expected value trejectory and probable range of values can help you make better investment decisions and gain confidence in your portfolio allocation strategy.
          </Text>
        </SafeAreaView>
      </Screen>
    </View>
  )
})
