import firebase from '@react-native-firebase/app'
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBny7zuFlGUdjVokhr0SVDBjCIE6RJ76Rk",
    authDomain: "dogs-5344e.firebaseapp.com",
    projectId: "dogs-5344e",
    storageBucket: "dogs-5344e.appspot.com",
    messagingSenderId: "21242744532",
    appId: "1:21242744532:web:f875a98f44a81e607cb541",
    measurementId: "G-4GN4G7K6CC"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);

  const googleSigninConfigure = () => {
    GoogleSignin.configure({
      webClientId:
        '21242744532-12ub15j2cmahc6bau6bp7jrmp876nv55.apps.googleusercontent.com',
    })
  }