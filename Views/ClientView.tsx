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
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' }
  ]
};

let mediaConstraints = {
	audio: true,
	video: true
};

const Client = ({navigation}:any) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [askAgain, setAskAgain] = useState(true);
  const {ShowNotification, ShowOKCancel, encryptWithSalt, decryptWithSalt, userToken, storeData, getData} = useContext<any>(GlobalContext)
  const [inputBoxVisible, setInputBoxVisible] = useState(false);
  const [pc, setPc] = useState<RTCPeerConnection | null>(new RTCPeerConnection(peerConstraints));

  const SessionDestroy = async () => {
    pc?.close();
    setPc(new RTCPeerConnection(peerConstraints));
    console.log("disconnected");
  }

  useEffect(() => {
    StartProcess()

    return () => {
      pc?.close();
      setPc(null);
    };
  }, [])

  const AskCameraSetting = () => {
    setAskAgain(false);
    ShowOKCancel("카메라가 없습니다!", "카메라를 설정하러 갈까요?", () => (navigation.navigate("Server")) )
  }

  const StartProcess = async () => {
    await getData("secret").then((result:string) => result !== null ? onDataInput(result) : isFirst());
  }

  const isFirst = async() => {
    const offerRef = firebase.database().ref(`offers/${userToken}`);

    offerRef.on("value", (snap) => {
      if (snap.val() != null) {
        setInputBoxVisible(true)
        return;
      } else {
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
    if (pc === null || pc.connectionState === 'closed') {
      ShowNotification("Something went wrong!")
      return;
    }

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };
    
    const stream = await mediaDevices.getUserMedia(mediaConstraints);
    setLocalStream(stream)
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offerRef = firebase.database().ref(`offers/${userToken}`);
    offerRef.on("value", (snap) => {
      if (snap.val() != null) {
        console.log("C : connected");
      } else {
        console.log("C : not connected");
        AskCameraSetting();
        return;
      }
    })

    try {
      console.log(`salt : ${salt}`)
      const snapshot = await offerRef.once('value')
      const offer = snapshot.val().sdp;
      const offerDes = new RTCSessionDescription({
        sdp:decryptWithSalt(offer.sdp, salt),
        type:decryptWithSalt(offer.type, salt),
      });
      await pc.setRemoteDescription(offerDes);
    } catch (exception) {
      console.log(exception)
      setInputBoxVisible(true);
      return;
    }
    
    // Create an answer and set it as local description
    console.log("create answer")
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    // Listen for ICE candidates and add them to the connection  
    const candidateRefClient = database().ref(`candidates/${userToken}/client`);
    candidateRefClient.remove()
    pc.onicecandidate = (event) => {
      console.log("test")
      if (event.candidate) {
        console.log("C : Client candidates added")
        candidateRefClient.push(event.candidate);
      }
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        offerCandidates.add(event.candidate.toJSON());
      }
    };

    pc.addEventListener('connectionstatechange', () => {
      console.log("Connection State:", pc.connectionState);
    });
    
    pc.addEventListener('signalingstatechange', () => {
      console.log("Signaling State:", pc.signalingState);
    });

    // Store the answer (SDP) in Firebase
    const answerRef = database().ref(`answers/${userToken}`);
    const rawData:any = {
      sdp:encryptWithSalt(pc?.localDescription.sdp, salt),
      type:encryptWithSalt(pc?.localDescription.type, salt)
    }
    await answerRef.set({ sdp: rawData });

    const candidateRefServer = database().ref(`candidates/${userToken}/server`);
    candidateRefServer.on('child_added', (snapshot) => {
      const candidate = new RTCIceCandidate(snapshot.val());
      pc.addIceCandidate(candidate)
      console.log("C : Server candidates read")
    });

    setAskAgain(false);

    pc.addEventListener('icegatheringstatechange', () => {
      console.log("ICE Gathering State:", pc.iceGatheringState);
    });

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
        remoteStream?.getVideoTracks().length > 0 ? 
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