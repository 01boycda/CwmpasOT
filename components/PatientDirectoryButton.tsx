import React from "react";
import { Text, TouchableOpacity } from "react-native";

import COLOURS from "../constants/colours";

import { Patient, ScreenNavigationProp } from "../constants/types";
import globalStyles from "../constants/styles";
import FONTSTYLES from "../constants/fontstyles";
import { LinearGradient } from "expo-linear-gradient";

const PatientDirectoryButton = ({ patient, nav }: { patient: Patient, nav: ScreenNavigationProp }) => {
    return (

        <TouchableOpacity onPress={() => { nav.navigate("PatientProfile", { patient: patient }) }}>
            <LinearGradient
                style={[globalStyles.button]}
                colors={[COLOURS.buttonTop, COLOURS.buttonBottom]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>
                <Text style={FONTSTYLES.screenHeaderText}>{patient.firstName} {patient.lastName}</Text>

                <Text style={[
                    FONTSTYLES.buttonText,
                    { textAlign: "center" },
                    patient.fLevel === "Finish Assessment" && { color: COLOURS.yellowlight },
                ]}>
                    {patient.fLevel}
                </Text>

            </LinearGradient>
        </TouchableOpacity >
    )
}

export default PatientDirectoryButton;