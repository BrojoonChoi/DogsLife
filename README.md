# DogsLife(강아지의 하루, 반려동물 CCTV 앱)

React.native project.

Implementing CCTV app by using WebRTC and Firebase.

WebRTC issues tokens and uploads in Firebase.

Also, by using Firebase event, the receiver can receive tokens.

다국어 지원 및 클라우드 서비스 연동, WebRTC 사용, 안드로이드 및 iOS 지원.
React.Native 및 TypeScript, Firebase로 개발 되었음.

## App
> App.tsx > LoadingView.tsx > LoginView.tsx > HomeView.tsx 순으로 이동된다.

```TypeScript
const firebaseConfig = {
  apiKey: "AIzaSyBny7zuFlGUdjVokhr0SVDBjCIE6RJ76Rk",
  authDomain: "dogs-5344e.firebaseapp.com",
  databaseURL: "https://dogs-5344e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dogs-5344e",
  storageBucket: "dogs-5344e.appspot.com",
  messagingSenderId: "21242744532",
  appId: "1:21242744532:web:f875a98f44a81e607cb541",
  measurementId: "G-4GN4G7K6CC"
};
const googleSigninConfigure = () => GoogleSignin.configure({webClientId:'21242744532-tpjf2a06f38c0p4kq3c3gqvc9bntqtrj.apps.googleusercontent.com',})
const Stack = createNativeStackNavigator();
firebase.initializeApp(firebaseConfig);

function App(): JSX.Element {
  useEffect(() => {
    googleSigninConfigure();
  },[])
  
  return (
    <NavigationContainer>
      <GlobalContextProvider>
        <Stack.Navigator initialRouteName='Loading' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Loading' component={LoadingView}/>
          <Stack.Screen name='Login' component={LoginView}/>
          <Stack.Screen name='Home' component={HomeView}/>
          <Stack.Screen name='Client' component={ClientView}/>
          <Stack.Screen name='Server' component={ServerView}/>
          <Stack.Screen name='Setting' component={SettingView}/>
          <Stack.Screen name='Tutorial' component={TutorialView}/>
          <Stack.Screen name='Diary' component={DiaryView}/>
        </Stack.Navigator>
        <ModalNotification />
        <ModalOKCancel />
      </GlobalContextProvider>
    </NavigationContainer>
  );
}
export default App;
```

파이어베이스 설정과 DOM Routing 정보를 정의한다. 공통으로 사용되는 Modal들은 여기서 전역으로 정의되어 어느 화면에서든 호출할 수 있다.

## Loading

필요한 권한을 확인하고, 요청, 파이어베이스에서 배너 이미지 등을 가져온다.


## Login
<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/0fe9a375-ece5-45f7-8256-180e6b4ee86e" width="300"/>

로그인 화면

<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/c35b88dd-907f-4c5c-a979-9c8548f32336" width="300"/>

최초 실행 시 카메라 권한 요청

<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/732416e5-eceb-4b81-a508-00a9b9910590" width="300"/>

구글 로그인 구현, 파이어베이스를 통해 OAuth 2.0 인증을 한다.

```import GlobalContext from '../Components/GlobalContext';```
글로벌 컨텍스트로 로그인 정보를 관리하고 있다. Recoil이나 Redux로 리팩터링 예정이다.

```TypeScript
    const onGoogleButtonPress = async () => {
        try 
        {
            //await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            auth().signInWithCredential(googleCredential);
            await storeData("login", "google");
            navigation.reset({routes: [{name: 'Loading'}]})
        }
        catch(e)
        {
            Alert.alert(e + "\n에러가 발생했습니다.")
        }
    }
```

구글 로그인 구현 함수. 애플 로그인 역시 같은 방식으로 지원되며, 카카오 로그인은 아직 구현되지 않았다.

## Tutorial

<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/6568f211-4a18-4373-9aa7-2ec90b849828" width="200"/>
<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/9caef52e-14ee-431a-ae10-5b42d5910fe6" width="200"/>
<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/21ee4e25-e131-4ba1-8397-728c95b27f0e" width="200"/>

처음 실행 시 튜토리얼 실행
DogsLife/Language/kor.tsx 파일에서 데이터를 읽어온다.
다른 언어를 설정하고 싶다면 파일을 추가하는 방식으로, 다국어 지원을 할 수 있다.

```TypeScript
    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            {/* margin is footer height + 21(padding) */}
                {/*Header*/}
                <Header navigation={navigation} title="튜토리얼" setting={false}/>

                {/* main body */}
                <View style={{height:473, marginBottom:10,}}>
                    <ScrollView horizontal={true} ref={scrollRef}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                        {script("Tutorial").map((item:any, key:any) => {return (
                            <View style={{width:GlobalWidth}} key={`myKey${key}`}>
                                <View style={Styles.tutorialBox}>
                                    {item}
                                </View>
                            </View>
                        )})}
                    </ScrollView>
                </View>
                {CustomPagination()}
                {CustumButton()}
            {/*Footer*/}
        </SafeAreaView>
    );
```

스크롤뷰로 구현되어 있어 이전, 다음 버튼 외에도 터치, 드래그를 통해 다음 내용을 확인할 수 있다.

## Home

<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/8100fc79-2211-4e7a-ace8-85002979331c" width="300"/>

배너는 시간 단위로 자동으로 우측으로 스크롤 된다.
배너 이미지는 파이어베이스에 저장되어 있으며, 배너 파일을 다운로드 받아 저장하여 캐시처럼 사용한다.
저장 만료 기한은 구현되지 않아 앱 용량이 증가할 수 있다.

```TypeScript
//Views/HomeView.tsx
    const DownloadTimeline = async() => {
        if (userToken == null) return;
        const firebasePath:any = [];
        const titleAndText = database().ref(`data/${userToken}/timeLine/`);
        
        await titleAndText.limitToLast(5).once("value")
        .then(async (snap) => {
            const data = await snap.val();
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const item = data[key];

                    const path = item.title;
                    const tempPath = await GetCachePath(`timeline/${path}`);
                    let tempResult;
                    try {
                        await CheckCacheFile(tempPath) ? 
                        tempResult = tempPath :
                        await storage().ref(`${userToken}/${path}`).getDownloadURL().then((url) => SaveCacheFile(url, tempPath)).then(tempResult = tempPath)
                    }catch (exception) {
                        console.log("test : " + tempPath)
                    }

                    const pushedResult = {...item, image:tempResult};
                    firebasePath.push(pushedResult);
                }
              }
        });

        //return imageList
        if (firebasePath.length == 0) return undefined;
        return firebasePath;
    }
```

하단에 있는 타임라인 역시 파이어베이스에서 데이터를 가져온다.

## CCTV Setting
### 송신자
> Views/ServerView.tsx 파일 참조
<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/12f8ab41-68ee-48b3-940a-d42226745b5b" width="300"/>

송신자가 없을 경우 처음 실행한 기기에 송신자 역할을 제안한다.

<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/0cfd2ffb-c9c6-4bac-8b5f-fdd68ab87215" width="300"/>

무작위 숫자 4개를 생성하여 암호로 사용한다. 이 암호를 salt로 사용하여 ```sdp:decryptWithSalt(answer._sdp, salt)```을 호출하여 offer 및 answer를 암호화/복호화 한다.

```TypeScript
//Views/ServerView.tsx
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
```

송신측의 Constraints 설정 부분.

```TypeScript
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [localStream, setLocalStream] = useState(null);
  const [captureMode, setCaptureMode] = useState(true);
  const [pc, setPc] = useState(new RTCPeerConnection(peerConstraints));
  const [uri, setUri] = useState("")
  const cameraRef = useRef<Camera>(null);
```

이벤트 처리가 완료된 후 State를 변경하도록 구현하였다. 처음 let같은 변수로 구현하자 비동기 호출에 의해 시스템이 의도하지 않은 순서대로 호출 되었었다.

```TypeScript
  const takePicture = async () => {
    if (cameraRef.current && captureMode) {
      try {
        const timeStamp = makeDate();
        console.log(timeStamp)
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
//중략
  const scheduledFunction = async () => {
    console.log("Scheduled function called at:", new Date());
    takePicture();
  }
  
  function scheduleIntervalFunction() {
    const minutes = new Date().getMinutes();
    const minutesRemainder = minutes % 15; // 15분 간격으로 호출
  
    const millisecondsUntilNextCall = (15 - minutesRemainder) * 60 * 1000;
    console.log(millisecondsUntilNextCall);
  
    setInterval(() => {
      scheduledFunction(); // 함수 호출
    }, millisecondsUntilNextCall);
  }
```

15분 간격으로 사진을 찍어 파이어베이스에 저장한다. 이 내용을 가져와 Home의 타임라인을 만든다.

```TypeScript
  const SessionDestroy = async () => {
    pc.close();
    setPc(new RTCPeerConnection(peerConstraints));
    createOffer(salt);
    setCaptureMode(true);
    console.log("disconnected");
    KeepAwake.deactivate();
  }
```

수신자 측의 연결이 끊어질 경우 세션을 파괴하고 새로 구성한다.
세션을 다시 구성하는 부분에서 현재 버그가 있다.

```TypeScript
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
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    localStream.getTracks().forEach(
      track => track.stop()
    );

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
      }
    });
    
    const candidateRefClient = database().ref(`candidates/${userToken}/client`);
    candidateRefClient.remove()
    candidateRefClient.on('child_added', (snapshot) => {
      const candidate = new RTCIceCandidate(snapshot.val());
      pc.addIceCandidate(candidate)
    });

    pc.addEventListener('connectionstatechange', async event => {
      switch( pc.connectionState ) {
        case 'connected':
          console.log("coonected");
          setCaptureMode(false);
          localStream.getTracks().forEach(
            track => {
              track.enable = true;
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
```

송신자 측에서 offer를 만드는 코드.
offer -> answer -> ICE candidates 공유 순으로 이벤트가 일어난다. 각 정보의 교환은 파이어베이스 상에서 NoSQL 기반으로 일어나게 된다.

```TypeScript
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
```

발신 중인 화면 표시

### 수신자 화면
> Views/ClientView.tsx 파일 참조
<img src="https://github.com/BrojoonChoi/DogsLife/assets/113426426/9f82089a-115a-4712-be7f-7f387377a181" width="300"/>

암호를 입력하면 연결이 되어 WebRTC 기반으로 CCTV를 볼 수 있게 된다.

코드는 기본적으로 ServerView.tsx와 아주 유사하나, 용도가 다르기 때문에 2개로 분할하였다.
