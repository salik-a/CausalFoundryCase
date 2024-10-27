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
import { PostCard, Screen, Text, TextField } from "src/components"
import { translate } from "src/i18n"
import { AppStackScreenProps, navigationRef } from "src/navigators"
import { api } from "src/services/api"
import { useUserStore } from "src/store/userStore"
import { colors, spacing } from "src/theme"
import { getCurrentDate } from "src/utils/getCurrentDate"
import { saveExistingArray, saveString } from "src/utils/storage"

interface PostsScreenProps extends AppStackScreenProps<"PostsScreen"> {}

const PostsScreen: FC<PostsScreenProps> = () => {
  const user = useUserStore((state) => state.userInfo)
  const removeUserInfo = useUserStore((state) => state.removeUserInfo)

  const [skipNumber, setSkipNumber] = useState(10)
  const [posts, setPosts] = useState<any>([])
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["posts-list"], // bu key her service için özel olmalı buna göre cacheleme yapıyor
    queryFn: () => api.getListPosts(skipNumber), /// burada çalışmasını istediğimiz query fonksiyonunu belirtiyoruz
    enabled: false, //bu component yüklendiğinde direk çalış dedim
    select: (newData) => {
      return newData.posts
    },
  })

  const {
    isLoading: searchDataLoading,
    error: searchDataError,
    refetch: searchDataRefetch,
  } = useQuery({
    queryKey: ["posts-list-search"], // bu key her service için özel olmalı buna göre cacheleme yapıyor
    queryFn: () => api.getPostsSearch(searchQuery), /// burada çalışmasını istediğimiz query fonksiyonunu belirtiyoruz
    enabled: false, //bu component yüklendiğinde direk çalış dedim
    select: (newData) => {
      return newData.posts
    },
  })

  // useEffect(() => {
  //   if (data) {
  //     setPosts((ex: any) => [...ex, ...data])
  //     setIsFetchingMore(false)
  //   }
  // }, [data])

  useEffect(() => {
    refetch().then((newData: any) => {
      setPosts((ex: any) => [...ex, ...newData.data])
      setIsFetchingMore(false)
    })
  }, [skipNumber])

  useEffect(() => {
    if (searchQuery !== "") {
      searchDataRefetch().then((data) => setPosts(data.data))
    } else {
      refetch().then((newData: any) => {
        setPosts((ex: any) => [...ex, ...newData.data])
        setIsFetchingMore(false)
      })
    }
  }, [searchQuery])

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

  const renderEmpty = useCallback(() => {
    return (
      <View style={$loadingContainer}>
        <Text preset="heading">{translate("common.empty")}</Text>
      </View>
    )
  }, [])

  if (error || searchDataError) {
    return (
      <View style={$loadingContainer}>
        <Text preset="heading">{translate("common.error")}</Text>
      </View>
    )
  }

  if (isLoading || searchDataLoading) {
    return (
      <View style={$loadingContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    )
  }

  return (
    <Screen style={$container}>
      <View style={$headerContainer}>
        <View style={$headerInner}>
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
        <TextField
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text)
          }}
          placeholder="Search"
          placeholderTx="common.search"
          containerStyle={$inputContainer}
          placeholderTextColor={"#00000050"}
          inputWrapperStyle={{ height: 40 }}
        />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        onEndReached={() => {
          setSkipNumber((ex) => ex + 10)
          setIsFetchingMore(true)
        }}
        ListEmptyComponent={renderEmpty}
      />
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
  justifyContent: "center",
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  paddingTop: 30,
  backgroundColor: colors.palette.accent200,
}

const $headerInner: TextStyle = {
  width: "100%",
  alignItems: "center",
  justifyContent: "space-around",
  flexDirection: "row",
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

const $inputContainer: ViewStyle = {
  marginVertical: spacing.md,
  width: "75%",
}

export default PostsScreen
