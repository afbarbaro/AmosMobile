import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { VictoryChart, VictoryContainer, VictoryLine } from 'victory-native'
import { Header, Screen } from "../../components"
import { Select } from "../../components/select/Select"
import { useStores } from "../../models"
import { SymbolSnapshot } from "../../models/symbol/symbol"
import { color, spacing } from "../../theme"

const FULL: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
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
const ICON: ViewStyle = {
  paddingRight: spacing[2], paddingLeft: spacing[2]
};

const GRAPH = {
  height: 'auto',
  zIndex: -1,
} as const;

export const DemoListScreen = observer(function DemoListScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  const { symbolStore } = useStores()

  useEffect(() => { symbolStore.getSymbols() }, [])
  const [filterText, setFilterText] = React.useState('');

  const symbolItems = React.useMemo(() => {
    return symbolStore.symbols.filter(
      (item) => item.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1
    );
  }, [filterText]);

  return (
    <View testID="DemoListScreen" style={FULL}>
      <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
        <Header
          headerTx="demoListScreen.title"
          leftIcon="back"
          onLeftPress={goBack}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
        <Select
          ml={spacing[2]}
          mr={spacing[2]}
          options={symbolItems}
          onChange={setFilterText}
          onSelectedItemChange={(value) => console.info("Selected symbol ", value)}
          getOptionKey={(item: SymbolSnapshot) => item.name}
          getOptionLabel={(item: SymbolSnapshot) => item.name}
          label="Choose symbol"
          toggleIcon={(e: any) => {
            const { isOpen }: { isOpen: boolean } = e;
            return isOpen ? (
              <AntDesign name="up" size={32} style={ICON} />
            ) : (
              <AntDesign name="down" size={32} style={ICON} />
            );
          }}
        />

        <VictoryChart containerComponent={<VictoryContainer style={GRAPH} />}>
          <VictoryLine
            samples={100}
            y={(d) => Math.sin(5 * Math.PI * d.x)}
          />
          <VictoryLine
            samples={100}
            style={{ data: { stroke: "red" } }}
            y={(d) => Math.cos(5 * Math.PI * d.x)}
          />
        </VictoryChart>
      </Screen>
    </View >
  )
})
