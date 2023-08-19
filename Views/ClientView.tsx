import React, { useState, useEffect, useContext } from 'react';
import { View, Button, Alert, TouchableOpacity, Text, ScrollView} from 'react-native';
import Styles from '../Styles/CommonStyle';
import firebase from '@react-native-firebase/app'
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database'
import { RTCSessionDescription, RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, MediaStream } from 'react-native-webrtc';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../Components/Footer'
import CameraList from '../Components/CameraList';
import GlobalContext from '../Components/GlobalContext';
import NumberVerificationScreen from '../Components/ModalNumberInput';

let peerConstraints = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302'
		}
	]
};

let mediaConstraints = {
	audio: true,
	video: true
};

const Client = ({navigation}:any) => {
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [localStream, setLocalStream] = useState(null);
  const [askAgain, setAskAgain] = useState(true);
  const {ShowNotification, ShowOKCancel, encryptWithSalt, decryptWithSalt, userToken} = useContext(GlobalContext)
  const [inputBoxVisible, setInputBoxVisible] = useState(false);

  const timeoutPromise = new Promise((resolve, reject) => {
    return (
      setTimeout(() => {
        //reject(new Error('Timeout while waiting for data.'));
        if (askAgain) {
          AskCameraSetting()
        }
      }, 3000)
    )
  })
  
  const handleModal = () => {
  };

  useEffect(() => {
    if (askAgain)
      setInputBoxVisible(true);
    return () => handleModal();
  }, [])

  const AskCameraSetting = () => {
    setAskAgain(false);
    ShowOKCancel("카메라가 없습니다!", "카메라를 설정하러 갈까요?", () => (navigation.navigate("Server")) )
  }

  const startProcess = (salt:string) => {
    setInputBoxVisible(false);
    console.log(salt)
    readOffer(salt);
  }

  const onModalClose = () => {
    setInputBoxVisible(false)
  }

  const readOffer = async (salt:string) => {
    const pc = new RTCPeerConnection(peerConstraints);

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };
    
    const stream = await mediaDevices.getUserMedia(mediaConstraints);
    setLocalStream(stream)
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    try {
      const offerRef = firebase.database().ref(`offers/${userToken}`);
      const snapshot:any = await Promise.race([offerRef.once('value'), timeoutPromise])
      const offer = snapshot.val().sdp;
      const offerDes = new RTCSessionDescription({
        sdp:decryptWithSalt(offer._sdp, salt),
        type:decryptWithSalt(offer._type, salt),
      });
      await pc.setRemoteDescription(offerDes);
    }
    catch {
      return;
    }
    
    // Create an answer and set it as local description
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    // Listen for ICE candidates and add them to the connection  
    const candidateRefClient = database().ref(`candidates/${userToken}/client`);
    candidateRefClient.remove()
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        candidateRefClient.push(event.candidate);
      }
    };

    // Store the answer (SDP) in Firebase
    const answerRef = database().ref(`answers/${userToken}`);
    const rawData:any = {
      _sdp:encryptWithSalt(pc.localDescription._sdp, salt),
      _type:encryptWithSalt(pc.localDescription._type, salt)
    }
    await answerRef.set({ sdp: rawData });

    const candidateRefServer = database().ref(`candidates/${userToken}/server`);
    candidateRefServer.on('child_added', (snapshot) => {
      const candidate = new RTCIceCandidate(snapshot.val());
      pc.addIceCandidate(candidate)
    });

    setAskAgain(false);
  };

  return (
    <SafeAreaView style={{backgroundColor:"#FFFFFF", flex:1}}>
      {
        remoteStream.getVideoTracks().length > 0 ? 
          <RTCView streamURL={remoteStream.toURL()} mirror={true} style={{ flex: 1, borderBottomLeftRadius:16, marginBottom:21 }} objectFit={'cover'} />
        :  
          <RTCView streamURL={""} mirror={true} style={{ flex: 1, borderRadius:16, marginBottom:21 }} objectFit={'cover'} />
      }
      <View style={{flex:1}}>
        <CameraList />
        
        <View style={{flex:0.8, ...Styles.timeLine}}>
        </View>
      </View>

      <Footer navigation={navigation}/>
      <NumberVerificationScreen modalVisible={inputBoxVisible} setAuth={startProcess} onModalClose={onModalClose}/>
    </SafeAreaView>
  );
}

export default Client;
