import { AntDesign } from "@expo/vector-icons"
import { Button, Flex, Spinner, theme } from "native-base"
import React, { FC, memo, useCallback, useMemo, useState } from "react"
import { useWindowDimensions, View, ViewStyle } from "react-native"
import { VictoryArea, VictoryAxis, VictoryChart, VictoryContainer, VictoryLine } from "victory-native"
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
  padding: 1.5,
  variant: "ghost",
  _text: { fontSize: "xs", color: "gray.500", fontWeight: "normal" },
  _pressed: { backgroundColor: "gray.200", _text: { color: "gray.500", fontSize: "xs" } },
} as const

interface ChartData {
  historical: TimeseriesSnapshot,
  p50: TimeseriesSnapshot,
  p1090: { Timestamp: string, p10: number, p90: number }[],
  accuracy: { Timestamp: string, p10: number, p50: number, p90: number }[],
}
export interface ChartProps {
  symbols: SymbolSnapshot[]
  dataMaxAge?: number
}

const ChartInternal: FC<ChartProps> = ({ symbols, dataMaxAge = 3600 }) => {
  const { forecastStore, accuracyStore } = useStores()
  const color = useAppColor()
  const windowWidth = useWindowDimensions().width

  const [selectedSymbol, setSelectedSymbol] = React.useState<string | null>()
  const [horizon, setHorizon] = useState("6M")
  const longHorizon = horizon === "ALL" || horizon.endsWith("Y")

  const chartRawData = useMemo(() => {
    const data = selectedSymbol ? forecastStore.getForecast(selectedSymbol) : undefined;
    const accuracy = selectedSymbol ? accuracyStore.getAccuracy(selectedSymbol) : undefined;
    return {
      data,
      accuracy
    }
  }, [selectedSymbol])

  const chartData: ChartData = useMemo(() => {
    const data = chartRawData.data;
    let historical: TimeseriesSnapshot = data ? data.historical || [] : [];
    if (horizon !== "ALL") {
      const startDate = toUTCDate(horizon)
      const index = historical.findIndex((datum) => datum.Timestamp === startDate)
      historical = index >= 0 ? historical.slice(index) : historical
    }
    const filterFrequency = horizon.endsWith("Y") ? Math.min(Number(horizon[0]), 4) : horizon === "ALL" ? 5 : 1;
    if (filterFrequency > 1) historical = historical.filter((_value, index) => index % filterFrequency === 0)

    const lastHistorical = historical.length > 0 ? historical[historical.length - 1] : undefined
    const p1090: { Timestamp: string, p10: number, p90: number }[] = [];
    if (data?.predictions) {
      const p10 = data.predictions.p10 || [];
      const p90 = data.predictions.p90 || [];
      if (lastHistorical)
        p1090.push({ Timestamp: lastHistorical.Timestamp, p10: lastHistorical.Value, p90: lastHistorical.Value });

      for (let i = 0; i < p10.length; i++) {
        p1090.push({ Timestamp: p10[i].Timestamp, p10: p10[i].Value, p90: p90[i].Value });
      }
    }

    const accuracy: { Timestamp: string, p10: number, p50: number, p90: number }[] = [];
    if (chartRawData.accuracy) {
      for (const date in chartRawData.accuracy.band) {
        const values = chartRawData.accuracy.band[date] || [];
        accuracy.push({ Timestamp: date, p10: values[0], p50: values[1], p90: values[2] });
      }
    }

    return {
      historical,
      p50: lastHistorical ? [lastHistorical, ...data?.predictions?.p50 || []] : data?.predictions?.p50 || [],
      p1090,
      accuracy
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
          Promise.all([
            forecastStore.fetchForecast(value),
            accuracyStore.fetchAccuracy(value)
          ]).then(() => setSelectedSymbol(value))
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
            padding={{ top: 5, bottom: 65, left: 70, right: 50 }}
            containerComponent={<VictoryContainer style={GRAPH} />}
          >
            <VictoryLine
              data={chartData.historical}
              x="Timestamp"
              y="Value"
              style={{ data: { stroke: "steelblue" } }}
            />
            <VictoryArea
              data={chartData.accuracy}
              x="Timestamp"
              y0="p10"
              y="p90"
              style={{ data: { fill: theme.colors.lightBlue[100] } }}
            />
            <VictoryLine
              data={chartData.historical}
              x="Timestamp"
              y="Value"
              style={{ data: { stroke: "steelblue" } }}
            />
            <VictoryArea
              data={chartData.p1090}
              x="Timestamp"
              y0="p10"
              y="p90"
              style={{ data: { fill: theme.colors.blueGray[200] } }}
            />
            <VictoryLine
              data={chartData.p50}
              x="Timestamp"
              y="Value"
              style={{ data: { stroke: theme.colors.blueGray[600] } }}
            />
            <VictoryAxis
              crossAxis
              style={{
                axis: { stroke: '' },
                ticks: { stroke: "", size: 5 },
                tickLabels: { fontWeight: "lighter", fill: "dimgray" },
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
                axis: { stroke: "" },
                ticks: { stroke: "", size: 5 },
                tickLabels: { fontWeight: "lighter", fill: "dimgray" },
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
      pb={0}
      pl={spacing[2]}
      pr={spacing[2]}
      justifyContent="space-between"
    >
      <HorizonButton id="1M" active={horizon === "1M"} setActive={setHorizon} />
      <HorizonButton id="3M" active={horizon === "3M"} setActive={setHorizon} />
      <HorizonButton id="6M" active={horizon === "6M"} setActive={setHorizon} />
      <HorizonButton id="1Y" active={horizon === "1Y"} setActive={setHorizon} />
      <HorizonButton id="2Y" active={horizon === "2Y"} setActive={setHorizon} />
      <HorizonButton id="5Y" active={horizon === "5Y"} setActive={setHorizon} />
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
