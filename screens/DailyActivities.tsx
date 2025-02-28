import React from "react";

import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import COLOURS from "../constants/colours";
import globalStyles from "../constants/styles";
import { PatientRouteProp, ScreenNavigationProp } from "../constants/types";
import ActivityButton from "../components/ActivityButton";

const DailyActivities: React.FC = () => {
    const route = useRoute<PatientRouteProp>();
    const navigation = useNavigation<ScreenNavigationProp>();
    const patient = route.params.patient;

    return (
        <LinearGradient
            style={globalStyles.pageContainer}
            colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>
            <ActivityButton navigation={navigation} patient={patient} activity={"Cooking"} favourited={false} />
            <ActivityButton navigation={navigation} patient={patient} activity={"Dressing"} favourited={false} />
            <ActivityButton navigation={navigation} patient={patient} activity={"Eating"} favourited={false} />
            <ActivityButton navigation={navigation} patient={patient} activity={"Household Chores"} favourited={false} />
            <ActivityButton navigation={navigation} patient={patient} activity={"Washing"} favourited={false} />
        </LinearGradient>
    )
}

export default DailyActivities;