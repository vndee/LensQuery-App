import Colors from "./Colors";
import Spacing from "./Spacing";
import { StyleSheet } from "react-native";
import { getStatusBarHeight } from "../utils/Device";

export default StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.horizontalPadding,
  },
  header: {
    height: getStatusBarHeight(false) + 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    alignContent: 'center',
    paddingVertical: Spacing.verticalPadding,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.horizontalPadding,
  },
});