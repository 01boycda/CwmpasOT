import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { ActivitySectionsRouteProp, ScreenNavigationProp } from "../constants/types";
import COLOURS from "../constants/colours";
import FONTSTYLES from "../constants/fontstyles";
import globalStyles from "../constants/styles";
import CustomScrollView from "../components/CustomScrollView";
import GradientButton from "../components/GradientButton";

type SectionProps = {
    label: string;
    value: number;
}

const items: SectionProps[] = [
    { label: "What I Can Do", value: 0 },
    { label: "What I Need Help With", value: 1 },
    { label: "How to Prepare the Space", value: 2 },
    { label: "How to Support Me", value: 3 },
    { label: "Step-by-Step Instructions", value: 4 },
    { label: "Sensory Preferences", value: 5 },
    { label: "Managing Sensory Overload", value: 6 },
    { label: "How to Communicate with Me", value: 7 },
    { label: "Encouraging Me", value: 8 },
    { label: "Ending the Activity", value: 9 },
    { label: "What Comes Next", value: 10 }
];

const ActivitySectionMenu: React.FC = () => {
    const route = useRoute<ActivitySectionsRouteProp>();
    const navigation = useNavigation<ScreenNavigationProp>();

    return (
        <LinearGradient
            style={globalStyles.pageContainer}
            colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>
            <CustomScrollView>
                {items.map(item => {
                    return <GradientButton
                        key={item.label}
                        text={item.label}
                        onPress={() => navigation.navigate("ActivityPage", {
                            patient: route.params.patient,
                            activityName: route.params.activityName,
                            section: item.value
                        })} />
                })}
            </CustomScrollView>
        </LinearGradient>
    );
}

export default ActivitySectionMenu;