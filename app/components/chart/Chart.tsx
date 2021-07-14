import { AntDesign } from "@expo/vector-icons"
import { Flex, Spinner } from "native-base"
import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { VictoryAxis, VictoryChart, VictoryContainer, VictoryLine } from "victory-native"
import { Select } from "../../components/select/Select"
import { useStores } from "../../models"
import { SymbolSnapshot } from "../../models/symbol/symbol"
import { useAppColor, spacing } from "../../theme"

const ICON: ViewStyle = {
  paddingRight: spacing[2],
  paddingLeft: spacing[2],
}

const GRAPH = {
  height: "auto",
  zIndex: -1,
} as const

export interface ChartProps {
  symbols: SymbolSnapshot[]
  dataMaxAge?: number
}
export const Chart: FC<ChartProps> = ({ symbols, dataMaxAge = 3600 }) => {
  const { forecastStore } = useStores()
  const color = useAppColor()
  const [filterText, setFilterText] = React.useState("")
  const [selectedSymbol, setSelectedSymbol] = React.useState<string | null>()

  const symbolItems = React.useMemo(() => {
    return symbols.filter((item) => item.name.toLowerCase().startsWith(filterText.toLowerCase()))
  }, [filterText])

  const chartData = selectedSymbol
    ? forecastStore.getForecast(selectedSymbol)?.historical || []
    : []

  return (
    <>
      <Select
        autoCorrect={false}
        placeholderTextColor={color.dim}
        placeholder="Type or pull down and choose"
        ml={spacing[2]}
        mr={spacing[2]}
        options={symbolItems}
        onChange={setFilterText}
        onSelectedItemChange={(value) => {
          if (value) {
            const snapshot = forecastStore.getForecast(value)
            if (snapshot && Date.now() - snapshot.fetchedAt < dataMaxAge * 1000) {
              setSelectedSymbol(value)
            } else {
              setSelectedSymbol("")
              forecastStore.fetchForecast(value).then(() => setSelectedSymbol(value))
            }
          }
        }}
        getOptionKey={(item: SymbolSnapshot) => item.name}
        getOptionLabel={(item: SymbolSnapshot) => item.name}
        // label="Symbol"
        // labelInline={false}
        toggleIcon={(e: { isOpen: boolean }) => {
          return e.isOpen ? (
            <AntDesign name="up" size={16} color={color.dim} style={ICON} />
          ) : (
            <AntDesign name="down" size={16} color={color.dim} style={ICON} />
          )
        }}
      />

      {selectedSymbol === "" && (
        <Flex flex={1} justifyContent="center" alignItems="center" zIndex={-1}>
          <Spinner />
        </Flex>
      )}

      {selectedSymbol !== "" && (
        <VictoryChart
          padding={{ top: 10, bottom: 60, left: 70, right: 60 }}
          containerComponent={<VictoryContainer style={GRAPH} />}
        >
          <VictoryLine
            data={chartData}
            x="Timestamp"
            y="Value"
            style={{ data: { stroke: "steelblue" } }}
          />
          <VictoryAxis
            crossAxis
            style={{
              axis: { stroke: "dimgray" },
              ticks: { stroke: "dimgray", size: 5 },
              tickLabels: { fill: "dimgray" },
            }}
            tickFormat={(tick: string) => (typeof tick === "string" ? tick.substring(0, 7) : '')}
            tickCount={4}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: "dimgray" },
              ticks: { stroke: "dimgray", size: 5 },
              tickLabels: { fill: "dimgray" },
            }}
            tickFormat={chartData.length > 0 ? undefined : (tick: string) => ''}
          />
        </VictoryChart>
      )}
    </>
  )
}
