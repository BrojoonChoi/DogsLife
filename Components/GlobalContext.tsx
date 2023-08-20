import React, {useState, useContext, createContext, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Styles from '../Styles/CommonStyle';
import ModalNotification from './ModalNotification';
import CryptoJS from 'rn-crypto-js'
import storage from '@react-native-firebase/storage';

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

const generateSalt = () => {
    let result = Math.floor(Math.random() * 10).toString();
    result += Math.floor(Math.random() * 10).toString();
    result += Math.floor(Math.random() * 10).toString();
    result += Math.floor(Math.random() * 10).toString();

    return result;
}

const GlobalContext = createContext("lang");
export default GlobalContext;

export function GlobalContextProvider ({children}:any) {
    const [modalNotificationVisible, setModalNotificationVisible] = useState(false);
    const [modalOKCancelVisible, setmodalOKCancelVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [userToken, setUserToken] = useState(null)
    const [onModalOK, setOnModalOK] = useState();

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
            GlobalWidth, GlobalHeight,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
