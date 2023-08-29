import React, { useEffect, useState, useContext, useRef } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import Footer from '../Components/Footer'
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';
import Swiper from 'react-native-swiper';

function TutorialView({navigation}:any):JSX.Element
{
    const {script, GlobalWidth} = useContext(GlobalContext);
    const scrollRef = useRef();
    const [page, setPage] = useState(0)
    const [progress, setProgress] = useState({ width:"0%" })

    useEffect (() =>
    {
        scrollRef.current.scrollTo({x:GlobalWidth*page, y:0, animated:true})
        const currentPos = `${1 + page * 33}%`
        setProgress({width:currentPos})
    }, [page])


    const CustomPagination = () => {
        return (
            <View style={{ width:"100%", paddingLeft:60, paddingRight:60, marginBottom:32}}>
                <View style={{ backgroundColor:"#FFF2F4", borderRadius:4, width:"100%", height:8}}>
                    <View style={{backgroundColor:"#FFB0B3", borderRadius:4, ...progress, height:8}} />
                </View>
            </View>
        )
    }

    const CustumButton = () => {
        if (page==0) {
            return (
                <View style={{width:"100%", flexDirection:"row", justifyContent:"center", ...Styles.leftRightPadding}}>
                    <TouchableOpacity style={{width:"100%", backgroundColor:"#FE8291", ...Styles.bigButton}} onPress={() => Next()}>
                        <Text style={{...Styles.loginButtonText, color:"#FFFFFF", fontFamily:"Cafe24Syongsyong",}} >다음</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (page==3) {
            return (
                <View style={{width:"100%", flexDirection:"column", justifyContent:"center", ...Styles.leftRightPadding}}>
                    <TouchableOpacity style={{width:"100%", backgroundColor:"#EEEEEE", ...Styles.bigButton}} onPress={() => Prev()}>
                        <Text style={{...Styles.loginButtonText, color:"#616161", fontFamily:"Cafe24Syongsyong",}} >이전</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:"100%", backgroundColor:"#FE8291", ...Styles.bigButton, marginTop:5}} onPress={() => navigation.popToTop()}>
                        <Text style={{...Styles.loginButtonText, color:"#FFFFFF", fontFamily:"Cafe24Syongsyong",}} >완료</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{width:"100%", flexDirection:"row", justifyContent:"center", ...Styles.leftRightPadding}}>
                    <TouchableOpacity style={{width:"50%", backgroundColor:"#EEEEEE", ...Styles.smallButton}} onPress={() => Prev()}>
                        <Text style={{...Styles.loginButtonText, color:"#616161", fontFamily:"Cafe24Syongsyong",}} >이전</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:"50%", backgroundColor:"#FE8291", ...Styles.smallButton}} onPress={() => Next()}>
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
                <View style={{height:473, marginBottom:10,}}>
                    <ScrollView horizontal={true} ref={scrollRef}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                        {script("Tutorial").map((item:any, key:any) => {return (
                            <View style={{width:GlobalWidth}} key={`myKey${key}`}>
                                <View style={Styles.tutorialBox}>
                                    {item}
                                </View>
                            </View>
                        )})}
                    </ScrollView>
                </View>
                {CustomPagination()}
                {CustumButton()}
            {/*Footer*/}
        </SafeAreaView>
    );
}

export default TutorialView

/* <View style={{ backgroundColor:"#FFB0B3", borderRadius:4, width:"40%", height:8,[styles.box, { top, left }]}} /> */