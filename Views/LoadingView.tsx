import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform } from 'react-native';
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from '../Styles/CommonStyle';
import { request, PERMISSIONS } from 'react-native-permissions';

import ImgBackground from '../Assets/Images/img_loading_background.svg'
import ImgLogo from '../Assets/Images/img_loading_logo.svg'

function LoadingView({navigation}: any):JSX.Element
{
    const [user, setUser] = useState(null);

    const requestMediaPermissions = async () => {
        const isAndroid = Platform.OS === 'android';
        const isIOS = Platform.OS === 'ios';
        if (isAndroid) {
            const cameraPermissionStatus = await request(PERMISSIONS.ANDROID.CAMERA);
            const microphonePermissionStatus = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        }
        else if (isIOS) {
            const cameraPermissionStatus = await request(PERMISSIONS.IOS.CAMERA);
            const microphonePermissionStatus = await request(PERMISSIONS.IOS.MICROPHONE);
        }
    };

    useEffect (() => {
        requestMediaPermissions();
        
        const checkAutoLogin = async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            console.log("login try")
            if (userToken) {
              setUser(auth().currentUser);
            }
            else {
              console.log("login failed")
              navigation.reset({routes: [{name: 'Login'}]})
            }
          };
      
          checkAutoLogin();
    },[])

    const onAuthStateChanged = () =>
    {
      console.log("login successful")
      navigation.reset({routes: [{name: 'Home'}]})
    }

    return (
        <SafeAreaView style={Styles.mainBody}>
            <ImgBackground style={Styles.background}/>
            <View style={{alignItems:"center", top:210}}>
                <ImgLogo style={Styles.logo}/>
                <Text style={Styles.title}>강아지의 하루</Text>
            </View>
        </SafeAreaView>
    );
}

export default LoadingView