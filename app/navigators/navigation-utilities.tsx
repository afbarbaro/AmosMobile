import React, { useState, useEffect, useRef } from "react"
import { BackHandler } from "react-native"
import { PartialState, NavigationState, NavigationContainerRef } from "@react-navigation/native"

export const RootNavigation = {
  navigate(_name: string) {}, // eslint-disable-line @typescript-eslint/no-empty-function
  goBack() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  resetRoot(_state?: PartialState<NavigationState> | NavigationState) {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getRootState(): NavigationState {
    return {} as NavigationState
  },
}

export const setRootNavigation = (ref: React.RefObject<NavigationContainerRef>) => {
  for (const method in RootNavigation) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    RootNavigation[method] = (...args: any) => {
      if (ref.current) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return ref.current[method](...args)
      }
    }
  }
}

/**
 * Gets the current screen from any navigation state.
 */
export function getActiveRouteName(state: NavigationState | PartialState<NavigationState>): string {
  const route = state.routes[state.index!]

  // Found the active route -- return the name
  if (!route.state) return route.name

  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state)
}

/**
 * Hook that handles Android back button presses and forwards those on to
 * the navigation or allows exiting the app.
 */
export function useBackButtonHandler(
  ref: React.RefObject<NavigationContainerRef>,
  canExit: (routeName: string) => boolean,
) {
  const canExitRef = useRef(canExit)

  useEffect(() => {
    canExitRef.current = canExit
  }, [canExit])

  useEffect(() => {
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      const navigation = ref.current

      if (navigation == null) {
        return false
      }

      // grab the current route
      const routeName = getActiveRouteName(navigation.getRootState())

      // are we allowed to exit?
      if (canExitRef.current(routeName)) {
        // let the system know we've not handled this event
        return false
      }

      // we can't exit, so let's turn this into a back action
      if (navigation.canGoBack()) {
        navigation.goBack()

        return true
      }

      return false
    }

    // Subscribe when we come to life
    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    // Unsubscribe when we're done
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [ref])
}

/**
 * Custom hook for persisting navigation state.
 */
export function useNavigationPersistence(storage: any, persistenceKey: string) {
  const [initialNavigationState, setInitialNavigationState] = useState<NavigationState>()
  const [isRestoringNavigationState, setIsRestoringNavigationState] = useState(true)

  const routeNameRef = useRef<string>()
  const onNavigationStateChange = (state: NavigationState | undefined) => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = getActiveRouteName(state!)

    if (previousRouteName !== currentRouteName) {
      // track screens.
      __DEV__ && console.tron.log?.(currentRouteName)
    }

    // Save the current route name for later comparision
    routeNameRef.current = currentRouteName

    // Persist state to storage
    storage.save(persistenceKey, state)
  }

  const restoreState = async () => {
    try {
      const state = await storage.load(persistenceKey)
      if (state) setInitialNavigationState(state)
    } finally {
      setIsRestoringNavigationState(false)
    }
  }

  useEffect(() => {
    if (isRestoringNavigationState) restoreState()
  }, [isRestoringNavigationState])

  return { onNavigationStateChange, restoreState, initialNavigationState }
}
