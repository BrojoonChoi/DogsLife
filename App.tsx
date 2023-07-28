import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import HomeView from './Views/HomeView'
import LoginView from './Views/LoginView'
import {NavigationContainer,} from '@react-navigation/native'
import {createNativeStackNavigator,} from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();

function App(): JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={HomeView}/>
        <Stack.Screen name='Login' component={LoginView}/>
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