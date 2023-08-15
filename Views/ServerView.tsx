import React, { useEffect, useState } from 'react';
import { View, Button, SafeAreaView } from 'react-native';
//import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
import { RTCSessionDescription, RTCPeerConnection, mediaDevices, RTCIceCandidate, RTCView, MediaStream } from 'react-native-webrtc';
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
	/*mandatory: {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true,
		VoiceActivityDetection: true
	}*/
};
let mediaConstraints = {
	audio: true,
	video: true,
};

const User1 = () => {
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [localStream, setLocalStream] = useState(null);

  const createOffer = async () => {
    const pc = new RTCPeerConnection(peerConstraints);
    
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };

    pc.addEventListener('iceconnectionstatechange', event => {
      console.log(event)
    })
    
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
    
    const candidateRefServer = database().ref('candidates/user1/server');
    candidateRefServer.remove()
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        candidateRefServer.push(event.candidate);
      }
    };

    const answerRef = database().ref('answers/user1');
    answerRef.remove()
    answerRef.on('child_added', async (snapshot) => {
      const answer = snapshot.val();
      if (answer != undefined) {
        const answerDes = new RTCSessionDescription({sdp:answer._sdp, type:answer._type});
        await pc.setRemoteDescription(answerDes);
      }
    });
    
    const candidateRefClient = database().ref('candidates/user1/client');
    candidateRefClient.remove()
    candidateRefClient.on('child_added', (snapshot) => {
      const candidate = new RTCIceCandidate(snapshot.val());
      pc.addIceCandidate(candidate)
    });
  };  

  const buttonNew = () =>
  {
    console.log(remoteStream.getVideoTracks().length)
  }

  return (
    <View style={{flex:1}}>
      <Button title="Create Offer" onPress={createOffer} />
      <Button title="Show data" onPress={buttonNew} />
      {remoteStream.getVideoTracks().length > 0 && <RTCView streamURL={remoteStream.toURL()} mirror={true} style={{ flex: 1 }} />}
      {localStream && <RTCView streamURL={localStream.toURL()} mirror={true} style={{ flex: 1 }} />}
    </View>
  );
};

export default User1;
