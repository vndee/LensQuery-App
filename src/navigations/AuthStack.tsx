import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '../types/navigation';
// screens
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import OnboardingSetup from '../screens/Auth/Setup';

const Stack = createNativeStackNavigator<Routes>();

const AuthStack = (): JSX.Element => {
  return (
    <NavigationContainer>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingSetup" component={OnboardingSetup} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;