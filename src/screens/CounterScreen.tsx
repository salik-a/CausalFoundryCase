import React, { FC } from "react";
import { StyleSheet, View } from "react-native";



import { Button, Screen, Text } from "src/components"
import { AppStackScreenProps } from "src/navigators"
import { useCounterStore } from "src/store/countStore"
import { useShallow } from "zustand/react/shallow"

interface CounterScreenProps extends AppStackScreenProps<"CounterScreen"> {}

const CounterScreen: FC<CounterScreenProps> = () => {
  // const count = useCounterStore((state) => state.count)
  // const increaseCounter = useCounterStore((state) => state.increaseCounter)
  // const decreaseCounter = useCounterStore((state) => state.decreaseCounter)
  // const increaseCounterByNumber = useCounterStore((state) => state.increaseCounterByNumber)
  // const decreaseCounterByNumber = useCounterStore((state) => state.decreaseCounterByNumber)

  // const {
  //   count,
  //   increaseCounter,
  //   decreaseCounter,
  //   increaseCounterByNumber,
  //   decreaseCounterByNumber,
  // } = useCounterStore(
  //   useShallow((state) => ({
  //     count: state.count,
  //     increaseCounter: state.increaseCounter,
  //     decreaseCounter: state.decreaseCounter,
  //     increaseCounterByNumber: state.increaseCounterByNumber,
  //     decreaseCounterByNumber: state.decreaseCounterByNumber,
  //   })),
  // )

  const [
    count,
    increaseCounter,
    decreaseCounter,
    increaseCounterByNumber,
    decreaseCounterByNumber,
  ] = useCounterStore(
    useShallow((state) => [
      state.count,
      state.increaseCounter,
      state.decreaseCounter,
      state.increaseCounterByNumber,
      state.decreaseCounterByNumber,
    ]),
  )

  return (
    <Screen style={styles.container} preset="scroll">
      <Text style={styles.title} text="Counter Screen" />
      <View style={styles.counterContainer}>
        <Text style={styles.countText}>{count}</Text>
        <View style={styles.buttons}>
          <Button onPress={() => increaseCounterByNumber(5)} text="5 Arttır" />
          <Button onPress={increaseCounter} text="Arttır" />
          <Button onPress={decreaseCounter} text="Azalt" />
          <Button onPress={() => decreaseCounterByNumber(5)} text="5 Azalt" />
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
  },
  title: {
    alignSelf: "center",
  },
  counterContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    marginVertical: 10,
    fontSize: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
  },
  animationStyle: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
})

export default CounterScreen