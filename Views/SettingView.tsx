import React, { useEffect, } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import Footer from '../Components/Footer'
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';

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

    const MakeOption = ({onClick, title}:any) => {
        return (
            <View style={{...Styles.leftRightPadding, ...Styles.settingOption}}>
                    <TouchableOpacity style={Styles.settingBorder} onPress={() => onClick()}>
                        <View style={{flexDirection:"row"}}>
                            <ImgTutorial width={20} height={20} />
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
                {MakeOption({title:"튜토리얼", onClick:() => console.log("test")})}

            </ScrollView>

            {/*Footer*/}
            <Footer navigation={navigation}/>
        </SafeAreaView>
    );
}

export default SettingView