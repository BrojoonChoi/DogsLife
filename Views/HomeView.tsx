import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform } from 'react-native';
import Styles from '../Styles/CommonStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import { Shadow } from 'react-native-shadow-2';

import ImgLogo from '../Assets/Images/img_home_logo_small.svg'
import SettingIcon from '../Assets/Images/img_home_setting.svg'

function HomeView({navigation}:any):JSX.Element
{
    useEffect (() =>
    {
        downloadImage()
    }, [])

    const [imageList, setImageList] = useState(undefined)
    const downloadImage = async() =>
    {
        const firebasePath:any = []
        const result = await storage().ref(`Images/`).list().then((result) => result.items)
        result.map((item:any) => firebasePath.push(item["path"]))

        const imgURLs:any = []
        await Promise.all(firebasePath.map(async (path:string)  => imgURLs.push(await storage().ref(path).getDownloadURL())))

        setImageList(imgURLs)
        console.log("called")
    }
    
    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            {/*Header*/}
            <View style={{justifyContent:"space-between", flexDirection:"row", width:"100%", paddingTop:20, paddingBottom:20}}>
                <View style={{flexDirection:"row", alignItems:"center", paddingLeft:21}}>
                    <ImgLogo style={{width:40, height:40}}/>
                    <Text style={{color:"#FF99A0", fontSize:20}}>강아지의 하루</Text>
                </View>
                <View style={{flexDirection:"row", alignItems:"center", paddingRight:21}}>
                    <SettingIcon style={{width:40, height:40}}/>
                </View>
            </View>

            {/*Banner zone*/}
            <View style={{width:"100%", height:166, alignItems:"center", justifyContent:"center", paddingLeft:21, paddingRight:21}}>
                <View style={Styles.bannerContainer}>
                    {
                        imageList == undefined ? <Text>loading</Text> :
                        <Swiper autoplay={true} showsPagination={true} width={348} height={120} autoplayTimeout={3} activeDotColor='#FFCFD5' dotColor='#FFF2F4'>
                        {
                            imageList.map((image, key) => 
                            {
                                console.log(key)
                                return (<Image source={{uri:image}} key={`key${key}${image}`} style={Styles.banner}/>)
                            })
                        }
                        </Swiper>
                    }
                </View>
            </View>
            
            {/*Footer*/}
            
            <View style={Styles.footer}>
                <Shadow startColor='#0000000A' distance={13} offset={[0, 0]} style={{width:"100%"}}/>
            </View>
        </SafeAreaView>
    );
}
/*
const ReadDatabase = () =>
{
    database.ref('/users/123').once('value').then(snapshot => {console.log('User data: ', snapshot.val());});
}
*/
export default HomeView