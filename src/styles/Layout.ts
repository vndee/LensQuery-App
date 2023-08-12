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
    height: getStatusBarHeight(false) + 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    paddingVertical: Spacing.verticalPadding,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.horizontalPadding,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});