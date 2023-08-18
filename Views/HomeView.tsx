import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import Footer from '../Components/Footer'
import CameraList from '../Components/CameraList';

import ImgLogo from '../Assets/Images/img_home_logo_small.svg'
import SettingIcon from '../Assets/Images/img_home_setting.svg'

function HomeView({navigation}:any):JSX.Element
{
    useEffect (() =>
    {
        downloadImage()
    }, [])

    const [imageList, setImageList] = useState(undefined)
    const [imageLoaded, setImageLoaded] =useState(false)
    const downloadImage = async() =>
    {
        const firebasePath:any = []
        const result = await storage().ref(`Images/`).list().then((result) => result.items)
        result.map((item:any) => firebasePath.push(item["path"]))

        const imgURLs:any = []
        await Promise.all(firebasePath.map(async (path:string)  => imgURLs.push(await storage().ref(path).getDownloadURL())))

        setImageList(imgURLs)
        console.log("called")
        setImageLoaded(true)
    }

    const dummyData = {api:[{title:"2023.01.01 12:00", text:"잔다."}, {title:"2023.01.02 12:00", text:"잔다."}, {title:"2023.01.03 12:00", text:"잔다."}, {title:"2023.01.04 12:00", text:"잔다."}]}
    const CamHistory = (title:string, text:string, key:any) => {
        return (
            <View key={`camkey${key}`} style={{justifyContent:"flex-start", flexDirection:"row", width:"100%", marginBottom:8}}>
                {/*left image zone*/}
                <View style={{justifyContent:"center", alignItems:"flex-start", width:"50%"}}>
                    <Image style={Styles.camImage} source={require("../Assets/Images/temp_img.png")}/>
                </View>
                {/*right text zone*/}
                <View style={{justifyContent:"center", alignItems:"flex-start", width:"50%", left:-16}}>
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
            <ScrollView style={{marginBottom:79, width:"100%"}}>
                {/*Header*/}
                <View style={{justifyContent:"space-between", flexDirection:"row", width:"100%", paddingTop:20, paddingBottom:20, ...Styles.leftRightPadding}}>
                    <View style={{flexDirection:"row", alignItems:"center", }}>
                        <ImgLogo style={{width:40, height:40}}/>
                        <Text style={{color:"#FF99A0", fontSize:20, fontFamily:"Cafe24Syongsyong"}}>강아지의 하루</Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center", }}>
                        <SettingIcon style={{width:40, height:40}}/>
                    </View>
                </View>

                {/*Banner zone*/}
                <View style={{width:"100%", alignItems:"center", justifyContent:"center",}}>
                    <View style={Styles.bannerContainer}>
                        {
                            imageLoaded == false ? <Image source={require("../Assets/Images/img_home_banner_loading.png")} style={Styles.banner}/> :
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
                                imageList?.map((image:any, key:any) =>
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
                        dummyData.api.map((contents:any, key:any) => {
                            return CamHistory(contents.title, contents.text, key)
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