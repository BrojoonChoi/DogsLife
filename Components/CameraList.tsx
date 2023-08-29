import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Styles from '../Styles/CommonStyle';

function CameraList({navigation}:any):JSX.Element
{
  const makeCamera = (number:string) => {
    return (
      <TouchableOpacity style={Styles.camButton} onPress={() => console.log("test")}>
        <Text style={Styles.camButtonText}>{`CAM${number}`}</Text>
      </TouchableOpacity>
    )
  }
  return (
      <View style={{marginBottom:16, justifyContent:"space-between", flexDirection:"row", width:"100%", ...Styles.leftRightPadding}}>
        <View style={{flexDirection:"row", alignItems:"center",}}>
          <Text style={{color:"#FF99A0", fontSize:24, fontFamily:"BMJUA_ttf"}}>CCTV</Text>
        </View>
        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-end", }}>
          {makeCamera("01")}    
        </View>
      </View>
  );
}

export default CameraList