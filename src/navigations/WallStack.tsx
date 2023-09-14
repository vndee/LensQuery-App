import { StatusBar } from 'react-native';
import { Routes } from '../types/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Paywall from '../screens/Offerings/Paywall';

const Stack = createStackNavigator<Routes>();

const WallStack = (): JSX.Element => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Paywall'>
          <Stack.Screen name="Paywall" component={Paywall} options={{ headerShown: false, ...TransitionPresets.ModalPresentationIOS }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default WallStack;