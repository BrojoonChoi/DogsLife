import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import LoginView from './Views/LoginView'
import HomeView from './Views/HomeView'
import ClientView from './Views/ClientView'
import ServerView from './Views/ServerView'
import {NavigationContainer,} from '@react-navigation/native'
import {createNativeStackNavigator,} from '@react-navigation/native-stack'
import firebase from '@react-native-firebase/app'

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

firebase.initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={LoginView}/>
        <Stack.Screen name='Home' component={HomeView}/>
        <Stack.Screen name='Client' component={ClientView}/>
        <Stack.Screen name='Server' component={ServerView}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

/*

    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          
      <LoginView />
        <View</View>
          </ScrollView>
        </SafeAreaView>
*/