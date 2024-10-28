import React from "react"
import { Dimensions, Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"

import { Text } from "./Text"

interface IPost {
  body: string
  title: string
  userId: number
  testID: string
  onPress: () => void
}

const { width } = Dimensions.get("window")

export function PostCard({ body, title, userId, onPress, testID }: IPost) {
  return (
    <Pressable style={$container} onPress={onPress} testID={testID}>
      <Image source={{ uri: `https://picsum.photos/seed/${userId}/200/150` }} style={$image} />
      <View style={$content}>
        <Text style={$title}>{title}</Text>
        <Text style={$body}>{body}</Text>
      </View>
    </Pressable>
  )
}

const $container: ViewStyle = {
  backgroundColor: "#fff",
  borderRadius: 16,
  overflow: "hidden",
  marginBottom: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  marginVertical: 20,
  width: width * 0.84,
  alignSelf: "center",
}

const $image: ImageStyle = {
  width: "100%",
  height: 150,
}

const $content: ImageStyle = {
  padding: 16,
}

const $title: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 8,
  alignSelf: "center",
}

const $body: TextStyle = {
  fontSize: 14,
  color: "#555",
}
