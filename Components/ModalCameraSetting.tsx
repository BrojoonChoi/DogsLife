import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Styles from '../Styles/CommonStyle';

const ModalCameraSetting = ({ visible, onClose, onClick }:any) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}>
        <View style={{justifyContent:"center", ...Styles.mainBody, backgroundColor:"#000000B3"}}>
          <View style={{...Styles.leftRightPadding, ...Styles.modalPopup}}>
            <Text style={Styles.modalTitle}>CCTV 연동하기</Text>
            <Text style={Styles.modalText}>연동된 CCTV가 없어요. 연동하러 갈까요?</Text>
            <View style={{flexDirection:"row", justifyContent:'center'}}>
                <TouchableOpacity style={Styles.modalBtnCancel} onPress={onClose}>
                    <Text style={{...Styles.btnText, color:"#424242"}} >취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.modalBtnOK} onPress={onClick}>
                    <Text style={{...Styles.btnText, color:"#FFFFFF"}} >확인</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalCameraSetting