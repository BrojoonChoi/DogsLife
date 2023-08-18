import React, {useState, useContext, createContext} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Styles from '../Styles/CommonStyle';
import ModalNotification from './ModalNotification';

const GlobalContext = createContext("lang");
export default GlobalContext;

export function GlobalContextProvider ({children}:any) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [userToken, setUserToken] = useState(null)

    const ShowNotification = (title:string, text:string) => {
        setModalTitle(title)
        setModalText(text)
        setModalVisible(true)
    }

    const onModalClose = () => {
        setModalVisible(false)
    }

    return (
        <GlobalContext.Provider value={{modalVisible, modalTitle, modalText, userToken, onModalClose, ShowNotification}}>
            {children}
        </GlobalContext.Provider>
    );
};
