import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import database from '@react-native-firebase/database'
import { RTCSessionDescription, RTCPeerConnection, RTCView } from 'react-native-webrtc';

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

const User2 = () => {
  const [remoteStream, setRemoteStream] = useState(null);

  const readOffer = async () => {
    const offerRef = database().ref('offers/user1');

    // Retrieve the offer (SDP) from Firebase
    const snapshot = await offerRef.once('value');
    const offer = snapshot.val().sdp;

    const pc = new RTCPeerConnection(peerConstraints);

    // Add your media stream to the connection (e.g., from camera and microphone)
    //const stream = await mediaDevices.getUserMedia({ audio: true, video: true });
    //stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Set the remote description (offer)
    console.log("here1")
    const offerDes = new RTCSessionDescription(offer);
    await pc.setRemoteDescription(offerDes);
    console.log("here2")

    // Create an answer and set it as local description
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // Store the answer (SDP) in Firebase
    const answerRef = database().ref('answers/user2');
    answerRef.set({ sdp: pc.localDescription });

    // Listen for ICE candidates and add them to the connection
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidateRef = database().ref('candidates/user2');
        candidateRef.push(event.candidate.toJSON());
      }
    };

    // Listen for remote tracks and add them to the remote stream
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };
  };

  return (
    <View>
      <Button title="Read Offer" onPress={readOffer} />
      {remoteStream && (
        <View style={{ flex: 1 }}>
          {/* Display the remote video stream */}
          <RTCView streamURL={remoteStream.toURL()} style={{ flex: 1 }} />
        </View>
      )}
    </View>
  );
};

export default User2;
