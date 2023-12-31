import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import { Shadow } from 'react-native-shadow-2';

import ImgNavCamera from '../Assets/Images/img_home_nav_camera.svg'
import ImgNavCCTV from '../Assets/Images/img_home_nav_cctv.svg'
import ImgNavDiary from '../Assets/Images/img_home_nav_diary.svg'
import ImgNavHome from '../Assets/Images/img_home_nav_home.svg'

function Footer({navigation}:any):JSX.Element
{
    const goHome = () => {
        try {
            navigation.popToTop();
        } catch {
            return;
        }
    }
    return (
        <View style={Styles.footer}>
            <Shadow distance={15} startColor={'#0000000F'} endColor={'#FFFFFF00'} offset={[0, 0]} style={{width:"100%",}}/>
            <View style={{backgroundColor: '#FFF2F4', flexDirection:"row", justifyContent:"space-between", ...Styles.leftRightPadding}}>
                <TouchableOpacity >
                    <ImgNavHome onPress={() => goHome()}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <ImgNavDiary onPress={() => navigation.navigate("Diary")}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <ImgNavCCTV onPress={() => navigation.navigate("Client")}/>
                </TouchableOpacity>
            </View> 
        </View>
    );
}

export default Footer

/*
function Footer({navigation}:any):JSX.Element
{
    return (
        <View style={Styles.footer}>
            <Shadow startColor='#0000000A' distance={13} offset={[0, -13]} style={{width:"100%"}}/>
            <TouchableOpacity>
                <ImgNavHome width={58} height={58} onPress={() => navigation.navigate("Home")}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <ImgNavDiary width={58} height={58} onPress={() => navigation.navigate("Home")}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <ImgNavCamera width={58} height={58} onPress={() => navigation.navigate("Server")}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <ImgNavCCTV width={58} height={58} onPress={() => navigation.navigate("Client")}/>
            </TouchableOpacity>
        </View>
    );
}
*/