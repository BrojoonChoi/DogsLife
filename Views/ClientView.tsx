import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database'
import { RTCSessionDescription, RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const User2 = () => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  const readOffer = async () => {
    const pc = new RTCPeerConnection(peerConstraints);

    pc.addEventListener('connectionstatechange', event => {console.log(event)} )
    
    const stream = await mediaDevices.getUserMedia(mediaConstraints);
    setLocalStream(stream)
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offerRef = firebase.database().ref('offers/user1');
    const snapshot = await offerRef.once('value');
    const offer = snapshot.val().sdp;
    const offerDes = new RTCSessionDescription({sdp:offer._sdp, type:offer._type});
    await pc.setRemoteDescription(offerDes);

    // Create an answer and set it as local description
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    

    // Store the answer (SDP) in Firebase
    const answerRef = database().ref('answers/user1');
    answerRef.set({ sdp: pc.localDescription });

    // Listen for ICE candidates and add them to the connection
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("client test")
        console.log(event.candidate)
        const candidateRef = database().ref('candidates/user1');
        candidateRef.push(event.candidate.toJSON());
      }
    };

    // Listen for remote tracks and add them to the remote stream
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        console.log("Client : test2")
        setRemoteStream(event.streams[0]);
      }
    };
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <Button title="Read Offer" onPress={readOffer} />
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={{ flex: 1 }} />}
      {localStream && <RTCView streamURL={localStream.toURL()} style={{ flex: 1 }} />}
    </SafeAreaView>
  );
};

export default User2;
