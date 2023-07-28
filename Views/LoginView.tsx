import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image } from 'react-native';
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import Styles from '../Styles/CommonStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParam = {
    Home: undefined;
    Test: undefined;
  };

function LoginView():JSX.Element
{
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isLoadingEnd, setIsLoadingEnd] = useState(false);
    useEffect(()=> googleSigninConfigure());

    const checkLoggedIn = () =>
    {
        auth().onAuthStateChanged((user) => 
        {
            user ? setLoggedIn(true) : setLoggedIn(false)
        })
    }

    return (
        <View style={Styles.mainBody}>
            
            <View style={Styles.spacer}/>

            <View style={Styles.contentsContainer}>
                <Image source={require('../Assets/Images/img_main_logo.png')} style={Styles.imageContainer}/>
            </View>

            <View style={Styles.contentsContainer}>
                <Image source={require('../Assets/Images/img_main_logo_text.png')} style={Styles.imageContainer}/>
            </View>

            <View style={Styles.contentsContainer}>
                <GoogleSigninButton onPress={onGoogleButtonPress}/>
                <GoogleSigninButton onPress={onGoogleButtonPress}/>
                <GoogleSigninButton onPress={onGoogleButtonPress}/>
            </View>
        </View>
    );
}

const googleSigninConfigure = () => 
{
    GoogleSignin.configure({webClientId:'21242744532-12ub15j2cmahc6bau6bp7jrmp876nv55.apps.googleusercontent.com',})
}

const onGoogleButtonPress = async () => {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
}

export default LoginView