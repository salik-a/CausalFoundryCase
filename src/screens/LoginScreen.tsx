import React, { FC } from "react"
import { Alert, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { Button, Screen, Text, TextField } from "src/components"
import { AppStackScreenProps, navigationRef } from "src/navigators"
import { api } from "src/services/api"
import { useUserStore } from "src/store/userStore"
import { colors, spacing } from "src/theme"
import * as yup from "yup"

const welcomeLogo = require("../../assets/images/logo.png")

interface IFormData {
  userName: string
  password: string
}

interface LoginScreenProps extends AppStackScreenProps<"LoginScreen"> {}

const LoginScreen: FC<LoginScreenProps> = () => {
  const setUserInfo = useUserStore((state) => state.setUserInfo)
  const { mutate: loginMutate } = useMutation<any, Error, IFormData>({
    mutationKey: ["login"],
    mutationFn: (formData: IFormData) => api.login(formData.userName, formData.password),
    onSuccess: (responseData) => {
      if (responseData.accessToken) {
        setUserInfo(responseData)
        navigationRef.navigate("PostsScreen")
      }
    },
    onError: (error) => {
      Alert.alert(`${error.message}`)
    },
  })

  const schema = yup.object().shape({
    userName: yup
      .string()
      .required("Username is required")
      .min(3, "Username must contain at least 3 characters"),
    password: yup
      .string()
      .required("Password is required")
      .min(3, "Password must contain at least 3 characters"),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userName: "",
      password: "",
    },
  })

  const onPressSend = (formData: IFormData) => {
    loginMutate(formData)
    // Perform actions with the validated form data
  }

  return (
    <Screen style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          tx="loginScreen.login"
          preset="heading"
        />
      </View>
      <View style={$bottomContainer}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value}
              onChangeText={onChange}
              label="UserName"
              labelTx="loginScreen.userName"
              labelTxOptions={{ userName: "emilys" }}
              LabelTextProps={{ style: { color: "#000", fontSize: 20 } }}
              placeholder="emilys"
              placeholderTx="loginScreen.namePlaceholder"
              placeholderTxOptions={{ userName: "emilys" }}
              placeholderTextColor={"#00000050"}
              inputWrapperStyle={{ height: 50 }}
              status={undefined}
              containerStyle={$inputContainer}
            />
          )}
          name="userName"
        />
        {errors.userName && (
          <Text testID="userName-error" style={$errorText} tx="loginScreen.userNameError" />
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value}
              onChangeText={onChange}
              label="Password"
              labelTx="loginScreen.password"
              labelTxOptions={{ password: "emilyspass" }}
              LabelTextProps={{ style: { color: "#000", fontSize: 20 } }}
              placeholder="emilys"
              placeholderTx="loginScreen.passwordPlaceholder"
              placeholderTxOptions={{ password: "emilyspass" }}
              placeholderTextColor={"#00000050"}
              inputWrapperStyle={{ height: 50 }}
              status={undefined}
              containerStyle={$inputContainer}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text testID="password-error" style={$errorText} tx="loginScreen.passwordError" />
        )}
      </View>
      <Button
        text="Login"
        tx="loginScreen.login"
        preset="default"
        onPress={handleSubmit(onPressSend)}
        textStyle={{ fontSize: 20 }}
        style={$button}
        pressedStyle={$buttonpressed}
      />
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $inputContainer: ViewStyle = {
  marginTop: spacing.lg,
}

const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.md,
}

const $errorText: TextStyle = {
  color: colors.error,
}

const $button: ViewStyle = {
  backgroundColor: colors.palette.primary400,
  width: 300,
  alignSelf: "center",
  marginTop: spacing.xxl,
}

const $buttonpressed: ViewStyle = {
  backgroundColor: colors.palette.primary100,
}

export default LoginScreen
