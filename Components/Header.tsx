import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Styles from '../Styles/CommonStyle';

import ImgLogo from '../Assets/Images/img_home_logo_small.svg'
import SettingIcon from '../Assets/Images/img_home_setting.svg'

function Header({navigation, title, setting=true}:any):JSX.Element
{
    const onSettingClick = async () => {
        setting ? navigation.navigate("Setting") : navigation.pop();
    }

    return (
        <View style={{justifyContent:"space-between", flexDirection:"row", width:"100%", paddingTop:20, paddingBottom:20, ...Styles.leftRightPadding, alignItems:"center"}}>
            <View style={{flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <View style={{flexDirection:"row", alignItems:"center", }}>
                    <ImgLogo width={40} height={40}/>
                    <Text style={{color:"#FF99A0", fontSize:20, fontFamily:"Cafe24Syongsyong"}}>{title}</Text>
                </View>
            </View>
            <TouchableOpacity style={{flexDirection:"column", alignItems:"center", justifyContent:"center"}} onPress={() => onSettingClick()}>
                {setting ? <SettingIcon width={40} height={40}/> : 
                <Text style={{fontSize:34, textAlignVertical:"center", fontWeight:"300", textAlign:"center"}}>×</Text>}
            </TouchableOpacity>
        </View>
    );
}

export default Header