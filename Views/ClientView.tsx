import React, { useState, useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database'
import { RTCSessionDescription, RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, MediaStream } from 'react-native-webrtc';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const User2 = () => {
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [localStream, setLocalStream] = useState(null);

  const readOffer = async () => {
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
    
    // Listen for ICE candidates and add them to the connection  
    const candidateRefClient = database().ref('candidates/user1/client');
    candidateRefClient.remove()
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        candidateRefClient.push(event.candidate);
      }
    };

    // Store the answer (SDP) in Firebase
    const answerRef = database().ref('answers/user1');
    await answerRef.set({ sdp: pc.localDescription });

    const candidateRefServer = database().ref('candidates/user1/server');
    candidateRefServer.on('child_added', (snapshot) => {
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
      <Button title="Read Offer" onPress={readOffer} />
      <Button title="Show data" onPress={buttonNew} />
      {remoteStream.getVideoTracks().length > 0 && <RTCView streamURL={remoteStream.toURL()} mirror={true} style={{ flex: 1 }} />}
      {localStream && <RTCView streamURL={localStream.toURL()} mirror={true} style={{ flex: 1 }} />}
    </View>
  );
};

export default User2;
