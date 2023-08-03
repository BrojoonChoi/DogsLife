import React, { useState } from 'react';
import { View, Button } from 'react-native';
//import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
import { RTCSessionDescription, RTCPeerConnection } from 'react-native-webrtc';
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

const User1 = ({navigation}:any) => {
  const [localStream, setLocalStream] = useState(null);


  const createOffer = async () => {
    const pc = new RTCPeerConnection(peerConstraints );

    // Add your media stream to the connection (e.g., from camera and microphone)
    //const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    //setLocalStream(stream);
    //stream.getTracks().forEach((track) => pc.addTrack(track, stream));

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
    console.log("test2")
    
  };

  return (
    <View key={"test"}>
      <Button title="Create Offer" onPress={createOffer} />
      <Button title="Client" onPress={() => {navigation.navigate('User2')}} />
    </View>
  );
};

export default User1;
