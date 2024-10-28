import React, { FC, useCallback, useEffect } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageStyle,
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { useQuery } from "@tanstack/react-query"
import { Screen, Text } from "src/components"
import { translate } from "src/i18n"
import { AppStackScreenProps, navigationRef } from "src/navigators"
import { api } from "src/services/api"
import { useUserStore } from "src/store/userStore"
import { colors } from "src/theme"
import { getCurrentDate } from "src/utils/getCurrentDate"
import { saveExistingArray } from "src/utils/storage"

interface PostsScreenDetailProps extends AppStackScreenProps<"PostsScreenDetail"> {}

const PostsScreenDetail: FC<PostsScreenDetailProps> = ({ navigation, route }) => {
  const removeUserInfo = useUserStore((state) => state.removeUserInfo)
  const user = useUserStore((state) => state.userInfo)
  const { userId, title, body, testID } = route?.params
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["users-list"], // bu key her service için özel olmalı buna göre cacheleme yapıyor
    queryFn: () => api.getUser(userId), /// burada çalışmasını istediğimiz query fonksiyonunu belirtiyoruz
    enabled: true, //bu component yüklendiğinde direk çalış dedim
  })

  useEffect(() => {
    saveExistingArray("logs", {
      action: "posts_detail_screen",
      ts: getCurrentDate(),
    })
  }, [])

  const handleLogout = useCallback(() => {
    Alert.alert(translate("common.logout"), translate("common.askLogout"), [
      {
        text: translate("common.cancel"),
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: translate("common.ok"),
        onPress: () => {
          removeUserInfo()
          navigationRef.navigate("LoginScreen")
        },
      },
    ])
  }, [])

  if (error) {
    return (
      <View style={$loadingContainer}>
        <Text preset="heading">{translate("common.author")}</Text>
      </View>
    )
  }

  if (isLoading || isFetching) {
    return (
      <View style={$loadingContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    )
  }

  return (
    <Screen style={$container}>
      <View style={$headerContainer}>
        {user?.image && <Image source={{ uri: user.image }} style={$image} />}
        <View>
          <Text preset="bold" tx={"loginScreen.welcome"} style={$userName}>
            {user.firstName}
          </Text>
          <Text preset="bold" style={$userName}>
            {user.firstName}
          </Text>
        </View>
        <Pressable style={$logoutButton} onPress={handleLogout}>
          <Text tx={"postsScreen.logout"} style={$userName} />
        </Pressable>
      </View>
      <View style={$body}>
        <Text preset="heading">{translate("common.author")}</Text>
        <View style={$author}>
          <Image source={{ uri: data.image }} style={$image} />
          <Text style={$title}>
            {data.firstName}
            {data.lastName}
          </Text>
        </View>
        <Text style={$textBody}>{data.email}</Text>
        <Text style={$textBody}>{data.gender}</Text>
        <Text style={$textBody}>{data.age}</Text>
        <View style={$content}>
          <Text style={$title}>{title}</Text>
          <Image
            source={{ uri: `https://picsum.photos/seed/${userId}/200/150` }}
            style={$postImage}
            testID={`${testID}_image`}
          />

          <Text style={$textBody}>{body}</Text>
        </View>
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $loadingContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  alignItems: "center",
  justifyContent: "center",
}

const $userName: TextStyle = {
  alignSelf: "center",
}

const $headerContainer: TextStyle = {
  width: "100%",
  alignItems: "center",
  justifyContent: "space-around",
  flexDirection: "row",
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  paddingTop: 30,
  backgroundColor: colors.palette.accent200,
}

const $image: ImageStyle = {
  width: 60,
  height: 60,
  borderRadius: 10,
}

const $logoutButton: ImageStyle = {
  borderRadius: 10,
  borderWidth: 0.4,
  backgroundColor: colors.border,
  padding: 2,
  paddingHorizontal: 4,
}

const $body: ImageStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $content: ImageStyle = {
  padding: 16,
  justifyContent: "center",
  alignItems: "center",
}

const $title: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 8,
  alignSelf: "center",
}

const $textBody: TextStyle = {
  fontSize: 14,
  color: "#555",
}

const $postImage: ImageStyle = {
  width: 150,
  height: 150,
  borderRadius: 10,
}

const $author: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  width: "80%",
  justifyContent: "space-around",
}

export default PostsScreenDetail
