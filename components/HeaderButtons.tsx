import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Activity, ScreenNavigationProp } from '../constants/types';

import COLOURS from "../constants/colours";
import { Patient } from '../constants/types';
import globalStyles from '../constants/styles';


export const BackButton: React.FC = () => {
    const navigation = useNavigation<ScreenNavigationProp>();
    return (
        <TouchableOpacity style={globalStyles.headerButtonContainer} onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={40} color={COLOURS.white} />
        </TouchableOpacity>
    )
}

export const HomeButton: React.FC = () => {
    const navigation = useNavigation<ScreenNavigationProp>();
    return (
        <TouchableOpacity style={globalStyles.headerButtonContainer} onPress={() => navigation.popToTop()}>
            <AntDesign name="home" size={40} color={COLOURS.white} />
        </TouchableOpacity>
    )
}

export const HomeButtonArrow: React.FC = () => {
    const navigation = useNavigation<ScreenNavigationProp>();
    return (
        <TouchableOpacity style={globalStyles.headerButtonContainer} onPress={() => navigation.popToTop()}>
            <AntDesign name="left" size={40} color={COLOURS.white} />
        </TouchableOpacity>
    )
}

export const MemoryBookBackButton: React.FC<{ patient: Patient }> = ({ patient }: { patient: Patient }) => {
    const navigation = useNavigation<ScreenNavigationProp>();

    return (
        <TouchableOpacity style={globalStyles.headerButtonContainer} onPress={() => navigation.popTo("PatientProfile", { patient: patient })}>
            <AntDesign name="left" size={40} color={COLOURS.white} />
        </TouchableOpacity>
    )
}