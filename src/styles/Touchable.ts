import Colors from "./Colors";
import Spacing from "./Spacing";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  dark: {
    backgroundColor: Colors.black_two,
    borderRadius: Spacing.XS,
    paddingVertical: Spacing.buttonVerticalPadding,
    paddingHorizontal: Spacing.L,
    alignItems: 'center',
    justifyContent: 'center',
  },
});