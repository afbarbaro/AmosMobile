/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your MainNavigator) which the user
 * will use once logged in.
 */
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import { TextStyle } from "react-native"
import { ChartsScreen, SettingsScreen, WelcomeScreen } from "../screens"

const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: "bold",
  letterSpacing: 1,
  lineHeight: 15,
  textAlign: "center",
  padding: 0,
}

const HomeStack = createStackNavigator()
const HomeStackScreens = () => (
  <HomeStack.Navigator
    screenOptions={{
      title: "HOME",
      headerShown: true,
      headerTitleStyle: HEADER_TITLE,
    }}
  >
    <HomeStack.Screen name="Home" component={WelcomeScreen} />
  </HomeStack.Navigator>
)

const ChartsStack = createStackNavigator()
const ChartsStackScreens = () => (
  <ChartsStack.Navigator
    screenOptions={{
      title: "CHARTS",
      headerShown: true,
      headerTitleStyle: HEADER_TITLE,
    }}
  >
    <ChartsStack.Screen name="Charts" component={ChartsScreen} />
  </ChartsStack.Navigator>
)

const SettingsStack = createStackNavigator()
const SettingsStackScreens = () => (
  <SettingsStack.Navigator
    screenOptions={{
      title: "SETTINGS",
      headerShown: true,
      headerTitleStyle: HEADER_TITLE,
    }}
  >
    <SettingsStack.Screen name="Settings" component={SettingsScreen} />
  </SettingsStack.Navigator>
)

const Tab = createBottomTabNavigator()

const RootTabNavigator = () => {
  return (
    <Tab.Navigator tabBarOptions={{ showLabel: false }}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreens}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused: _focused, size }) => (
            <Ionicons name="ios-home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Charts"
        component={ChartsStackScreens}
        options={{
          tabBarLabel: "Charts",
          tabBarIcon: ({ color, focused: _focused, size }) => (
            <AntDesign name="linechart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackScreens}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, focused: _focused, size }) => (
            <Ionicons name="ios-settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export const RootNavigator = React.forwardRef<
  NavigationContainerRef,
  Partial<React.ComponentProps<typeof NavigationContainer>>
>((props, ref) => {
  return (
    <NavigationContainer {...props} ref={ref}>
      <RootTabNavigator />
    </NavigationContainer>
  )
})

RootNavigator.displayName = "RootNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["Welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
