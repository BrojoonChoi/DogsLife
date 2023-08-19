import React, { useEffect, useState, useContext } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform } from 'react-native';
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import Styles from '../Styles/CommonStyle';
import { request, PERMISSIONS } from 'react-native-permissions';
import GlobalContext from '../Components/GlobalContext';
import firebase from '@react-native-firebase/app'

import ImgBackground from '../Assets/Images/img_loading_background.svg'
import ImgLogo from '../Assets/Images/img_loading_logo.svg'

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

function LoadingView({navigation}: any):JSX.Element
{
    const {userToken, setUserToken} = useContext(GlobalContext);

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

    const sleep = async (ms:any) => {
        const wait = new Promise(resolve => setTimeout(resolve, ms));
        await wait;
    }

    firebase.auth().onAuthStateChanged(user => {
        setUserToken(user?.uid)
    })

    useEffect (() => {
        googleSigninConfigure()
        requestMediaPermissions();
        sleep(1000); 
        
        const checkAutoLogin = async () => {
            try 
            {
                await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
                const { idToken } = await GoogleSignin.signIn();
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                auth().signInWithCredential(googleCredential);
                
                navigation.reset({routes: [{name: 'Home'}]})
            }
            catch(e)
            {
                Alert.alert(e + "\n에러가 발생했습니다.")
                navigation.reset({routes: [{name: 'Login'}]})
            }
          };
      
          checkAutoLogin();
    },[])

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