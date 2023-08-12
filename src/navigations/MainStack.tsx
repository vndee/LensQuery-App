import { StatusBar } from 'react-native';
import { Routes } from '../types/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import Lens from '../screens/Lens/Lens';
import Media from '../screens/Lens/Media';
import ChatBox from '../screens/Chat/Box';
import ChatList from '../screens/Chat/List';

const Stack = createNativeStackNavigator<Routes>();

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
          <Stack.Screen name="Media" component={Media} options={{ headerShown: false }} />
          <Stack.Screen name="ChatList" component={ChatList} options={{ headerShown: false }} />
          <Stack.Screen name="ChatBox" component={ChatBox} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainStack;