import * as React from "react"
import { View, Alert } from "react-native"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { Header } from "./header"
import { palette } from "../../theme"

declare let module: NodeModule

const VIEWSTYLE = {
  flex: 1,
  backgroundColor: palette.black,
}

storiesOf("Header", module)
  .addDecorator((fn) => <StoryScreen>{fn() as React.ReactNode}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noPad text="default" usage="The default usage">
        <View style={VIEWSTYLE}>
          <Header headerTx="welcomeScreen.continue" />
        </View>
      </UseCase>
      <UseCase noPad text="leftIcon" usage="A left nav icon">
        <View style={VIEWSTYLE}>
          <Header
            headerTx="welcomeScreen.continue"
            leftIcon="back"
            onLeftPress={() => Alert.alert("left nav")}
          />
        </View>
      </UseCase>
      <UseCase noPad text="rightIcon" usage="A right nav icon">
        <View style={VIEWSTYLE}>
          <Header
            headerTx="welcomeScreen.continue"
            rightIcon="bullet"
            onRightPress={() => Alert.alert("right nav")}
          />
        </View>
      </UseCase>
    </Story>
  ))
