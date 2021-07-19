import { observer } from "mobx-react-lite"
import React, { RefObject, useEffect, useRef, useState } from "react"
import { FlatList, View, ViewStyle } from "react-native"
import { Screen } from "../../components"
import { Chart } from "../../components/chart/Chart"
import { SwipeableRow } from "../../components/swipeable/swipeable-row"
import { useStores } from "../../models"
import { SymbolSnapshot } from "../../models/symbol/symbol"

const FULL: ViewStyle = {
  flex: 1,
}

export const ChartsScreen = observer(function ChartsScreen() {
  const { symbolStore } = useStores()
  useEffect(() => {
    symbolStore.getSymbols()
  }, [])

  const screenRef = useRef(null)

  return (
    <View testID="ChartsScreen" style={FULL}>
      <Screen preset="scroll" ref={screenRef}>
        {chartList(symbolStore.symbols, screenRef)}
      </Screen>
    </View>
  )
})

export const chartList = (
  symbols: SymbolSnapshot[],
  screenRef: RefObject<FlatList<unknown>>,
): React.ReactChild[] => {
  const [actionNumber, setActionNumber] = useState(0)
  const charts = useRef<number[]>([0])
  const scrollToEnd = useRef(false)

  const deleteChart = (atKey: number) => () => {
    const index = charts.current.findIndex((key) => key === atKey)
    charts.current.splice(index, 1)
    setActionNumber(actionNumber + 1)
  }

  const addChart = (afterKey: number) => () => {
    const index = charts.current.findIndex((key) => key === afterKey) + 1
    scrollToEnd.current = index === charts.current.length
    charts.current.splice(index, 0, actionNumber + 1)
    setActionNumber(actionNumber + 1)
  }

  const components: React.ReactElement[] = []
  const firstKey = charts.current[0]
  for (const key of charts.current) {
    const canDelete = charts.current.length > 1 || key !== firstKey
    components.push(
      <SwipeableRow
        key={key}
        leftActionIcon="add-circle"
        rightActionIcon={canDelete ? "trash-bin" : undefined}
        leftAction={addChart(Number(key))}
        rightAction={canDelete ? deleteChart(key) : undefined}
      >
        <Chart symbols={symbols}></Chart>
      </SwipeableRow>,
    )
  }

  useEffect(() => {
    if (scrollToEnd.current) {
      scrollToEnd.current = false
      screenRef.current?.scrollToEnd({ animated: false })
    }
  })

  return components
}
