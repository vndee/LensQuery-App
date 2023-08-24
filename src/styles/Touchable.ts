import Colors from "./Colors";
import Spacing from "./Spacing";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  dark: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.btnColor,
    borderRadius: Spacing.XS,
    paddingVertical: Spacing.buttonVerticalPadding,
    paddingHorizontal: Spacing.L,
    alignItems: 'center',
    justifyContent: 'center',
  },
});