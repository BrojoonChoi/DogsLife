import { FirebaseDatabaseTypes, firebase } from "@react-native-firebase/database";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, Alert } from 'react-native';

const ExceptionHandler = (e : any) =>
{
    Alert.alert(e + "\n에러가 발생했습니다.");
    console.log(e);
}

export default ExceptionHandler