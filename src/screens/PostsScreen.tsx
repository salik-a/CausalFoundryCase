import React, { FC, useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageStyle,
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { useQuery } from "@tanstack/react-query"
import { PostCard, Screen, Text } from "src/components"
import { translate } from "src/i18n"
import { AppStackScreenProps, navigationRef } from "src/navigators"
import { api } from "src/services/api"
import { useUserStore } from "src/store/userStore"
import { colors } from "src/theme"
import { getCurrentDate } from "src/utils/getCurrentDate"
import { saveExistingArray, saveString } from "src/utils/storage"

interface PostsScreenProps extends AppStackScreenProps<"PostsScreen"> {}

const PostsScreen: FC<PostsScreenProps> = () => {
  const user = useUserStore((state) => state.userInfo)
  const removeUserInfo = useUserStore((state) => state.removeUserInfo)

  const [skipNumber, setSkipNumber] = useState(10)
  const [posts, setPosts] = useState<any>([])
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["posts-list"], // bu key her service için özel olmalı buna göre cacheleme yapıyor
    queryFn: () => api.getListPosts(skipNumber), /// burada çalışmasını istediğimiz query fonksiyonunu belirtiyoruz
    enabled: false, //bu component yüklendiğinde direk çalış dedim
    select: (newData) => {
      return newData.posts
    },
  })

  useEffect(() => {
    if (data) {
      setPosts((ex: any) => [...ex, ...data])
      setIsFetchingMore(false)
    }
  }, [data])

  useEffect(() => {
    refetch()
  }, [skipNumber])

  useEffect(() => {
    saveExistingArray("logs", {
      action: "posts_screen",
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

  const renderPost = useCallback(({ item }: any) => {
    return (
      <PostCard
        onPress={() => navigationRef.navigate("PostsScreenDetail", item)}
        body={item.body}
        title={item.title}
        userId={item.userId}
      />
    )
  }, [])

  if (error) {
    return (
      <View style={$loadingContainer}>
        <Text preset="heading">{translate("common.error")}</Text>
      </View>
    )
  }

  if (posts.length === 0) {
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
          <Text preset="bold" tx={"loginScreen.welcome"} style={$userName} />
          <Text preset="bold" style={$userName}>
            {user.firstName}
          </Text>
        </View>
        <Pressable style={$logoutButton} onPress={handleLogout}>
          <Text tx={"postsScreen.logout"} style={$userName} />
        </Pressable>
      </View>
      {posts.length > 0 && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          onEndReached={() => {
            setSkipNumber((ex) => ex + 10)
            setIsFetchingMore(true)
          }}
        />
      )}
      {isFetchingMore ? (
        <View style={$fetching}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : null}
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

const $fetching: ImageStyle = {
  position: "absolute",
  bottom: 0,
  zIndex: 100,
}

export default PostsScreen
