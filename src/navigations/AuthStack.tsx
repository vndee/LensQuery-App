import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Routes } from '../types/navigation';
// screens
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import Agreement from '../screens/Auth/Agreement';
import OnboardingSetup from '../screens/Auth/Setup';

const Stack = createStackNavigator<Routes>();

const AuthStack = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
        <Stack.Screen name="Agreement" component={Agreement} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
        <Stack.Screen name="OnboardingSetup" component={OnboardingSetup} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;