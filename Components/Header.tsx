import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Styles from '../Styles/CommonStyle';

import ImgLogo from '../Assets/Images/img_home_logo_small.svg'
import SettingIcon from '../Assets/Images/img_home_setting.svg'
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';

function Header({navigation, title}:any):JSX.Element
{
    const onLogout = async () => {
        await firebase.auth().signOut();
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        console.log("sign out");
        navigation.navigate("Loading");
    }

    const onSettingClick = async () => {
        navigation.navigate("Setting");
    }

    return (
        <View style={{justifyContent:"space-between", flexDirection:"row", width:"100%", paddingTop:20, paddingBottom:20, ...Styles.leftRightPadding}}>
                    <View style={{flexDirection:"row", alignItems:"center", }}>
                        <ImgLogo width={40} height={40}/>
                        <Text style={{color:"#FF99A0", fontSize:20, fontFamily:"Cafe24Syongsyong"}}>{title}</Text>
                    </View>
                    <TouchableOpacity style={{flexDirection:"row", alignItems:"center", }} onPress={() => onSettingClick()}>
                        <SettingIcon width={40} height={40}/>
                    </TouchableOpacity>
                </View>
    );
}

export default Header