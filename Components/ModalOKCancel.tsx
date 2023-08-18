import React, {useState, useContext} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Styles from '../Styles/CommonStyle';
import GlobalContext from './GlobalContext';

const ModalOKCancel = () => {
  const {modalOKCancelVisible, modalTitle, modalText, onModalClose, onModalOK} = useContext(GlobalContext)

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOKCancelVisible}>
        <View style={{justifyContent:"center", ...Styles.mainBody, backgroundColor:"#000000B3"}}>
          <View style={{width:"100%", ...Styles.leftRightPadding}}>
            <View style={{...Styles.modalPopup}}>
              <Text style={Styles.modalTitle}>{modalTitle}</Text>
              <Text style={Styles.modalText}>{modalText}</Text>
              <View style={{flexDirection:"row", justifyContent:'center'}}>
                  <TouchableOpacity style={Styles.modalBtnCancel} onPress={onModalClose}>
                      <Text style={{...Styles.btnText, color:"#424242"}} >취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Styles.modalBtnOK} onPress={onModalOK}>
                      <Text style={{...Styles.btnText, color:"#FFFFFF"}} >확인</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalOKCancel