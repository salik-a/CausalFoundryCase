/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */

import React, { useEffect } from "react"
import { AppState, useColorScheme } from "react-native"

import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { useMutation } from "@tanstack/react-query"
import { LoginScreen, PostsScreen, PostsScreenDetail } from "src/screens"
import { api } from "src/services/api"
import { useUserStore } from "src/store/userStore"
import { colors } from "src/theme"
import { getCurrentDate } from "src/utils/getCurrentDate"
import { clearStore, load, saveExistingArray } from "src/utils/storage"

import Config from "../config"
import { useNavigatorFontScalingScreenOptions } from "../theme/fonting"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"


/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  WelcomeScreen: undefined
  MenuScreen: undefined
  Main: undefined
  CounterScreen: undefined
  LoginScreen: undefined
  PostsScreen: undefined
  PostsScreenDetail: {
    userId: number
    title: string
    body: string
  }
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()
const AppStack = () => {
  const screenOptions = useNavigatorFontScalingScreenOptions()
  const user = useUserStore((state) => state.userInfo)
  console.log(user.username)
  const { mutate: sendLogsMutate } = useMutation<any, Error, any>({
    mutationKey: ["login"],
    mutationFn: (logs) => api.sendLogs(logs),
  })

  const handleSendLogs = () => {
    const logs = load("logs")
    sendLogsMutate({
      username: user.username,
      data: logs,
    })
    console.log({
      username: user.username,
      data: logs,
    })
    clearStore()
  }
  useEffect(() => {
    saveExistingArray("logs", {
      action: "app_open",
      ts: getCurrentDate(),
    })

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background") {
        handleSendLogs()
      }
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        ...screenOptions,
      }}
      initialRouteName="LoginScreen"
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="PostsScreen" component={PostsScreen} />
      <Stack.Screen name="PostsScreenDetail" component={PostsScreenDetail} />
    </Stack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
}