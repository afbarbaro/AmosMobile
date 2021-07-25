import { AntDesign } from "@expo/vector-icons"
import { Button, Flex, Spinner, theme } from "native-base"
import React, { FC, memo, useCallback, useMemo, useState } from "react"
import { useWindowDimensions, View, ViewStyle } from "react-native"
import { VictoryAxis, VictoryChart, VictoryContainer, VictoryLine } from "victory-native"
import { Select } from "../../components/select/Select"
import { useStores } from "../../models"
import { TimeseriesSnapshot } from "../../models/forecast/forecast"
import { SymbolSnapshot } from "../../models/symbol/symbol"
import { palette, spacing, useAppColor } from "../../theme"

const VIEW: ViewStyle = {
  backgroundColor: palette.white,
}

const ICON: ViewStyle = {
  paddingRight: spacing[2],
  paddingLeft: spacing[2],
}

const GRAPH = {
  zIndex: -1,
} as const

const TIME_HORIZON = {
  padding: 1,
  variant: "ghost",
  _text: { fontSize: "xs", color: "gray.400", fontWeight: "normal" },
  _pressed: { backgroundColor: "gray.200", _text: { color: "gray.500", fontSize: "xs" } },
} as const

interface ChartData {
  historical: TimeseriesSnapshot,
  p10: TimeseriesSnapshot,
  p50: TimeseriesSnapshot,
  p90: TimeseriesSnapshot,
}
export interface ChartProps {
  symbols: SymbolSnapshot[]
  dataMaxAge?: number
}

const ChartInternal: FC<ChartProps> = ({ symbols, dataMaxAge = 3600 }) => {
  const { forecastStore } = useStores()
  const color = useAppColor()
  const windowWidth = useWindowDimensions().width

  const [selectedSymbol, setSelectedSymbol] = React.useState<string | null>()
  const [horizon, setHorizon] = useState("3M")
  const longHorizon = horizon === "ALL" || horizon.endsWith("Y")

  const chartData: ChartData = useMemo(() => {
    const data = selectedSymbol ? forecastStore.getForecast(selectedSymbol) : undefined;
    let historical: TimeseriesSnapshot = data ? data.historical || [] : [];
    if (horizon !== "ALL") {
      const startDate = toUTCDate(horizon)
      const index = historical.findIndex((datum) => datum.Timestamp === startDate)
      historical = index >= 0 ? historical.slice(index) : historical
    }
    const lastHistorical = historical.length > 0 ? historical[historical.length - 1] : undefined
    return {
      historical,
      p10: lastHistorical ? [lastHistorical, ...data?.predictions?.p10 || []] : data?.predictions?.p10 || [],
      p50: lastHistorical ? [lastHistorical, ...data?.predictions?.p50 || []] : data?.predictions?.p50 || [],
      p90: lastHistorical ? [lastHistorical, ...data?.predictions?.p90 || []] : data?.predictions?.p90 || [],
    }
  }, [selectedSymbol, horizon])

  const onSelectedItemChange = useCallback(
    (value: string) => {
      if (value) {
        const snapshot = forecastStore.getForecast(value)
        if (snapshot && Date.now() - snapshot.fetchedAt < dataMaxAge * 1000) {
          setSelectedSymbol(value)
        } else {
          setSelectedSymbol("")
          forecastStore.fetchForecast(value).then(() => setSelectedSymbol(value))
        }
      }
    },
    [forecastStore, setSelectedSymbol],
  )

  const getOption = useCallback((item: SymbolSnapshot) => item.name, [])

  const toggleIcon = useCallback(
    (e: { isOpen: boolean }) => {
      return e.isOpen ? (
        <AntDesign name="up" size={16} color={color.dim} style={ICON} />
      ) : (
        <AntDesign name="down" size={16} color={color.dim} style={ICON} />
      )
    },
    [color],
  )

  return (
    <View style={VIEW}>
      <Select
        autoCorrect={false}
        placeholderTextColor={color.dim}
        placeholder="Type or pull down and choose"
        ml={spacing[2]}
        mr={spacing[2]}
        options={symbols}
        onSelectedItemChange={onSelectedItemChange}
        getOptionKey={getOption}
        getOptionLabel={getOption}
        // label="Symbol"
        // labelInline={false}
        toggleIcon={toggleIcon}
      />

      {selectedSymbol === "" && (
        <Flex flex={1} justifyContent="center" alignItems="center" zIndex={-1}>
          <Spinner />
        </Flex>
      )}

      {selectedSymbol !== "" && (
        <>
          <HorizonChooser horizon={horizon} setHorizon={setHorizon} />
          <VictoryChart
            height={Math.ceil((windowWidth * 2) / 3)}
            padding={{ top: 10, bottom: 65, left: 70, right: 50 }}
            containerComponent={<VictoryContainer style={GRAPH} />}
          >
            <VictoryLine
              data={chartData.historical}
              x="Timestamp"
              y="Value"
              style={{ data: { stroke: "steelblue" } }}
            />
            <VictoryLine
              data={chartData.p50}
              x="Timestamp"
              y="Value"
              style={{ data: { stroke: theme.colors.rose[700] } }}
            />
            <VictoryLine
              data={chartData.p10}
              x="Timestamp"
              y="Value"
              style={{ data: { stroke: theme.colors.rose[200] } }}
            />
            <VictoryLine
              data={chartData.p90}
              x="Timestamp"
              y="Value"
              style={{ data: { stroke: theme.colors.rose[200] } }}
            />
            <VictoryAxis
              crossAxis
              style={{
                axis: { stroke: "dimgray" },
                ticks: { stroke: "dimgray", size: 5 },
                tickLabels: { fill: "dimgray" },
              }}
              tickFormat={(tick: string) =>
                typeof tick === "string"
                  ? tick.substring(longHorizon ? 0 : 6, longHorizon ? 7 : 10)
                  : ""
              }
              tickCount={4}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: "dimgray" },
                ticks: { stroke: "dimgray", size: 5 },
                tickLabels: { fill: "dimgray" },
              }}
              tickFormat={chartData.historical.length > 0 ? undefined : (_tick: string) => ""}
            />
          </VictoryChart>
        </>
      )}
    </View>
  )
}

type HorizonChooserProps = {
  horizon: string
  setHorizon: (id: string) => void
}

const HorizonChooser: FC<HorizonChooserProps> = ({ horizon, setHorizon }) => {
  return (
    <Button.Group
      zIndex={-1}
      pt={1}
      pb={1}
      pl={spacing[2]}
      pr={spacing[2]}
      justifyContent="space-between"
    >
      <HorizonButton id="1W" active={horizon === "1W"} setActive={setHorizon} />
      <HorizonButton id="1M" active={horizon === "1M"} setActive={setHorizon} />
      <HorizonButton id="3M" active={horizon === "3M"} setActive={setHorizon} />
      <HorizonButton id="6M" active={horizon === "6M"} setActive={setHorizon} />
      <HorizonButton id="1Y" active={horizon === "1Y"} setActive={setHorizon} />
      <HorizonButton id="2Y" active={horizon === "2Y"} setActive={setHorizon} />
      <HorizonButton id="10Y" active={horizon === "10Y"} setActive={setHorizon} />
      <HorizonButton id="ALL" active={horizon === "ALL"} setActive={setHorizon} />
    </Button.Group>
  )
}

type HorizonButtonProps = {
  id: string
  active: boolean
  setActive: (id: string) => void
}

const HorizonButton: FC<HorizonButtonProps> = memo(({ id, active, setActive }) => {
  const pressedStyle = active ? TIME_HORIZON._pressed : {}
  const onPress = () => {
    if (!active) setActive(id)
  }
  return (
    <Button key={id} {...TIME_HORIZON} {...pressedStyle} onPress={onPress}>
      {id}
    </Button>
  )
})

export const Chart = memo(ChartInternal)

const toUTCDate = (horizon: string) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)

  const n = Number(horizon.substring(0, horizon.length - 1))
  switch (horizon[horizon.length - 1]) {
    case "D": {
      d.setMonth(d.getMonth() - n)
      break
    }
    case "W": {
      d.setDate(d.getDate() - n * 7)
      break
    }
    case "M": {
      d.setMonth(d.getMonth() - n)
      break
    }
    case "Y": {
      d.setFullYear(d.getFullYear() - n)
      break
    }
    default:
      break
  }

  return d.toISOString().substring(0, 10)
}
