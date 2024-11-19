import React, { useContext, useEffect, useState, useRef } from 'react';
import { SafeAreaView, Platform, Image } from 'react-native';
//import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
import { RTCSessionDescription, RTCPeerConnection, mediaDevices, RTCIceCandidate, RTCView, MediaStream } from 'react-native-webrtc';
import GlobalContext from '../Components/GlobalContext';
import Footer from '../Components/Footer'
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import KeepAwake from 'react-native-keep-awake';

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
	video: {
		frameRate: 30,
		facingMode: 'environment'
	}
};

const Server = ({navigation}:any) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream>(new MediaStream());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [captureMode, setCaptureMode] = useState(true);
  const [pc, setPc] = useState(new RTCPeerConnection(peerConstraints));
  const [uri, setUri] = useState("")
  const cameraRef = useRef<Camera>(null);

  const devices = useCameraDevices();
  const device = devices.back;

  const {ShowNotification, ShowOKCancel, generateSalt, encryptWithSalt, decryptWithSalt, userToken, UploadFile, UploadData} = useContext<any>(GlobalContext)

  const salt = generateSalt();
  /*
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    console.log(`${frame.timestamp}: ${frame.width}x${frame.height} ${frame.pixelFormat} Frame (${frame.orientation})`);
    examplePlugin(frame);
  }, []);
  */
  const takePicture = async () => {
    if (cameraRef.current && captureMode) {
      try {
        const timeStamp = makeDate();
        
        const snapshot = await cameraRef.current.takeSnapshot({
          quality: 80,
          skipMetadata: true,
        })
        UploadFile(`${timeStamp}`, snapshot.path);
        UploadData("timeLine", {title:`${timeStamp}`, text:``});
      } catch (error) {
        console.error('Error while taking picture:', error);
      }
    }
  };

  const makeDate = () => {
    var today = new Date();

    var year = today.getFullYear();
    var month = (today.getMonth() + 1).toString().padStart(2, '0');
    var day = today.getDate().toString().padStart(2, '0');
    var hour = today.getHours().toString().padStart(2, '0');
    var mins = today.getMinutes().toString().padStart(2, '0');
    
    // 형식에 맞게 조합
    var formattedDate = `${year}-${month}-${day} ${hour}:${mins}`
    return formattedDate;
  }

  const scheduledFunction = async () => {
    console.log("Scheduled function called at:", new Date());
    takePicture();
  }
  
  function scheduleIntervalFunction() {
    const minutes = new Date().getMinutes();
    const minutesRemainder = minutes % 15; // 15분 간격으로 호출
  
    const millisecondsUntilNextCall = (15 - minutesRemainder) * 60 * 1000;
  
    setInterval(() => {
      scheduledFunction(); // 함수 호출
    }, millisecondsUntilNextCall);
  }

  const Escaped = () => {
    pc.close();
    KeepAwake.deactivate();
  };

  const SessionDestroy = async () => {
    pc.close();
    setPc(new RTCPeerConnection(peerConstraints));
    /*
    createOffer(salt);
    setCaptureMode(true);
    */
    console.log("Session Destroied");

  }

  useEffect (() => {
    ShowOKCancel("알림", "카메라 설정을 시작합니다.", () => (StartProcess()) )
    return () => Escaped();
  },[])

  const StartProcess = () => {
    KeepAwake.activate();
    ShowNotification(salt, "일상용 핸드폰에 이 번호를 입력하세요.")
    
    //setPc(new RTCPeerConnection(peerConstraints));
    createOffer(salt);
    scheduleIntervalFunction();
  }

  const createOffer = async (salt:string) => {
    pc.ontrack = (event) => {
      /*
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      */
    };

    // Create an offer and set it as local description
    const offer = await pc.createOffer(sessionConstraints);
    await pc.setLocalDescription(offer);
    
    const stream = await mediaDevices.getUserMedia(mediaConstraints);
    setLocalStream(stream);
    
    try {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      localStream?.getTracks().forEach(
        track => track.stop()
      );
    }
    catch {
      console.log("there is no camera.")
    }

    // Store the offer (SDP) in Firebase
    const offerRef = database().ref(`offers/${userToken}`);
    if (pc.localDescription) {
      const rawData:any = {
        _sdp:encryptWithSalt(pc.localDescription._sdp, salt),
        _type:encryptWithSalt(pc.localDescription._type, salt)
      }
      offerRef.set({ sdp: rawData });
    } else {
      console.error('Error: Local description is undefined');
    }
    
    const candidateRefServer = database().ref(`candidates/${userToken}/server`);
    candidateRefServer.remove()
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        candidateRefServer.push(event.candidate);
        console.log("S : Server candidates added")
      }
    };

    const answerRef = database().ref(`answers/${userToken}`);
    answerRef.remove()
    answerRef.on('child_added', async (snapshot) => {
      const answer = await snapshot.val();
      if (answer != undefined) {
        const answerDes = new RTCSessionDescription({
          sdp:decryptWithSalt(answer._sdp, salt),
          type:decryptWithSalt(answer._type, salt),
        });
        await pc.setRemoteDescription(answerDes);
        console.log("S : Got answer")
      }
    });
    
    const candidateRefClient = database().ref(`candidates/${userToken}/client`);
    candidateRefClient.remove()
    candidateRefClient.on('child_added', (snapshot) => {
      const candidate = new RTCIceCandidate(snapshot.val());
      pc.addIceCandidate(candidate)
      console.log("S : Client candidates read")
    });

    pc.addEventListener('connectionstatechange', async event => {
      switch( pc.connectionState ) {
        case 'connected':
          console.log("Worked Normally");
          setCaptureMode(false);
          localStream?.getTracks().forEach(
            track => {
              track.enabled = true;
              track._readyState = "live";
            }
          );
          break;
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
  };

  return (
    <SafeAreaView style={{flex:1}}>
      {
        device != null ? 
        <Camera
          style={{flex:1}}
          device={device}
          isActive={true}
          ref={cameraRef}
          photo={true}
        />
        : null
      }
      <Footer navigation={navigation}/>
    </SafeAreaView>
  );
};

export default Server;
/*<Image style={{flex:1}} source={{uri: `data:image/png;base64,${uri}`}}/>*/