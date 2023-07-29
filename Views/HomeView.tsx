import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Styles from '../Styles/CommonStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';

function HomeView({navigation}:any):JSX.Element
{
    const bannerLists = ["test1", "test2", "test3"]
    
    return (
        <SafeAreaView style={Styles.mainBody}>
            <Swiper autoplay showsPagination={true} width={300} height={250} autoplayTimeout={5}>
            {
                bannerLists.map((banner, key) => 
                {
                return (<Text key={'id'+key}>{banner}</Text>)
                }
            )}
            </Swiper>
            <Text>Text</Text>
        </SafeAreaView>
    );
}

export default HomeView