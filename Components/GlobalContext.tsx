import React, {useState, useContext, createContext, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import CryptoJS from 'rn-crypto-js'
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage'

  // 데이터와 솔트를 사용하여 암호화
const encryptWithSalt = (data: string, salt: string) => {
    return (CryptoJS.AES.encrypt(data.toString(), salt).toString())
};
  
  // 암호화된 데이터를 복호화
const decryptWithSalt = (encryptedData: string, salt: string): string => {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, salt).toString(CryptoJS.enc.Utf8);
    return decryptedData;
};

const GlobalWidth = Dimensions.get('window').width
const GlobalHeight = Dimensions.get('window').height

const GetCachePath = async (path:string) => {
    const extension = Platform.OS === 'android' ? 'file://' : '';
    try {
        const dir = `${extension}${RNFS.CachesDirectoryPath}/${path.substring(0, path.lastIndexOf('/'))}/`;
        const exists = await RNFS.exists(dir);
    
        if (!exists) {
            await RNFS.mkdir(dir);
        }
        else {
        }
        
        return (`${dir}${path.substring(path.lastIndexOf('/') + 1, path.length)}`)
      } catch (error) {
      }
      return "";
}

const CheckCacheFile = async (path:string) => {
    return await RNFS.exists(path);
}

const SaveCacheFile = async (uri:string, path:string) => {
    const options = {
        fromUrl: uri,
        toFile: path,
      };

      const downloadResult = await RNFS.downloadFile(options).promise;
}

const storeData = async (type: string, value:string) => {
    try {
      await AsyncStorage.setItem(type, value);
      return true;
    } catch (e) {
      return false;
    }
  };

const getData = async (type: string) => {
  try {
    const value = await AsyncStorage.getItem(type);
    console.log(value);
    return value;
  } catch (e) {
    return null;
  }
}

const generateSalt = () => {
    let result = Math.floor(Math.random() * 10).toString();
    result += Math.floor(Math.random() * 10).toString();
    result += Math.floor(Math.random() * 10).toString();
    result += Math.floor(Math.random() * 10).toString();

    return result;
}

const GlobalContext = createContext("lang");
export function GlobalContextProvider ({children}:any) {
    const [modalNotificationVisible, setModalNotificationVisible] = useState(false);
    const [modalOKCancelVisible, setmodalOKCancelVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [userToken, setUserToken] = useState(null)
    const [onModalOK, setOnModalOK] = useState();
    
    const UploadFile = async (path:string, uri:string) => {
      const reference = storage().ref(`/${userToken}/${path}`);
      if (Platform.OS === "android") { // 안드로이드
        await reference.putFile(uri);
        // 파일 업로드
        /*
        await reference.putString(uri, "base64", {
            contentType: "image"
        });
        */
      } else { // iOS
          // 파일 업로드
          await reference.putFile(uri);
      }
      const imageUrl = await reference.getDownloadURL();
      await reference.putFile(uri);
    }

    const ShowNotification = (title:string, text:string) => {
        setmodalOKCancelVisible(false)
        setModalTitle(title)
        setModalText(text)
        setModalNotificationVisible(true)
    }

    const ShowOKCancel = (title:string, text:string, onOK:any) => {
        setModalNotificationVisible(false)
        setModalTitle(title)
        setModalText(text)
        setmodalOKCancelVisible(true)
        setOnModalOK(() => onOK)
    }

    const onModalClose = () => {
        setModalNotificationVisible(false)
        setmodalOKCancelVisible(false)
    }

    return (
        <GlobalContext.Provider value={{
            userToken, setUserToken,
            generateSalt, encryptWithSalt, decryptWithSalt,
            modalTitle, modalText, onModalClose, 
            modalNotificationVisible, ShowNotification,
            modalOKCancelVisible, ShowOKCancel, onModalOK,
            GlobalWidth, GlobalHeight, GetCachePath, CheckCacheFile, SaveCacheFile,
            storeData, getData, UploadFile
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
export default GlobalContext;