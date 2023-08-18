import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {NavigationContainer,} from '@react-navigation/native'
import {createNativeStackNavigator,} from '@react-navigation/native-stack'
import firebase from '@react-native-firebase/app'
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import HomeView from './Views/HomeView'
import LoadingView from './Views/LoadingView'
import LoginView from './Views/LoginView'
import ClientView from './Views/ClientView'
import ServerView from './Views/ServerView'

const firebaseConfig = {
  apiKey: "AIzaSyBny7zuFlGUdjVokhr0SVDBjCIE6RJ76Rk",
  authDomain: "dogs-5344e.firebaseapp.com",
  databaseURL: "https://dogs-5344e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dogs-5344e",
  storageBucket: "dogs-5344e.appspot.com",
  messagingSenderId: "21242744532",
  appId: "1:21242744532:web:f875a98f44a81e607cb541",
  measurementId: "G-4GN4G7K6CC"
};

const googleSigninConfigure = () => GoogleSignin.configure({webClientId:'21242744532-tpjf2a06f38c0p4kq3c3gqvc9bntqtrj.apps.googleusercontent.com',})

firebase.initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  useEffect (() => {
    googleSigninConfigure()
  },[])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Loading' component={LoadingView}/>
        <Stack.Screen name='Login' component={LoginView}/>
        <Stack.Screen name='Home' component={HomeView}/>
        <Stack.Screen name='Client' component={ClientView}/>
        <Stack.Screen name='Server' component={ServerView}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;