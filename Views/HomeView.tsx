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

function HomeView({navigation, route}:any):JSX.Element
{
    const { dataList, timeLine } = route.params;
    const {getData, storeData} = useContext(GlobalContext);

    useEffect (() =>
    {
        init();
    }, [])

    const init = async () => {
        const result = await getData("tutorial");
        if (result == null) {
            storeData("tutorial", "done");
            navigation.navigate("Tutorial");
        }
    }
    const dummyData = {api:[{title:"2023.01.01 12:00", text:"CCTV를 사용하면,", image:""}, {title:"2023.01.01 12:15", text:"강아지가 뭘 하는지.", image:""}, {title:"2023.01.01 12:30", text:"타임라인을 남겨드립니다.", image:""}]}
    const CamHistory = (title:string, text:string, image:string, key:any) => {
        return (
            <View key={`camkey${key}`} style={{justifyContent:"flex-start", flexDirection:"row", width:"100%", marginBottom:8}}>
                {/*left image zone*/}
                <View style={{justifyContent:"center", alignItems:"flex-start", marginRight:16}}>
                    {image == "" ? <Image style={Styles.camImage} source={require("../Assets/Images/temp_img.png")}/> : <Image style={Styles.camImage} source={{uri:image}}/>}
                </View>
                {/*right text zone*/}
                <View style={{justifyContent:"center", alignItems:"flex-start", }}>
                    <View>
                        <Text style={{color:"#FF99A0", fontSize:13, fontFamily:"BMJUA_ttf", letterSpacing:0.06, marginBottom:6}}>TIME</Text>
                        <Text style={{color:"#616161", fontSize:13, fontFamily:"AppleSDGothicNeoM", letterSpacing:0.1, marginBottom:18}}>{title}</Text>
                    </View>
                    <View>
                        <Text style={{color:"#FF99A0", fontSize:13, fontFamily:"BMJUA_ttf", letterSpacing:0.06, marginBottom:6}}>POINT</Text>
                        <Text style={{color:"#616161", fontSize:13, fontFamily:"AppleSDGothicNeoM", letterSpacing:0.1}}>{text}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const LoadMore = () => {
        console.log()
    }
    
    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            {/* margin is footer height + 21(padding) */}
            <ScrollView style={{marginBottom:58, width:"100%"}}>
                {/*Header*/}
                <Header navigation={navigation} title="강아지의 하루"/>

                {/*Banner zone*/}
                <View style={{width:"100%", alignItems:"center", justifyContent:"center"}}>
                    <View style={Styles.bannerContainer}>
                        {
                            dataList == undefined ? <Image source={require("../Assets/Images/img_home_banner_loading.png")} style={Styles.banner}/> :
                            <Swiper 
                            autoplay={true} 
                            showsPagination={true}
                            paginationStyle={{
                                bottom: -22,
                              }}
                            width={348} height={120} 
                            autoplayTimeout={3} 
                            activeDotColor='#FFCFD5' dotColor='#FFF2F4'>
                            {
                                dataList?.map((image:any, key:any) =>
                                {
                                    return (<Image source={{uri:image}} key={`key${key}${image}`} style={Styles.banner}/>)
                                })
                            }
                            </Swiper>
                        }
                    </View>
                </View>
                {/* main body */}
                <CameraList />

                <View style={Styles.timeLine}>
                    {
                        timeLine == undefined ? 
                        dummyData.api.map((contents:any, key:any) => {
                            return CamHistory(contents.title, contents.text, contents.image, key)
                        }) 
                        :
                        timeLine.map((contents:any, key:any) => {
                            return CamHistory(contents.title, contents.text, contents.image, key)
                        })
                    }
                </View>
                <TouchableOpacity style={Styles.viewMoreButton}>
                    <Text style={Styles.viewMoreButtonText} onPress={() => LoadMore()}>더 보기</Text>
                </TouchableOpacity>
            </ScrollView>

            {/*Footer*/}
            <Footer navigation={navigation}/>
        </SafeAreaView>
    );
}

export default HomeView