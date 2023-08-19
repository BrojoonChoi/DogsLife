import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';import {NavigationContainer,} from '@react-navigation/native'
import {createNativeStackNavigator,} from '@react-navigation/native-stack'
import {GlobalContextProvider} from './Components/GlobalContext';
import ModalNotification from './Components/ModalNotification';
import ModalOKCancel from './Components/ModalOKCancel';

import HomeView from './Views/HomeView'
import LoadingView from './Views/LoadingView'
import LoginView from './Views/LoginView'
import ClientView from './Views/ClientView'
import ServerView from './Views/ServerView'

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <GlobalContextProvider>
        <Stack.Navigator initialRouteName='Loading' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Loading' component={LoadingView}/>
          <Stack.Screen name='Login' component={LoginView}/>
          <Stack.Screen name='Home' component={HomeView}/>
          <Stack.Screen name='Client' component={ClientView}/>
          <Stack.Screen name='Server' component={ServerView}/>
        </Stack.Navigator>
        <ModalNotification />
        <ModalOKCancel />
      </GlobalContextProvider>
    </NavigationContainer>
  );
}
export default App;