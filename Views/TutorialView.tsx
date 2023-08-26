import React, { useEffect, } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import Footer from '../Components/Footer'
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';
import Swiper from 'react-native-swiper';

function TutorialView({navigation}:any):JSX.Element
{
    useEffect (() =>
    {
    }, [])

    const CustomPagination = () => {
        return (
          <View style={{ backgroundColor:"#FFF2F4", borderRadius:4, width:"80%", height:8, marginLeft:21, marginRight:21}}>
            <View style={{ backgroundColor:"#FFB0B3", borderRadius:4, width:"40%", height:8,}} />
          </View>
        )
    }

    const CustumButton = () => {
        return (
            <TouchableOpacity style={Styles.bigButton} onPress={() => Previous()}>
                <Text style={{...Styles.btnText, color:"#FFFFFF"}} >확인</Text>
            </TouchableOpacity>
        )
    }

    const Previous = () => {

    }

    const Next = () => {

    }    

    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            {/* margin is footer height + 21(padding) */}
                {/*Header*/}
                <Header navigation={navigation} title="튜토리얼" setting={false}/>

                {/* main body */}
                <Swiper loop={false} showsPagination={false} style={{height:473,}}>
                    <View style={Styles.tutorialBox}>
                        <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:13,}}>
                            김튜토리얼
                        </Text>
                    </View>
                    <View style={Styles.tutorialBox}>
                        <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:13,}}>
                            김튜토리얼
                        </Text>
                    </View>
                </Swiper>
                {CustomPagination()}
                {CustumButton()}
            {/*Footer*/}
        </SafeAreaView>
    );
}

export default TutorialView