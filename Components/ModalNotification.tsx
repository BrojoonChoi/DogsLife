import React, {useState, useContext, createContext} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Styles from '../Styles/CommonStyle';
import GlobalContext from '../Components/GlobalContext';

const MyContext = createContext("modal");

export const useMyContext = () => {
  return useContext(MyContext);
};

const ModalNotification = () => {
  const {modalVisible, modalTitle, modalText, onModalClose} = useContext(GlobalContext)
  
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <View style={{justifyContent:"center", ...Styles.mainBody, backgroundColor:"#000000B3"}}>
          <View style={{...Styles.leftRightPadding, ...Styles.modalPopup}}>
            <Text style={Styles.modalTitle}>{modalTitle}</Text>
            <Text style={Styles.modalText}>{modalText}</Text>
            <View style={{flexDirection:"row", justifyContent:'center'}}>
                <TouchableOpacity style={Styles.modalBtnOK} onPress={onModalClose}>
                    <Text style={{...Styles.btnText, color:"#FFFFFF"}} >확인</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalNotification