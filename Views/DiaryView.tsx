import React, { useEffect, useContext, useState} from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import Footer from '../Components/Footer'
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';
import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
import { Image } from 'react-native-svg';

function DiaryView({navigation}:any):JSX.Element
{
    const {userToken} = useContext(GlobalContext);

    useEffect (() =>
    {
        GetDiary();
    }, [])

    const GetDiary = async () => {
        const result:any = [];
        const titleAndText = database().ref(`data/${userToken}/diary/`);

        await titleAndText.limitToLast(5).once("value")
        .then(async (snap) => {
            const data = await snap.val();
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const item = data[key];

                    const path = item.image;
                    const tempPath = await GetCachePath(`diary/${path}`);
                    let tempResult;
                    try {
                        await CheckCacheFile(tempPath) ? 
                        tempResult = tempPath :
                        await storage().ref(`${userToken}/${path}`).getDownloadURL().then((url) => SaveCacheFile(url, tempPath)).then(tempResult = tempPath)
                    }catch (exception) {
                        console.log("test : " + tempPath)
                    }
                    result.push(...item, tempResult)
                }
              }
        });

        return result;
    }

    const CreateTimeline = () => {
        return (
            <View style={{borderRadius:16, backgroundColor:"#FFF7F9", marginLeft:21, marginRight:21}}>
                <Image width={"100%"}></Image>
                <View>
                    <View>
                        <Text></Text>
                        <Text></Text>
                    </View>
                    <Text></Text>
                    <Text></Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            {/* margin is footer height + 21(padding) */}
            <ScrollView style={{marginBottom:79, width:"100%"}}>
                {/*Header*/}
                <Header navigation={navigation} title="Diary" setting={true}/>

                {/* main body */}
                <View>
                </View>
                
            </ScrollView>

            {/*Footer*/}
            <Footer navigation={navigation}/>
        </SafeAreaView>
    );
}

export default DiaryView