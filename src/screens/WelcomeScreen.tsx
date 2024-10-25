import React, { FC, useEffect } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { useMutation, useQuery } from "@tanstack/react-query"
import { Text } from "src/components"
import { isRTL } from "src/i18n"
import { AppStackScreenProps } from "src/navigators"
import { api } from "src/services/api"
import { colors, spacing } from "src/theme"
import { useSafeAreaInsetsStyle } from "src/utils/useSafeAreaInsetsStyle"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface ProductType {
  id: string
  title: string
  price: number
  description: string
  image: string
  category: string
}

interface WelcomeScreenProps extends AppStackScreenProps<"WelcomeScreen"> {}

const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["list"], // bu key her service için özel olmalı buna göre cacheleme yapıyor
    queryFn: () => api.getListProduct(), /// burada çalışmasını istediğimiz query fonksiyonunu belirtiyoruz
    enabled: true, //bu component yüklendiğinde direk çalış dedim
  })

  const {
    data: detailData,
    error: detailError,
    isLoading: detailLoading,
    isFetching: detailFetching,
    refetch: detailRefetch,
  } = useQuery({
    queryKey: ["detail"],
    queryFn: () => api.getDetailProduct("2"), // burada bir axios get isteği çalıştırıyoruz ve servisimize parametre geçiyoruz
    enabled: false, //bu component yüklendiğinde direk çalışmasın dedim ve refetch ekledim ve istediğim yerde refetchi tetikleyip çağıracağım içerisinde çağıracağım
  })

  const {
    mutate: updateProductMutate,
    data: updateProductData,
    error: updateProductError,
    // isLoading: updateProductLoading,
    isSuccess: updateProductSuccess,
  } = useMutation<
    // mutationFn'in döneceği tür
    ProductType,
    // hata tipi
    Error,
    // mutationFn'e gönderilen parametrelerin türü
    void
  >({
    mutationKey: ["product"],
    mutationFn: () =>
      api.updateProduct("3", {
        title: "test product",
        price: 13.5,
        description: "lorem ipsum set",
        image: "https://i.pravatar.cc",
        category: "electronic",
      }),
    onSuccess: (responseData) => {
      console.log("Response Data:", responseData)
    },
    onError: (error) => {
      console.log("Error Data:", error)
    },
  })

  // bu useEffect içerisindeki işlemleri bir butona bastığımızda tetikleyerekte yapabiliriz
  useEffect(() => {
    // api.setToken(
    //   "burada-cookieden-cekilen-tokeni-eklersin-ve-axiosinterceptore-kaydolur-uygulama-acikken-hep-onu-kullanir",
    // )
    // burada refetch kullanarak getDetail queryimi tetikleyebiliyorum ve burada da dataya erişebiliyorum yukarıda tanımladığım yerde de
    detailRefetch()
      .then((res) => console.log("refetchDATA", res.data))
      .catch((err) => console.log("err", err))
    // burada mutate kullanarak updateProductMutate mutateimi tetikleyebiliyorum
    // burada dataya erişemiyorum ama yukarıda tanımladığım onSucces kısmında erişebiliyorum
    updateProductMutate()
  }, [detailRefetch, updateProductMutate])

  if (isFetching) {
    return (
      <View>
        <Text>Loading ...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View>
        <Text>Error</Text>
      </View>
    )
  }

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          tx="welcomeScreen.readyForLaunch"
          preset="heading"
        />
        <Text tx="welcomeScreen.exciting" preset="subheading" />
        <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
      </View>
      <View style={[$bottomContainer, $bottomContainerInsets]}>
        <Text tx="welcomeScreen.postscript" size="md" />
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}
const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
}

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.md,
}

export default WelcomeScreen
