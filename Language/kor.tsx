import React, {useState, useContext} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Styles from '../Styles/CommonStyle';

import ImgNavCamera from '../Assets/Images/img_home_nav_camera.svg'

const ScriptsKOR = {
    Tutorial:[
        <View key={"TutorialKey0"}>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:17, fontWeight:"400"}}>
                2개의 핸드폰을 준비해주세요. 1번 핸드폰에서 CCTV 버튼을 클릭해주세요.
            </Text>
            <ImgNavCamera style={{margin:5, borderRadius:8, borderColor:"FFFFFF", borderWidth:1}} />
        </View>,
        <View key={"TutorialKey1"}>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:17, fontWeight:"400"}}>
                최초 실행 시 카메라 설정 화면으로 이동합니다.
            </Text>
            <Image style={Styles.tutorialImages} source={require("../Assets/Images/tutorial/00.png")}/>
        </View>,
        <View key={"TutorialKey2"}>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:17, fontWeight:"400"}}>
                발행된 인증번호를 2번 핸드폰에 입력하면 자동으로 연결이 됩니다.
            </Text>
            <Image style={Styles.tutorialImages} source={require("../Assets/Images/tutorial/01.png")}/>
            <Image style={Styles.tutorialImages} source={require("../Assets/Images/tutorial/02.png")}/>
        </View>],
        
    OK:"확인",
    Cancel:"취소",
}

export default ScriptsKOR