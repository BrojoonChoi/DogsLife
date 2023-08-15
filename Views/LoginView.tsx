import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform } from 'react-native';
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import Styles from '../Styles/CommonStyle';
import { request, PERMISSIONS } from 'react-native-permissions';
import { Svg } from 'react-native-svg';
import ImgBackground from '../Assets/Images/img_main_background.svg'
import ImgLogo from '../Assets/Images/img_main_logo.svg'

function LoginView({navigation}: any):JSX.Element
{
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
    },[])

    const onAuthStateChanged = () =>
    {
        //navigation.navigate('Home', {id:1});
    }

    const ButtonPress = () =>
    {
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

const onGoogleButtonPress = async () => 
{
    try 
    {
        GoogleSignin.configure({webClientId:'21242744532-12ub15j2cmahc6bau6bp7jrmp876nv55.apps.googleusercontent.com',})
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
    }
    catch(e)
    {
        console.log(e)
    }
    
}

export default LoginView