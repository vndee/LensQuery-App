import Colors from "./Colors";
import Spacing from "./Spacing";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  dark: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.btnColor,
    borderRadius: Spacing.M,
    paddingVertical: Spacing.buttonVerticalPadding,
    paddingHorizontal: Spacing.L,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBottom: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: Spacing.XL,
    marginHorizontal: Spacing.horizontalPadding,
    paddingHorizontal: Spacing.horizontalPadding
  },
});

export const getPressableStyle = ({ pressed }: { pressed: boolean }) => [{ opacity: pressed ? 0.4 : 1 }]