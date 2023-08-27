import React, { useEffect, useState, useContext } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import Footer from '../Components/Footer'
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';
import Swiper from 'react-native-swiper';

function TutorialView({navigation}:any):JSX.Element
{
    const {script} = useContext(GlobalContext)
    useEffect (() =>
    {
    }, [])

    const [page, setPage] = useState(1)

    const CustomPagination = () => {
        return (
            <View style={{ width:"100%", paddingLeft:60, paddingRight:60, marginBottom:32}}>
                <View style={{ backgroundColor:"#FFF2F4", borderRadius:4, width:"100%", height:8}}>
                    <View style={{ backgroundColor:"#FFB0B3", borderRadius:4, width:"40%", height:8,}} />
                </View>
            </View>
        )
    }

    const CustumButton = () => {
        if (page==1) {
            return (
                <View style={{width:"100%", flexDirection:"row", justifyContent:"center", ...Styles.leftRightPadding}}>
                    <TouchableOpacity style={{width:"100%", backgroundColor:"#FE8291", ...Styles.bigButton}} onPress={() => Next()}>
                        <Text style={{...Styles.loginButtonText, color:"#FFFFFF", fontFamily:"Cafe24Syongsyong",}} >다음</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (page==3) {
            return (
                <View style={{width:"100%", flexDirection:"row", justifyContent:"center", ...Styles.leftRightPadding}}>
                <TouchableOpacity style={{width:"100%", backgroundColor:"#EEEEEE", ...Styles.bigButton}} onPress={() => Prev()}>
                    <Text style={{...Styles.loginButtonText, color:"#616161", fontFamily:"Cafe24Syongsyong",}} >이전</Text>
                </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{width:"100%", flexDirection:"row", justifyContent:"center", ...Styles.leftRightPadding}}>
                    <TouchableOpacity style={{width:"50%", backgroundColor:"#EEEEEE", ...Styles.bigButton}} onPress={() => Prev()}>
                        <Text style={{...Styles.loginButtonText, color:"#616161", fontFamily:"Cafe24Syongsyong",}} >이전</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:"50%", backgroundColor:"#FE8291", ...Styles.bigButton}} onPress={() => Next()}>
                        <Text style={{...Styles.loginButtonText, color:"#FFFFFF", fontFamily:"Cafe24Syongsyong",}} >다음</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    const Prev = () => {
        setPage(page-1);
    }
    
    const Next = () => {
        setPage(page+1);
    }

    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            {/* margin is footer height + 21(padding) */}
                {/*Header*/}
                <Header navigation={navigation} title="튜토리얼" setting={false}/>

                {/* main body */}
                <View style={{width:"100%"}}>
                    <View style={Styles.tutorialBox}>
                        <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:13,}}>
                            {script("Tutorial")}
                        </Text>
                    </View>
                </View>
                {CustomPagination()}
                {CustumButton()}
            {/*Footer*/}
        </SafeAreaView>
    );
}

export default TutorialView