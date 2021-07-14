import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button, Header, Screen } from "../../components"
import { Chart } from "../../components/chart/Chart"
import { useStores } from "../../models"
import { SymbolSnapshot } from "../../models/symbol/symbol"
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
const BUTTON: ViewStyle = {
  marginLeft: spacing[6],
  marginRight: spacing[6],
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[3],
  backgroundColor: "lightsteelblue",
}
const BUTTON_TEXT: TextStyle = {
  fontWeight: "bold",
  fontSize: 13,
  letterSpacing: 2,
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
      <Screen style={CONTAINER} preset="scroll">
        <Header
          headerTx="chartsScreen.title"
          leftIcon="back"
          onLeftPress={goBack}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
        {chartList(symbolStore.symbols)}
      </Screen>
    </View>
  )
})

export const chartList = (symbols: SymbolSnapshot[]): React.ReactChild[] => {
  const [charts, setCharts] = useState(1)

  const components: React.ReactElement[] = [];
  for (let chart = 0; chart < charts; chart++) {
    components.push(
      <Chart key={chart} symbols={symbols}></Chart>
    )
  }

  components.push(
    <Button
      key='add-chart'
      style={BUTTON}
      textStyle={BUTTON_TEXT}
      tx="chartsScreen.addChart"
      onPress={() => setCharts(charts + 1)}
    />
  )

  return components
}