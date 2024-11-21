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
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' }
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
	video: true
};

const Server = ({navigation}:any) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream>(new MediaStream());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [captureMode, setCaptureMode] = useState(true);
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

  function scheduleIntervalFunction() {
    const minutes = new Date().getMinutes();
    const minutesRemainder = minutes % 15; // 15분 간격으로 호출
  
    const millisecondsUntilNextCall = (15 - minutesRemainder) * 60 * 1000;
  
    setInterval(() => {
      if (captureMode)
        takePicture(); // 함수 호출
    }, millisecondsUntilNextCall);
  }

  const SessionDestroy = async (pc:RTCPeerConnection, stream:MediaStream) => {
    pc.close();
    stream.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setCaptureMode(true);
    console.log("Session Destroied");
  }

  useEffect (() => {
    console.log(salt);

    ShowOKCancel("알림", "카메라 설정을 시작합니다.", () => (StartProcess()) )
    const requestRef = AddEventListener();
    
    return () => {
      KeepAwake.deactivate();
      requestRef.off();
    }
  },[])

  const StartProcess = () => {
    KeepAwake.activate();
    ShowNotification(salt, "일상용 핸드폰에 이 번호를 입력하세요.")
    scheduleIntervalFunction();
  }

  const AddEventListener = () => {
    const requestRef = database().ref(`requests/${userToken}`);
  
    // 클라이언트의 요청을 감지
    requestRef.on("value", async (snapshot) => {
      if (snapshot.val()) {
        console.log("Client request received. Creating offer...");
        const requestDate = snapshot.val().request;
        const timeGap = new Date().getTime() - new Date(requestDate).getTime()

        //요청이 1분 이상 되었다면 null로 변경
        if (timeGap / 1000 > 60) {
          const requestRef = database().ref(`requests/${userToken}`);
          await requestRef.set({ request: null }); // 요청 플래그 설정
          return;
        }
        await createOffer(salt); // 기존 createOffer 로직 재활용
  
        // 요청 플래그 제거
        await requestRef.set(null);
      }
    });
  
    return requestRef;
  }  

  const createOffer = async (salt:string) => {
    const pc = new RTCPeerConnection(peerConstraints);

    pc.ontrack = (event) => {
      /*
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      */
    };
    
    let stream = await mediaDevices.getUserMedia(mediaConstraints);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    setLocalStream(stream);
    /*
    localStream?.getTracks().forEach(
      track => track.stop()
    );
    */
    // Create an offer and set it as local description
    const offer = await pc.createOffer(sessionConstraints);
    await pc.setLocalDescription(offer);

    // Store the offer (SDP) in Firebase
    const offerRef = database().ref(`offers/${userToken}`);
    if (pc.localDescription) {
      const rawData:any = {
        sdp:encryptWithSalt(pc.localDescription.sdp, salt),
        type:encryptWithSalt(pc.localDescription.type, salt)
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
      } else {
        console.log("All ICE candidates have been gathered");
      }
    };
    
    const answerRef = database().ref(`answers/${userToken}`);
    answerRef.remove()
    answerRef.on('child_added', async (snapshot) => {
      const answer = await snapshot.val();
      if (answer != undefined) {
        const answerDes = new RTCSessionDescription({
          sdp:decryptWithSalt(answer.sdp, salt),
          type:decryptWithSalt(answer.type, salt),
        });
        await pc.setRemoteDescription(answerDes);
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
          stream = await mediaDevices.getUserMedia(mediaConstraints);
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));
          setLocalStream(stream);
          console.log(localStream);
          break;
        case 'closed':
          stream.getTracks().forEach(
            track => track.stop()
          );
          SessionDestroy(pc, stream);
          return;
        case 'disconnected':
          SessionDestroy(pc, stream);
          return;
        case 'failed':
          SessionDestroy(pc, stream);
          return;
      };
    });

    pc.addEventListener('signalingstatechange', async event => {
      switch( pc.signalingState ) {
        case 'closed':
          SessionDestroy(pc, stream);
          return;
      };
    });
  };

  return (
    <SafeAreaView style={{flex:1}}>
      {
        !captureMode && localStream !== null ?
        <RTCView
        streamURL={localStream.toURL()}
        style={{ flex: 1 }}
        />
        :
        device != null ? 
        <Camera
          style={{flex:1}}
          device={device}
          isActive={captureMode}
          ref={cameraRef}
          photo={captureMode}
        />
        : null
      }
      <Footer navigation={navigation}/>
    </SafeAreaView>
  );
};

export default Server;
/*<Image style={{flex:1}} source={{uri: `data:image/png;base64,${uri}`}}/>*/