import Colors from "./Colors";
import Spacing from "./Spacing";
import { StyleSheet } from "react-native";
import { getStatusBarHeight } from "../utils/Device";

export default StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.horizontalPadding,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: Spacing.M,
    paddingVertical: Spacing.verticalPadding,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.horizontalPadding,
    marginHorizontal: Spacing.horizontalPadding,
    marginTop: getStatusBarHeight(true) + Spacing.verticalPadding,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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