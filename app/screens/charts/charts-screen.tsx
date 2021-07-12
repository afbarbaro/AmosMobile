import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Header, Screen } from "../../components"
import { Chart } from "../../components/chart/Chart"
import { useStores } from "../../models"
import { palette, spacing } from "../../theme"

const FULL: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  backgroundColor: palette.transparent,
}
const HEADER: TextStyle = {
  paddingBottom: spacing[5] - 1,
  paddingTop: spacing[3],
}
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: "bold",
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: "center",
}

export const ChartsScreen = observer(function ChartsScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  const { symbolStore } = useStores()
  useEffect(() => {
    symbolStore.getSymbols()
  }, [])

  return (
    <View testID="ChartsScreen" style={FULL}>
      <Screen style={CONTAINER} preset="fixed">
        <Header
          headerTx="chartsScreen.title"
          leftIcon="back"
          onLeftPress={goBack}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
        <Chart symbols={symbolStore.symbols}></Chart>
      </Screen>
    </View>
  )
})
