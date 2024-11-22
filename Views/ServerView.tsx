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
	video: {
		frameRate: 30,
		facingMode: 'environment'
	}
};

const Server = ({navigation}:any) => {
  //const [remoteStream, setRemoteStream] = useState<MediaStream>(new MediaStream());
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
  
    // 첫 번째 호출을 정확한 시간에 맞추기 위해 setTimeout 사용
    setTimeout(() => {
      if (captureMode) {
        takePicture(); // 함수 호출
      }
  
      // 그 후에는 15분마다 반복 호출
      setInterval(() => {
        if (captureMode)
          takePicture(); // 함수 호출
      }, 15 * 60 * 1000); // 15분 간격
    }, millisecondsUntilNextCall);
  }

  const pc = useRef<RTCPeerConnection | null>(null);

  const SessionDestroy = async () => {
    const offerRef = database().ref(`offers/${userToken}`);
    const answerRef = database().ref(`answers/${userToken}`);
    const candidateRefServer = database().ref(`candidates/${userToken}/server`);
    const candidateRefClient = database().ref(`candidates/${userToken}/client`);
    offerRef.remove();
    answerRef.remove();
    candidateRefServer.remove();
    candidateRefClient.remove();

    if (pc.current !== null) {
      pc.current.onconnectionstatechange = null;
      pc.current.onsignalingstatechange = null;
      pc.current.close();
    }

    console.log(localStream)
    if (localStream !== null) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
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
      if (snapshot.val() != null) {
        if (snapshot.val().flag == 'Destroy') {
          await requestRef.set(null);
          SessionDestroy();
          return;
        }
        if (snapshot.val().flag != 'Requested') {
          return;
        }
        const requestDate = snapshot.val().request;
        const timeGap = new Date().getTime() - new Date(requestDate).getTime()

        //요청이 1분 이상 되었다면 null로 변경
        if (timeGap / 1000 > 60) {
          const requestRef = database().ref(`requests/${userToken}`);
          await requestRef.remove(); // 요청 플래그 설정
          return;
        }
        setCaptureMode(false);
        console.log('accetped');
        await createOffer(salt); // 기존 createOffer 로직 재활용
        await requestRef.set({ request: Date().toString(), flag:'Accepted' }); // 요청 플래그 설정
  
        // 요청 플래그 제거
        await requestRef.set(null);
      }
    });
  
    return requestRef;
  }

  const createOffer = async (salt:string) => {
    pc.current = new RTCPeerConnection(peerConstraints);

    pc.current.ontrack = (event) => {
      /*
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      */
    };
    
    setLocalStream(null);
    const stream = await mediaDevices.getUserMedia(mediaConstraints);
    console.log(stream);
    stream.getTracks().forEach((track) => pc.current?.addTrack(track, stream));
    setLocalStream(stream);
    
    // Create an offer and set it as local description
    const offer = await pc.current.createOffer(sessionConstraints);
    await pc.current.setLocalDescription(offer);

    // Store the offer (SDP) in Firebase
    const offerRef = database().ref(`offers/${userToken}`);
    if (pc.current.localDescription) {
      const rawData:any = {
        sdp:encryptWithSalt(pc.current.localDescription.sdp, salt),
        type:encryptWithSalt(pc.current.localDescription.type, salt)
      }
      offerRef.set({ sdp: rawData });
    } else {
      console.error('Error: Local description is undefined');
    }
    
    const candidateRefServer = database().ref(`candidates/${userToken}/server`);
    try {
      candidateRefServer.remove()
      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          if (pc.current !== null)
            candidateRefServer.push(event.candidate);
        } else {
          console.log("All ICE candidates have been gathered");
        }
      };
    }
    catch (exception) {
      console.log(exception)
    }
    
    const answerRef = database().ref(`answers/${userToken}`);
    try {
      answerRef.remove()
      answerRef.on('child_added', async (snapshot) => {
        const answer = await snapshot.val();
        if (answer != undefined && answer != null) {
          const answerDes = new RTCSessionDescription({
            sdp:decryptWithSalt(answer.sdp, salt),
            type:decryptWithSalt(answer.type, salt),
          });
          console.log('got answer');
          
          if (pc.current !== null)
            await pc.current.setRemoteDescription(answerDes);
        }
      });
    }
    catch (exception) {
      console.log(exception)
    }
    
    const candidateRefClient = database().ref(`candidates/${userToken}/client`);
    try {
      candidateRefClient.remove()
      candidateRefClient.on('child_added', (snapshot) => {
        const candidate = new RTCIceCandidate(snapshot.val());
        if (pc.current !== null)
          pc.current.addIceCandidate(candidate)
        console.log("S : Client candidates read")
      });
    }
    catch (exception) {
      console.log(exception);
    }

    pc.current.addEventListener('connectionstatechange', async event => {
      switch( pc.current?.connectionState ) {
        case 'connected':
          console.log("Worked Normally");
          break;
        case 'closed':
          answerRef.off();
          candidateRefServer.off();
          SessionDestroy();
          return;
        case 'disconnected':
          answerRef.off();
          candidateRefClient.off();
          candidateRefServer.off();
          SessionDestroy();
          return;
        case 'failed':
          answerRef.off();
          candidateRefClient.off();
          candidateRefServer.off();
          SessionDestroy();
          return;
      };
    });

    pc.current.addEventListener('signalingstatechange', async event => {
      switch( pc.current?.signalingState ) {
        case 'closed':
          answerRef.off();
          candidateRefClient.off();
          candidateRefServer.off();
          SessionDestroy();
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
        mirror={true} 
        style={{ flex: 1 }} 
        objectFit={'cover'} />
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