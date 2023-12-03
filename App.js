import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import SignUP from './screens/Signup';
import Add from './screens/Add';
import HomeGoogle from './screens/HomeGoogle';



WebBrowser.maybeCompleteAuthSession();


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Registro' component={SignUP} options={{presentation: 'modal'}}/>
        <Stack.Screen name='Add' component={Add} options={{presentation: 'modal'}}/>
        <Stack.Screen name='HomeGoogle' component={HomeGoogle} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}



