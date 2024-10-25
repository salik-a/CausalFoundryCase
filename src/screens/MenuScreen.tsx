import React, { FC, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";



import { SelectField } from "src/components/SelectField";
import { isRTL } from "src/i18n";
import { AppStackScreenProps } from "src/navigators";
import { colors, spacing } from "src/theme"
import { useFontScaling } from "src/theme/fonting"

interface MenuScreenProps extends AppStackScreenProps<"MenuScreen"> {}

const teams = [
  { label: "Hawks", value: "ATL" },
  { label: "Celtics", value: "BOS" },
  { label: "Jazz", value: "UTA" },
  { label: "Wizards", value: "WAS" },
]

const MenuScreen: FC<MenuScreenProps> = () => {
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const fontProps = useFontScaling()

  return (
    <SafeAreaView style={styles.container}>
      <SelectField
        label="NBA Team(s)"
        helper="Select your team(s)"
        placeholder="e.g. Knicks"
        value={selectedTeam}
        onSelect={setSelectedTeam}
        options={teams}
        multiple={false}
        containerStyle={{ marginBottom: spacing.lg }}
        LabelTextProps={{ ...fontProps }}
      />

      <SelectField
        label="NBA Team(s)"
        helper="Select your team(s)"
        placeholder="e.g. Trail Blazers"
        value={selectedTeams}
        onSelect={setSelectedTeams}
        options={teams}
        containerStyle={{ marginBottom: spacing.lg }}
        renderValue={(value) => `Selected ${value.length} Teams`}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topContainer: {
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: "57%",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  bottomContainer: {
    flexShrink: 1,
    flexGrow: 0,
    flexBasis: "43%",
    backgroundColor: colors.palette.neutral100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: spacing.lg,
    justifyContent: "space-around",
  },
  welcomeLogo: {
    height: 88,
    width: "100%",
    marginBottom: spacing.xxl,
  },
  welcomeFace: {
    height: 169,
    width: 269,
    position: "absolute",
    bottom: -47,
    right: -80,
    transform: [{ scaleX: isRTL ? -1 : 1 }],
  },
  welcomeHeading: {
    marginBottom: spacing.md,
  },
})

export default MenuScreen