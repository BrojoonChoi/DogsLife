import React, {useState, useRef } from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';
import Styles from '../Styles/CommonStyle';
import { SafeAreaView } from 'react-native-safe-area-context';

const NumberVerificationScreen = ({setAuth, modalVisible, onModalClose}:any) => {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);

  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');

  const handleVerification = (text:string) => {
    const verificationCode = digit1 + digit2 + digit3 + text;
    if (digit1 == "")
      return;
    if (digit2 == "")
      return;
    if (digit3 == "")
      return;

    setAuth(verificationCode);
  };

  const TextVerification = (boxID:string, text:string) => {
    switch (boxID) {
      case "box1" : {
        setDigit1(text)
        text == "" ? console.log("empty") : input2Ref.current.focus();
        break;
      }
      case "box2" : {
        setDigit2(text)
        text == "" ? input1Ref.current.focus() : input3Ref.current.focus();
        break;
      }
      case "box3" : {
        setDigit3(text)
        text == "" ? input2Ref.current.focus() : input4Ref.current.focus();
        break;
      }
      case "box4" : {
        setDigit4(text)
        text == "" ? input3Ref.current.focus() : handleVerification(text);
        return;
      }
    } 
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
          
        <View style={{justifyContent:"center", ...Styles.mainBody, backgroundColor:"#000000B3"}}>
          <View style={{width:"100%", ...Styles.leftRightPadding}}>
            <View style={{justifyContent:"center", alignItems:"center", ...Styles.modalPopup}}>
              <Text style={Styles.modalTitle}>인증 번호를 입력하세요.</Text>
                <View style={{flexDirection:"row", justifyContent:'center'}}>
                  <TextInput
                    ref={input1Ref}
                    style={Styles.modalTextBox}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit1}
                    onChangeText={text => TextVerification("box1", text, )}
                  />
                  <TextInput
                    ref={input2Ref}
                    style={Styles.modalTextBox}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit2}
                    onChangeText={text => TextVerification("box2", text)}
                  />
                  <TextInput
                    ref={input3Ref}
                    style={Styles.modalTextBox}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit3}
                    onChangeText={text => TextVerification("box3", text)}
                  />
                  <TextInput
                    ref={input4Ref}
                    style={Styles.modalTextBox}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit4}
                    onChangeText={text => TextVerification("box4", text)}
                  />
                </View>
                  <TouchableOpacity style={Styles.modalBtnCancel} onPress={onModalClose}>
                      <Text style={{...Styles.btnText, color:"#424242"}} >취소</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>
    </View>
  );
};

export default NumberVerificationScreen;