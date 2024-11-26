import React, { useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Styles from '../Styles/CommonStyle';
import Footer from '../Components/Footer';
import GlobalContext from '../Components/GlobalContext';
import Header from '../Components/Header';

function DiaryView({navigation}: any): JSX.Element {
    const { userToken } = useContext<any>(GlobalContext);

    useEffect(() => {
        //GetDiary();
    }, []);

    const DairyItem = () => {
        return (
            <View style={Styles.dairyContainer}>
                <View style={Styles.dairyCard}>
                    <Image
                        source={{ uri: 'https://example.com/your-image.png' }}
                        style={{marginBottom:16, ...Styles.camImage}}
                    />
                    <Text style={{marginBottom:5, ...Styles.dairyTitle}}>Diary Entry Title</Text>
                    <Text style={{marginBottom:10, ...Styles.dairyTime}}>{Date().toString()}</Text>
                    <Text style={{...Styles.dairyDescription}}>This is a brief description of the diary entry. It provides an overview of the content within this entry.</Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{backgroundColor:"#FFFFFF", justifyContent:'flex-start', ...Styles.mainBody}}>
            <ScrollView style={{marginBottom:58, width:"100%"}}>
                {/* Header */}
                <Header navigation={navigation} title="Diary" setting={true} />
                {
                    DairyItem()
                }
                {
                    DairyItem()
                }
                {
                    DairyItem()
                }
                {
                    DairyItem()
                }
                {/* Main Body */}
                
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
}

export default DiaryView;
