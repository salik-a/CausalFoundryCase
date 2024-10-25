import React from "react"
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "src/components"
import { translate } from "src/i18n"
import { CounterScreen, MenuScreen, WelcomeScreen } from "src/screens"
import { colors, spacing, typography } from "src/theme"
import { useTabNavigatorFontScalingScreenOptions } from "src/theme/fonting"

import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type TabBarParamList = {
  WelcomeScreen: undefined
  MenuScreen: undefined
  CounterScreen: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type TabBarScreenProps<T extends keyof TabBarParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabBarParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.customTabBarContainer}>
      {state.routes.map(
        (
          route: { key: string | number; name: any; params: any },
          index: { toString: () => React.Key | null | undefined },
        ) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name

          const isFocused = state.index === index
          const TabIcon = options.tabBarIcon

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            })
          }

          if (route.name === "MenuScreen") {
            // return (
            //   <View
            //     style={{
            //       flex: 1,
            //       justifyContent: "center",
            //       alignItems: "center",
            //     }}
            //     key={index.toString()}
            //   >
            //     <Icon
            //       icon="ladybug"
            //       size={80}
            //       style={{ top: -50, position: "absolute", alignSelf: "center" }}
            //     />
            //   </View>
            // )
          }

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              key={index.toString()}
            >
              <TabIcon focused={isFocused} />
              <Text style={[styles.tabBarLabel, { color: isFocused ? colors.text : "#222" }]}>
                {label}
              </Text>
            </TouchableOpacity>
          )
        },
      )}
    </View>
  )
}

const Tab = createBottomTabNavigator<TabBarParamList>()

/**
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `TabBarNavigator`.
 */
export function TabBarNavigator() {
  const { bottom } = useSafeAreaInsets()
  const screenOptions = useTabNavigatorFontScalingScreenOptions()
  return (
    <Tab.Navigator
      initialRouteName="WelcomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [styles.tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
        ...screenOptions,
      }}
      //   tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="CounterScreen"
        component={CounterScreen}
        options={{
          tabBarLabel: translate("tabBarNavigator.counter"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="lock" color={focused ? colors.black : colors.border} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          tabBarLabel: translate("tabBarNavigator.welcome"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="check" color={focused ? colors.black : colors.border} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          tabBarLabel: translate("tabBarNavigator.menu"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="menu" color={focused ? colors.black : colors.border} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  customTabBarContainer: {
    flexDirection: "row",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    backgroundColor: "white",
    elevation: 7,
    justifyContent: "center",
    paddingVertical: 10,
  },
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.transparent,
  },
  tabBarItem: {
    paddingTop: spacing.md,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: typography.primary.medium,
    lineHeight: 16,
  },
})

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
