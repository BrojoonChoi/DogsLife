import React, { useEffect, useState, useContext } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, Text, View, Alert, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firebase from '@react-native-firebase/app'
import Styles from '../Styles/CommonStyle';
import { request, PERMISSIONS } from 'react-native-permissions';
import GlobalContext from '../Components/GlobalContext';
import database from '@react-native-firebase/database';

import ImgBackground from '../Assets/Images/img_loading_background.svg'
import ImgLogo from '../Assets/Images/img_loading_logo.svg'

function LoadingView({navigation, dataList}: any):JSX.Element
{
    const {userToken, setUserToken, GlobalWidth, GlobalHeight, GetCachePath, CheckCacheFile, SaveCacheFile, getData} = useContext(GlobalContext);
    const [login, setLogin] = useState(false);

    const DownloadBanner = async() => {
        const firebasePath:any = [];
        const result = await storage().ref(`Images/`).list().then((result) => result.items);
        result.map((item:any) => firebasePath.push(item["path"]));
    
        const imageList:any = []
        await Promise.all(firebasePath.map(async (path:string)  => {
            const tempPath = await GetCachePath(path);
            try {
                await CheckCacheFile(tempPath) ? 
                imageList.push(tempPath) :
                await storage().ref(path).getDownloadURL().then((url) => SaveCacheFile(url, tempPath)).then(imageList.push(tempPath))
            }catch (exception) {
                console.log("test : " + tempPath)
            }
        }));
        return imageList
    }

    const DownloadTimeline = async() => {
        if (userToken == null) return;
        const firebasePath:any = [];
        const titleAndText = database().ref(`data/${userToken}/timeLine/`);
        
        await titleAndText.limitToLast(5).once("value").then(async (snap) => {
            const data = await snap.val();
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                  const item = data[key];
                  firebasePath.push(item);
                }
              }
        });
        
        const imageList:any = []
        await Promise.all(firebasePath.map(async (item:any)  => {
            const path = item.title;
            const tempPath = await GetCachePath(`timeline/${path}`);
            await storage().ref(`${userToken}/${path}`).getDownloadURL().then((url) => console.log(url));
            try {
                await CheckCacheFile(tempPath) ? 
                imageList.push(tempPath) :
                await storage().ref(`${userToken}/${path}`).getDownloadURL().then((url) => SaveCacheFile(url, tempPath)).then(imageList.push(tempPath))
            }catch (exception) {
                console.log("test : " + tempPath)
                return undefined;
            }
        }));
        //return imageList
        if (firebasePath.length == 0) return undefined;
        return {firebasePath, imageList};
    }

    const Home = async () => {
        const dataList = {imageList:await DownloadBanner(), timeLine:await DownloadTimeline()};
        navigation.reset({routes: [{ name: 'Home', params: { dataList: dataList } }] })
    }

    const requestMediaPermissions = async () => {
        const isAndroid = Platform.OS === 'android';
        const isIOS = Platform.OS === 'ios';
        if (isAndroid) {
            const cameraPermissionStatus = await request(PERMISSIONS.ANDROID.CAMERA);
            const microphonePermissionStatus = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        }
        else if (isIOS) {
            const cameraPermissionStatus = await request(PERMISSIONS.IOS.CAMERA);
            const microphonePermissionStatus = await request(PERMISSIONS.IOS.MICROPHONE);
        }
    };

    const sleep = async (ms:any) => {
        const wait = new Promise(resolve => setTimeout(resolve, ms));
        await wait;
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user == null) return;
        setUserToken(user?.uid);
        Home();        
    })

    const checkAutoLogin = async () => {
        const loginWay = await getData("login");
        if (loginWay == "google") {
            try 
            {
                await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
                const { idToken } = await GoogleSignin.signIn();
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                auth().signInWithCredential(googleCredential);
            }
            catch(e)
            {
                Alert.alert(e + "\n에러가 발생했습니다.")
                navigation.reset({routes: [{name: 'Login'}]})
            }
        }
        else {
            navigation.reset({routes: [{name: 'Login'}]})
        }
    };

    useEffect (() => {
        requestMediaPermissions();
        checkAutoLogin();
    },[])

    return (
        <View style={Styles.mainBody}>
            <ImgBackground width={GlobalWidth*1.05} height={GlobalHeight} style={Styles.background}/>
            {/*<ImgBackground style={{width:GlobalWidth, height:GlobalHeight}}/>*/}
            <View style={{alignItems:"center", top:210}}>
                <ImgLogo width={210} height={176}/>
                <Text style={Styles.title}>강아지의 하루</Text>
            </View>
        </View>
    );
}

export default LoadingView