import React, { useEffect, useContext, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import Styles from '../Styles/CommonStyle';
import Footer from '../Components/Footer';
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';

function DiaryView({navigation}: any): JSX.Element {
    const { userToken } = useContext<any>(GlobalContext);
    const scrollRef = useRef<ScrollView | null>(null);
    const [current, setCurrent] = useState<number>(0);

    const handleScroll = (event:any) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        if (yOffset < 0)
            return;
        const cardSize = height * 0.55;
        const page = Math.round(yOffset / cardSize);
        if (page != current)
            scrollRef.current?.scrollTo({y:cardSize*page, x:0, animated:true})
        setCurrent(page)
    }
    useEffect(() => {
        //GetDiary();
    }, []);

    const DairyItem = (index: number) => {
        const innerIndex = index;

        return (
            <View style={{
            opacity: current === innerIndex ? 1 : 0.5, 
            ...localStyles.localDairyContainer}}>
                <View style={localStyles.localDairyCard}>
                    <View style={{flex:1}}>
                        <Image
                            source={{ uri: 'https://example.com/your-image.png' }}
                            style={{marginBottom:16, ...Styles.camImage}}
                        />
                    </View>
                    <View style={{flex:1, justifyContent:'flex-end'}}>
                        <Text style={{marginBottom:5, ...Styles.dairyTitle}}>Diary Entry Title</Text>
                        <Text style={{marginBottom:10, ...Styles.dairyTime}}>{Date().toString()}</Text>
                        <Text style={{...Styles.dairyDescription}}>This is a brief description of the diary entry. It provides an overview of the content within this entry.</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            <ScrollView style={{marginBottom:58, width:"100%"}} ref={scrollRef} onScroll={handleScroll}>
                {/* Header */}
                <Header navigation={navigation} title="Diary" setting={true} />
                {
                    DairyItem(0)
                }                
            </ScrollView>
            <TouchableOpacity 
            onPress={() => {navigation.navigate("DiaryPost")}}
            style={{
                position: 'absolute',
                bottom: 96,
                backgroundColor: '#FE8291',
                width: 40,
                height: 40,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
                alignContent:'center',
            }}>
                <View style={{backgroundColor:'#FFFFFF', position: 'absolute', width:2, height:14}} />
                <View style={{backgroundColor:'#FFFFFF', position: 'absolute', width:14, height:2}} />
            </TouchableOpacity>
            <Footer />
        </SafeAreaView>
    );
}

export default DiaryView;

const { height } = Dimensions.get('window'); // 화면 크기 가져오기
export const localStyles = StyleSheet.create({
    localDairyContainer : {
        backgroundColor:'#FFF7F9',
        borderRadius: 16,
        borderColor:'#FFCFD5',
        borderWidth:1,
        marginLeft:21,
        marginRight:21,
        marginBottom:16,
        height: height * 0.55,
    },
    localDairyCard : {
        margin:12,
        flexDirection: 'column',
        flex:1,
        justifyContent: 'flex-end',
    }
})