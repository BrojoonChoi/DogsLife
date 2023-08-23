import React, { useEffect, useState, useContext, useMemo } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';
import Footer from '../Components/Footer'
import CameraList from '../Components/CameraList';
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';

import ImgLogo from '../Assets/Images/img_home_logo_small.svg'
import SettingIcon from '../Assets/Images/img_home_setting.svg'

function SettingView({navigation}:any):JSX.Element
{
    useEffect (() =>
    {
    }, [])

    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            {/* margin is footer height + 21(padding) */}
            <ScrollView style={{marginBottom:79, width:"100%"}}>
                {/*Header*/}
                <Header navigation={navigation} title="설정"/>

                {/* main body */}

            </ScrollView>

            {/*Footer*/}
            <Footer navigation={navigation}/>
        </SafeAreaView>
    );
}

export default SettingView