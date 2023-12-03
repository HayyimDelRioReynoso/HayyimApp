import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import SignUP from './screens/Signup';
import Add from './screens/Add';
import HomeGoogle from './screens/HomeGoogle';


// Web: 416675925823-djitfd0vt45voeis6ofg1095eatmc4er.apps.googleusercontent.com
// iOS: 416675925823-aekvp88l5rdc2ffr2rg5be6nq95o5k1k.apps.googleusercontent.com
// Android: 416675925823-vae9sin8h0jhvklhas9ruu72jgmcc7gk.apps.googleusercontent.com

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



