import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform } from 'react-native';
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import Styles from '../Styles/CommonStyle';
import { request, PERMISSIONS } from 'react-native-permissions';

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
            
            <View style={Styles.spacer}/>

            <View style={Styles.contentsContainer}>
                <Image source={require('../Assets/Images/img_main_logo.png')} style={Styles.imageContainer}/>
            </View>

            <View style={Styles.contentsContainer}>
                <Image source={require('../Assets/Images/img_main_logo_text.png')} style={Styles.imageContainer}/>
            </View>

            <View style={Styles.contentsContainer}>
                <Button title='Home' onPress={() => ButtonPress()} />
                <Button title='Client' onPress={() => navigation.reset({routes: [{name: 'Client'}]})} />
                <Button title='Server' onPress={() => navigation.reset({routes: [{name: 'Server'}]})} />
                <GoogleSigninButton onPress={() => onGoogleButtonPress()}/>
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