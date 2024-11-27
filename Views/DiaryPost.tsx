import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import Styles from '../Styles/CommonStyle';
import PictureIcon from '../Assets/Images/img_diary_picture_icon.svg'
import { launchCamera, launchImageLibrary, CameraOptions, MediaType } from 'react-native-image-picker'

import GlobalContext from '../Components/GlobalContext';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage'

function DiaryPost({navigation}: any): JSX.Element {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const {userToken} = useContext<any>(GlobalContext);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  
  const selectImage = () => {
    const options: CameraOptions = {
      mediaType: 'photo', // 이 값을 MediaType 타입으로 설정
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets ? response.assets[0].uri : null;
        if (uri === undefined)
          return
        setImageUri(uri);
      }
    });
  };

  const handleSave = async () => {
    try {
      if (imageUri === undefined || imageUri === null)
        return;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = storage().ref(`images/${userToken}/${Date().toString()}`);
      await imageRef.put(blob);
      const downloadUrl = await imageRef.getDownloadURL();

      await firestore().collection('diaryEntries').add({
        title,
        content,
        images: downloadUrl,
        createdAt: new Date(),
      });

      Alert.alert('일기가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Error saving diary entry: ', error);
      Alert.alert('일기를 저장하는 중에 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={Styles.camButtonText}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>일기 쓰기</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={Styles.camButtonText}>완료</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Text style={Styles.dairyDescription}>대표 이미지 등록</Text>
        <ScrollView horizontal>
          <View style={styles.imageBox}>
            <TouchableOpacity style={styles.addImageButton} onPress={selectImage}>
              <PictureIcon width={40} height={40}/>
            </TouchableOpacity>
          </View>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.imageBoxSelected} />}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="제목" />
        <View style={{width:'100%', height:1, backgroundColor:'#FF99A0'}}/>
        <TextInput
          style={styles.contentInput}
          placeholder="내용을 입력하세요."
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  header: {
    paddingLeft:21,
    paddingRight:21,
    paddingBottom:13,
    paddingTop:13,
    width:'100%',
    height:60,
    flexDirection: 'row',
    backgroundColor: '#FFF5F7',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText:{
    textAlign:'center',
    textAlignVertical:'center',
    color : "#FF7381",
    fontFamily:"Cafe24Syongsyong",
    fontSize:20,
    letterSpacing:-1.48,
  },
  imageContainer: {
    height:134,
    backgroundColor: '#FFF5F7',
    flexDirection: 'column',
    marginVertical: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft:29,
    paddingBottom:16,
    paddingTop:14,
  },
  imageBox: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderColor:'#FFCFD5',
    backgroundColor:'#FFF7F9',
    borderWidth:1,
    marginRight: 10,
    marginTop:8,
  },
  imageBoxSelected: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderColor:'#FF7381',
    borderWidth:3,
    marginRight: 10,
    marginTop:8,
  },
  addImageButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    paddingLeft:33,
    paddingRight:33,
    paddingTop:16,
  },
  titleInput: {
    fontSize:19,
    fontFamily:"Cafe24Syongsyong",
    textAlign: "left",
    letterSpacing: 0.14,
    color: "#424242",
  },
  contentInput: {
    marginTop:4,
    fontSize:15,
    fontFamily:"Cafe24Syongsyong",
    textAlign: "left",
    letterSpacing: 0.11,
    color: "#616161",
  },
});

export default DiaryPost;
