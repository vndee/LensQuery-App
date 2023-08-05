import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import Lens from '../screens/Lens/Lens';

const Stack = createStackNavigator();

const MainStack = (): JSX.Element => {
  return (
    <NavigationContainer>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />
      <Stack.Navigator>
        <Stack.Screen name="Lens" component={Lens} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;