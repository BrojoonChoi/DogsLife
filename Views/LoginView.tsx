import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform, TouchableOpacity } from 'react-native';
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import Styles from '../Styles/CommonStyle';

import ImgLogo from '../Assets/Images/img_login_logo.svg'

function LoginView({navigation}: any):JSX.Element
{    
    const onAppleButtonPress = async () => {
        try 
        {
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            auth().signInWithCredential(googleCredential);
            navigation.reset({routes: [{name: 'Loading'}]})
        }
        catch(e)
        {
            Alert.alert(e + "\n에러가 발생했습니다.")
        }
    }
    
    const onGoogleButtonPress = async () => {
        try 
        {
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            auth().signInWithCredential(googleCredential);
            navigation.reset({routes: [{name: 'Loading'}]})
        }
        catch(e)
        {
            Alert.alert(e + "\n에러가 발생했습니다.")
        }
    }


    return (
        <SafeAreaView style={{backgroundColor:"#FFDFDE", ...Styles.mainBody}}>
            <View style={{top:83, flex:1}}>
                <ImgLogo style={{width:260, height:248}}/>
                <Text style={Styles.title}>강아지의 하루</Text>
            </View>

            <View style={{top:150, flex:1}}>
                <TouchableOpacity style={{...Styles.loginButton}}>
                    <Text style={Styles.loginButtonText} onPress={() => onAppleButtonPress()}>Login in with Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...Styles.loginButton}}>
                    <Text style={Styles.loginButtonText} onPress={() => onGoogleButtonPress()}>Login in with GOOGLE</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={{...Styles.loginButtonKakao}}>
                    <Text style={Styles.loginButtonText} onPress={() => onGoogleButtonPress()}>Login in with Kakao</Text> 
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default LoginView