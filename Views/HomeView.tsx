import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Styles from '../Styles/CommonStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParam = {
    Home: undefined;
    Test: undefined;
  };

function HomeView():JSX.Element
{
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
    return (
        <View style={Styles.mainBody}>
            <Text>Text</Text>
        </View>
    );
}

export default HomeView