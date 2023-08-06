import React, { useState } from 'react';
import { View, Button, SafeAreaView } from 'react-native';
//import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
import { RTCSessionDescription, RTCPeerConnection, mediaDevices, RTCIceCandidate, RTCView } from 'react-native-webrtc';
import {NavigationContainer, NavigationProp,} from '@react-navigation/native'
import {createNativeStackNavigator,} from '@react-navigation/native-stack'

let peerConstraints = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302'
		}
	]
};
let sessionConstraints = {
	mandatory: {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true,
		VoiceActivityDetection: true
	}
};
let mediaConstraints = {
	audio: true,
	video: {
		frameRate: 30,
		facingMode: 'user'
	}
};

const User1 = () => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);


  const createOffer = async () => {
    const pc = new RTCPeerConnection(peerConstraints );

    pc.addEventListener('connectionstatechange', event => {console.log(event)} )
    
    const stream = await mediaDevices.getUserMedia(mediaConstraints);
    setLocalStream(stream);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Create an offer and set it as local description
    const offer = await pc.createOffer(sessionConstraints);
    await pc.setLocalDescription(offer);


    // Store the offer (SDP) in Firebase
    const offerRef = database().ref('offers/user1');
    if (pc.localDescription) {
        offerRef.set({ sdp: pc.localDescription });
      } else {
        console.error('Error: Local description is undefined');
      }

    const answerRef = database().ref('answers/user1');
    answerRef.remove()
    answerRef.on('child_added', (snapshot) => {
      const answer = snapshot.val();
      if (answer != undefined) {
        const answerDes = new RTCSessionDescription({sdp:answer._sdp, type:answer._type});
        pc.setRemoteDescription(answerDes);
      }
    });

    const candidateRef = database().ref('candidates/user1');
    await candidateRef.remove()
    candidateRef.on('child_added', async (snapshot) => {
      const candidate = new RTCIceCandidate(await snapshot.val());
      console.log(candidate)
      console.log("server test")
      console.log("server : " + candidate)
      pc.addIceCandidate(candidate).catch((error) => {
      console.error('Error adding ICE candidate:', error);
      });
    });

    // Listen for remote tracks and add them to the remote stream
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        console.log("Server : test2")
        setRemoteStream(event.streams[0]);
      }
    };
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <Button title="Create Offer" onPress={createOffer} />
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={{ flex: 1 }} />}
      {localStream && <RTCView streamURL={localStream.toURL()} style={{ flex: 1 }} />}
    </SafeAreaView>
  );
};

export default User1;
