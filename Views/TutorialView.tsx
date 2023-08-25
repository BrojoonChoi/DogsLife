import React, { useEffect, } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Styles from '../Styles/CommonStyle';
import Footer from '../Components/Footer'
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';
import Swiper from 'react-native-swiper';

function TutorialView({navigation}:any):JSX.Element
{
    useEffect (() =>
    {
    }, [])

    const renderPagination = (index:any, total:any, context:any) => {
        return (
          <View style={{position:"absolute", bottom:10,}}>
            <Text style={{ color: 'grey' }}>
                text
            </Text>
          </View>
        )
      }
    

    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            {/* margin is footer height + 21(padding) */}
            <ScrollView style={{marginBottom:79, width:"100%"}}>
                {/*Header*/}
                <Header navigation={navigation} title="튜토리얼" setting={false}/>

                {/* main body */}
                <Swiper loop={false} renderPagination={renderPagination} >
                    <View style={Styles.tutorialBox}>
                        <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:13,}}>
                            김튜토리얼
                        </Text>
                    </View>
                    <View style={Styles.tutorialBox}>
                        <Text style={{fontFamily:"AppleSDGothicNeoM", fontSize:13,}}>
                            김튜토리얼
                        </Text>
                    </View>
                </Swiper>

            </ScrollView>

            {/*Footer*/}
        </SafeAreaView>
    );
}

export default TutorialView