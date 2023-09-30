import { Routes } from '../types/navigation';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

// screens
import Lens from '../screens/Lens/Lens';
import Media from '../screens/Lens/Media';
import ChatBox from '../screens/Chat/Box';
import ChatList from '../screens/Chat/List';
import ChatSearch from '../screens/Chat/Search';
import Settings from '../screens/Settings/Settings';
import Agreement from '../screens/Auth/Agreement';
import ChangePassword from '../screens/Settings/ChangePassword';
import ModelSelection from '../screens/Settings/ModelSelection';
import Paywall from '../screens/Offerings/Paywall';

import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import ResetPassword from '../screens/Auth/ResetPassword';
import OnboardingSetup from '../screens/Auth/Setup';

const Stack = createStackNavigator<Routes>();

const MainStack = (): JSX.Element => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ title: undefined }} initialRouteName="ChatList">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Agreement" component={Agreement} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="OnboardingSetup" component={OnboardingSetup} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Lens" component={Lens} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Media" component={Media} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ChatList" component={ChatList} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ChatBox" component={ChatBox} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ChatSearch" component={ChatSearch} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} options={Platform.OS === 'ios' ? { headerShown: false, ...TransitionPresets.ModalPresentationIOS } : { headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ModelSelection" component={ModelSelection} options={Platform.OS === 'ios' ? { headerShown: false, ...TransitionPresets.ModalPresentationIOS } : { headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Paywall" component={Paywall} options={Platform.OS === 'ios' ? { headerShown: false, ...TransitionPresets.ModalPresentationIOS } : { headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainStack;