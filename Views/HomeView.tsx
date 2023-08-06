import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert, Button, Platform } from 'react-native';
import Styles from '../Styles/CommonStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

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
        result.map((item) => firebasePath.push(item["path"]))

        const imgURLs:any = []
        await Promise.all(firebasePath.map(async (path:string)  => imgURLs.push(await storage().ref(path).getDownloadURL())))

        setImageList(imgURLs)
        console.log("called")
    }
    
    return (
        <SafeAreaView style={Styles.mainBody}>
            <View style={Styles.bannerContainer}>
                {
                    imageList == undefined ? <Text>loading</Text> :
                    <Swiper autoplay={true} showsPagination={true} width={280} height={210} autoplayTimeout={3}>
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
            <Button title="happy" onPress={() => console.log(imageList)}/>
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