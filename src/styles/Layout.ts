import Colors from "./Colors";
import Spacing from "./Spacing";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.horizontalPadding,
  }
});