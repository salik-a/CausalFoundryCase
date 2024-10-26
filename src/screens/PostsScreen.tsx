import React, { FC } from "react"
import { ViewStyle } from "react-native"

import { Screen } from "src/components"
import { AppStackScreenProps } from "src/navigators"
import { api } from "src/services/api"
import { colors } from "src/theme"

interface PostsScreenProps extends AppStackScreenProps<"PostsScreen"> {}

const PostsScreen: FC<PostsScreenProps> = () => {
  return <Screen style={$container}></Screen>
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

export default PostsScreen
