import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import Lens from '../screens/Lens/Lens';

const Stack = createNativeStackNavigator();

const MainStack = (): JSX.Element => {
  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ title: undefined }} initialRouteName="Lens">
          <Stack.Screen name="Lens" component={Lens} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainStack;