import React, {useState, useContext} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Styles from '../Styles/CommonStyle';

import ImgNavCamera from '../Assets/Images/img_home_nav_camera.svg'

const ScriptsKOR = {
    Tutorial:[
        <View key={"TutorialKey0"}>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:16, fontWeight:"400"}}>
                2개의 핸드폰을 준비해주세요.두 핸드폰 모두 같은 방식으로 로그인 되어야 합니다.
            </Text>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:16, fontWeight:"400", paddingBottom:17}}>
                1번 핸드폰에서 CCTV 버튼을 클릭해주세요.
            </Text>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:14, fontWeight:"300"}}>
                예) 구글, 구글 또는 애플, 애플, 카카오, 카카오.
            </Text>
            <ImgNavCamera style={{margin:5, borderRadius:8, borderColor:"FFFFFF", borderWidth:1}} />
        </View>,
        <View key={"TutorialKey1"}>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:16, fontWeight:"400"}}>
                인증정보가 없을 경우 아래와 같은 설정 팝업이 나타나게 됩니다.
            </Text>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:16, fontWeight:"400"}}>
                확인 버튼을 눌러 카메라 설정 화면으로 이동하세요.
            </Text>
            <Image style={Styles.tutorialImages} source={require("../Assets/Images/tutorial/00.png")}/>
        </View>,
        <View key={"TutorialKey2"}>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:16, fontWeight:"400"}}>
                카메라 설정 화면으로 이동한 뒤,
            </Text>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:16, fontWeight:"400"}}>
                확인 버튼을 누르면 인증 번호가 나오게 됩니다.
            </Text>
            <Image style={Styles.tutorialImages} source={require("../Assets/Images/tutorial/01.png")}/>
        </View>,
        <View key={"TutorialKey2"}>
            <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:16, fontWeight:"400"}}>
                2번 일상용 핸드폰에 발행된 인증번호를 2번 핸드폰에 입력하면 자동으로 연결이 됩니다.
            </Text>
            <Image style={Styles.tutorialImages} source={require("../Assets/Images/tutorial/02.png")}/>
        </View>],
        
    OK:"확인",
    Cancel:"취소",
}

export default ScriptsKOR