import React, { useEffect, } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import Footer from '../Components/Footer'
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';

import ImgBiz from '../Assets/Images/img_setting_icon_bizoffer.svg'
import ImgLogout from '../Assets/Images/img_setting_icon_logout.svg'
import ImgTerms from '../Assets/Images/img_setting_icon_termandcondition.svg'
import ImgTutorial from '../Assets/Images/img_setting_icon_tutorial.svg'
import ImgArrow from '../Assets/Images/img_setting_icon_arrow.svg'

function SettingView({navigation}:any):JSX.Element
{
    useEffect (() =>
    {
    }, [])
    
    const onLogout = async () => {
        await firebase.auth().signOut();
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        console.log("sign out");
        navigation.navigate("Loading");
    }

    const imageReturn = (logo:string) => {
        switch (logo) {
            case "tutorial" : {
                return (<ImgTutorial width={20} height={20} />);
            }
            case "terms" : {
                return (<ImgTerms width={20} height={20} />);
            }
            case "coOp" : {
                return (<ImgBiz width={20} height={20} />);
            }
            case "logout" : {
                return (<ImgLogout width={20} height={20} />);
            }
        }
    }

    const MakeOption = ({onClick, title, logo}:any) => {
        return (
            <View style={{...Styles.leftRightPadding, ...Styles.settingOption}}>
                    <TouchableOpacity style={Styles.settingBorder} onPress={() => onClick()}>
                        <View style={{flexDirection:"row"}}>
                            {imageReturn(logo)}
                            <Text style={Styles.settingOptionText} >{title}</Text>
                        </View>
                        <View>
                            <ImgArrow width={20} height={20} />
                        </View>
                    </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            {/* margin is footer height + 21(padding) */}
            <ScrollView style={{marginBottom:79, width:"100%"}}>
                {/*Header*/}
                <Header navigation={navigation} title="설정"/>

                {/* main body */}
                {MakeOption({title:"튜토리얼", logo:"tutorial", onClick:() => navigation.navigate("Tutorial")})}
                {MakeOption({title:"약관 및 정책", logo:"terms",  onClick:() => console.log("test")})}
                {MakeOption({title:"제휴 문의", logo:"coOp",  onClick:() => console.log("test")})}
                {MakeOption({title:"로그아웃", logo:"logout",  onClick:() => onLogout()})}

            </ScrollView>

            {/*Footer*/}
            <Footer navigation={navigation}/>
        </SafeAreaView>
    );
}

export default SettingView