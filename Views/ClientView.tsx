import React, { useState, useEffect, useContext, useRef } from 'react';
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
import ModalNotification from '../Components/ModalNotification';
import { request } from 'react-native-permissions';

let peerConstraints = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' }
  ]
};

let mediaConstraints = {
	audio: true,
	video: false
};

const Client = ({navigation}:any) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  //const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const {ShowNotification, ShowOKCancel, encryptWithSalt, decryptWithSalt, userToken, storeData, getData} = useContext<any>(GlobalContext)
  const [inputBoxVisible, setInputBoxVisible] = useState(false);

  const SessionDestroy = async () => {
    if (pc.current !== null) {
      pc.current.onconnectionstatechange = null;
      pc.current.onsignalingstatechange = null;
      pc.current.close();
      pc.current = null;
      const requestRef = database().ref(`requests/${userToken}`);
      await requestRef.set({ request: Date().toString(), flag:'Destroy' }); // 요청 플래그 설정
      console.log("pc destoried")
    }
    console.log(remoteStream)
    if (remoteStream !== null) {
      remoteStream.getTracks().forEach(Track => Track.stop);
      setRemoteStream(null);
      console.log("remote stream destoried")
    }
  }

  useEffect(() => {
    StartProcess()

    return () => {
      SessionDestroy();
    }
  }, [])

  const SetRequest = async (param:any) => {
    const offerRef = database().ref(`offers/${userToken}`);
    await offerRef.remove();

    const requestRef = database().ref(`requests/${userToken}`);
    await requestRef.set({ request: param, flag:'Requested' }); // 요청 플래그 설정
  }

  const StartProcess = async () => {
    //restore salt, if there is no salt, perfrom is fisrt
    await SetRequest(Date().toString());
    await getData("secret").then((result:string) => result !== null ? onDataInput(result) : setInputBoxVisible(true));
  } 

  const retryRef = useRef(false);
  const pc = useRef<RTCPeerConnection | null>(null)
  const onDataInput = async (salt:string) => {
    setInputBoxVisible(false);
    storeData("secret", salt)

    console.log(retryRef.current)
    if (retryRef.current == true) {
      readOffer(salt);
      retryRef.current = false;
      return;
    }
  
    const requestRef = database().ref(`requests/${userToken}`);
    requestRef.on("value", async (_snapshot) => {  
      if (_snapshot.val() != null && _snapshot.val().flag === 'Accepted') {
        console.log("Offer Accepted.");
        await requestRef.set(null);
        await readOffer(salt); // 기존 readOffer 로직 재활용
        return;
      }
      else {
        //ShowOKCancel("카메라가 없습니다!", "카메라를 설정하러 갈까요?", () => (navigation.navigate("Server")) )
        return;
      }
    });
  }

  const onModalClose = () => {
    setInputBoxVisible(false)
  }

  const readOffer = async (salt:string) => {
    pc.current = new RTCPeerConnection(peerConstraints);

    const newRemoteStream = new MediaStream();

    pc.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        newRemoteStream.addTrack(track);
      });
    };

    const stream = await mediaDevices.getUserMedia(mediaConstraints);
    //setLocalStream(stream)
    if (pc.current !== null) {
      stream.getTracks().forEach((track) => pc.current?.addTrack(track, stream));
    }

    const offerRef = database().ref(`offers/${userToken}`);
    offerRef.on("value", (snap) => {
      if (snap.val() != null) {
        console.log("C : there is an offer");
      } else {
        console.log("C : there is no offer");
        return;
      }
    })

    try {
      const snapshot = await offerRef.once('value')
      const offer = snapshot.val().sdp;
      const offerDes = new RTCSessionDescription({
        sdp:decryptWithSalt(offer.sdp, salt),
        type:decryptWithSalt(offer.type, salt),
      });
      await pc.current.setRemoteDescription(offerDes);
    } catch (exception) {
      retryRef.current = true;
      setInputBoxVisible(true);
      return;
    }
    
    // Listen for ICE candidates and add them to the connection  
    const candidateRefClient = database().ref(`candidates/${userToken}/client`);
    candidateRefClient.remove()
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("C : Client candidates added")
        candidateRefClient.push(event.candidate);
      }
    };

    // Create an answer and set it as local description
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    // Store the answer (SDP) in Firebase
    const answerRef = database().ref(`answers/${userToken}`);
    if (pc.current.localDescription) {
      const rawData:any = {
        sdp:encryptWithSalt(pc.current.localDescription.sdp, salt),
        type:encryptWithSalt(pc.current.localDescription.type, salt)
      }
      await answerRef.set({ sdp: rawData });
    }

    const candidateRefServer = database().ref(`candidates/${userToken}/server`);
    candidateRefServer.on('child_added', (snapshot) => {
      const candidate = new RTCIceCandidate(snapshot.val());
      if (pc.current !== null)
        pc.current.addIceCandidate(candidate)
    });
    
    pc.current.addEventListener('connectionstatechange', async event => {
      switch( pc.current?.connectionState ) {
        case 'connected':
          console.log("Worked Normally");
          offerRef.off();
          answerRef.off();
          candidateRefClient.off();
          candidateRefServer.off();
          if (newRemoteStream.getTracks().length > 0) {
            setRemoteStream(newRemoteStream);
          }
          break;
        case 'closed':
          console.log("closed")
          offerRef.off();
          answerRef.off();
          candidateRefClient.off();
          candidateRefServer.off();
          SessionDestroy();
          return;
        case 'disconnected':
          console.log("disconnected")
          offerRef.off();
          answerRef.off();
          candidateRefClient.off();
          candidateRefServer.off();
          SessionDestroy();
          return;
        case 'failed':
          offerRef.off();
          answerRef.off();
          candidateRefClient.off();
          candidateRefServer.off();
          SessionDestroy();
          return;
      };
    });

    pc.current.addEventListener( 'signalingstatechange', async event => {
      switch( pc.current?.signalingState ) {
        case 'closed':
          offerRef.off();
          answerRef.off();
          candidateRefClient.off();
          candidateRefServer.off();
          SessionDestroy();
          return;
      };
    });
  }

  return (
    <SafeAreaView style={{backgroundColor:"#FFFFFF", flex:1}}>
      {
        remoteStream !== null ?
          <RTCView 
          streamURL={remoteStream.toURL()}
          mirror={true} 
          style={{ flex: 1, borderBottomLeftRadius:16, marginBottom:21 }} 
          objectFit={'cover'} />
          :
          <RTCView 
          streamURL={''}
          mirror={true} 
          style={{ flex: 1, borderBottomLeftRadius:16, marginBottom:21 }} 
          objectFit={'cover'} />
      }
      <View style={{flex:1}}>
        <CameraList />
        <Button onPress={() => setInputBoxVisible(true)} title='Reconnect' />
        <View style={{flex:0.8, ...Styles.timeLine}}>
        </View>
      </View>

      <Footer navigation={navigation}/>
      <NumberVerificationScreen modalVisible={inputBoxVisible} onDataInput={onDataInput} onModalClose={onModalClose}/>
    </SafeAreaView>
  );
}

export default Client;