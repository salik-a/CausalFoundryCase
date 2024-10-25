import { NativeModules, Platform } from "react-native"

// Import MMKV from react-native-mmkv
import { MMKV } from "react-native-mmkv"
import { ArgType } from "reactotron-core-client"

import { goBack, navigate, resetRoot } from "../navigators/navigationUtilities"
import { clear } from "../utils/storage"
import { Reactotron } from "./ReactotronClient"

// Initialize MMKV instance
const storage = new MMKV()

const reactotron = Reactotron.configure({
  name: require("../../package.json").name,
  onConnect: () => {
    /** since this file gets hot reloaded, let's clear the past logs every time we connect */
    Reactotron.clear()
  },
})

// Check if the platform is not web
if (Platform.OS !== "web") {
  // Set the storage handler to MMKV
  reactotron.setAsyncStorageHandler?.({
    getItem: (key) => storage.getString(key) || null,
    setItem: (key, value) => {
      storage.set(key, value)
      return Promise.resolve(true)
    },
    removeItem: (key) => {
      storage.delete(key)
      return Promise.resolve(true)
    },
    clear: () => {
      storage.clearAll()
      return Promise.resolve()
    },
    getAllKeys: () => Promise.resolve(storage.getAllKeys()),
  })
  reactotron.useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
}

reactotron.onCustomCommand({
  title: "Show Dev Menu",
  description: "Opens the React Native dev menu",
  command: "showDevMenu",
  handler: () => {
    Reactotron.log("Showing React Native dev menu")
    NativeModules.DevMenu.show()
  },
})

reactotron.onCustomCommand({
  title: "Reset Root Store",
  description: "Resets the MST store",
  command: "resetStore",
  handler: () => {
    Reactotron.log("resetting store")
    clear()
  },
})

reactotron.onCustomCommand({
  title: "Reset Navigation State",
  description: "Resets the navigation state",
  command: "resetNavigation",
  handler: () => {
    Reactotron.log("resetting navigation state")
    resetRoot({ index: 0, routes: [] })
  },
})

reactotron.onCustomCommand<[{ name: "route"; type: ArgType.String }]>({
  command: "navigateTo",
  handler: (args) => {
    const { route } = args ?? {}
    if (route) {
      Reactotron.log(`Navigating to: ${route}`)
      navigate(route as any)
    } else {
      Reactotron.log("Could not navigate. No route provided.")
    }
  },
  title: "Navigate To Screen",
  description: "Navigates to a screen by name.",
  args: [{ name: "route", type: ArgType.String }],
})

reactotron.onCustomCommand({
  title: "Go Back",
  description: "Goes back",
  command: "goBack",
  handler: () => {
    Reactotron.log("Going back")
    goBack()
  },
})

console.tron = reactotron

declare global {
  interface Console {
    tron: typeof reactotron
  }
}

reactotron.connect()
