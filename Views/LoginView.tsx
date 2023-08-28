import React, { useEffect, useState, useContext } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform, TouchableOpacity } from 'react-native';
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth'
import GlobalContext from '../Components/GlobalContext';
import Styles from '../Styles/CommonStyle';

import ImgLogo from '../Assets/Images/img_login_logo.svg'
import AppleLogo from '../Assets/Images/etc/apple_logo.svg'
import GoogleLogo from '../Assets/Images/etc/google_logo.svg'
import KakaoLogo from '../Assets/Images/etc/kakao_logo.svg'

function LoginView({navigation}: any):JSX.Element
{    
    const {storeData} = useContext(GlobalContext)

    const onAppleButtonPress = async () => {
        try 
        {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            if (!appleAuthRequestResponse.identityToken) {
                throw 'Apple Sign-In failed - no identify token returned';
            }

            const { identityToken, nonce } = appleAuthRequestResponse;
            const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

            await storeData("login", "apple");
            auth().signInWithCredential(appleCredential)
            navigation.reset({routes: [{name: 'Loading'}]});
        }
        catch(e)
        {
            console.log(e);
            Alert.alert(e + "\n에러가 발생했습니다.")
        }
    }
    
    const onGoogleButtonPress = async () => {
        try 
        {
            //await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            auth().signInWithCredential(googleCredential);
            await storeData("login", "google");
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
                <TouchableOpacity style={{...Styles.loginButton}} onPress={() => onAppleButtonPress()}>
                    <AppleLogo width={26} height={26} style={{marginRight:4}}/>
                    <Text style={Styles.loginButtonText} >Sign in with Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...Styles.loginButton}} onPress={() => onGoogleButtonPress()}>
                    <GoogleLogo width={26} height={26} style={{marginRight:6}}/>
                    <Text style={Styles.loginButtonText} >Sign in with Google</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={{...Styles.loginButtonKakao}} onPress={() => onGoogleButtonPress()}>
                    <KakaoLogo width={26} height={26} style={{marginRight:6}}/>
                    <Text style={Styles.loginButtonText} >Sign in with Kakao</Text> 
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default LoginView