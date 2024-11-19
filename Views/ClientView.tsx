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
  const [remoteStream, setRemoteStream] = useState<MediaStream>(new MediaStream());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [askAgain, setAskAgain] = useState(true);
  const {ShowNotification, ShowOKCancel, encryptWithSalt, decryptWithSalt, userToken, storeData, getData} = useContext<any>(GlobalContext)
  const [inputBoxVisible, setInputBoxVisible] = useState(false);
  const [pc, setPc] = useState<RTCPeerConnection>(new RTCPeerConnection(peerConstraints));

  const SessionDestroy = async () => {
    pc.close();
    setPc(new RTCPeerConnection(peerConstraints));
    console.log("disconnected");
  }
  
  const Escaped = () => {
    SessionDestroy();
  };

  useEffect(() => {
    StartProcess();
    return () => Escaped();
  }, [])

  const AskCameraSetting = () => {
    setAskAgain(false);
    ShowOKCancel("카메라가 없습니다!", "카메라를 설정하러 갈까요?", () => (navigation.navigate("Server")) )
  }

  const StartProcess = async () => {
    await getData("secret").then((result:string) => result !== null ? onDataInput(result) : isFirst());
  }

  const isFirst = async() => {
    console.log("here")
    const offerRef = firebase.database().ref(`offers/${userToken}`);

    console.log("there")
    offerRef.on("value", (snap) => {
      if (snap.val() != null) {
        console.log("connected");
        setInputBoxVisible(true)
        return;
      } else {
        console.log("not connected");
        AskCameraSetting();
        return;
      }
    })
  }

  const onDataInput = (salt:string) => {
    setInputBoxVisible(false);
    storeData("secret", salt)
    readOffer(salt);
  }

  const onModalClose = () => {
    setInputBoxVisible(false)
  }

  const readOffer = async (salt:string) => {
    

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };
    
    const stream = await mediaDevices.getUserMedia(mediaConstraints);
    setLocalStream(stream)
    //stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offerRef = firebase.database().ref(`offers/${userToken}`);

    offerRef.on("value", (snap) => {
      if (snap.val() != null) {
        console.log("connected");
      } else {
        console.log("not connected");
        AskCameraSetting();
        return;
      }
    })

    try {
      const snapshot = await offerRef.once('value')
      const offer = snapshot.val().sdp;
      const offerDes = new RTCSessionDescription({
        sdp:decryptWithSalt(offer._sdp, salt),
        type:decryptWithSalt(offer._type, salt),
      });
      await pc.setRemoteDescription(offerDes);
    } catch {
      setInputBoxVisible(true);
      pc?.close();
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

    pc.addEventListener('connectionstatechange', async event => {
      switch( pc.connectionState ) {
        case 'closed':
          SessionDestroy();
          return;
        case 'disconnected':
          SessionDestroy();
          return;
        case 'failed':
          SessionDestroy();
          return;
      };
    });

    pc.addEventListener( 'signalingstatechange', async event => {
      switch( pc.signalingState ) {
        case 'closed':
          SessionDestroy();
          return;
      };
    });
  }

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