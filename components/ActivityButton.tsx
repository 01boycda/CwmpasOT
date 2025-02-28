import { createElement } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import COLOURS from "../constants/colours";
import FONTSTYLES from "../constants/fontstyles";
import globalStyles from "../constants/styles";
import { Patient, ScreenNavigationProp } from "../constants/types";

import {
    Entypo,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const LOGO_SIZE = 60;
const LOGO_COLOR = COLOURS.white;

type LogoProps = {
    "Boardgames": React.JSX.Element;
    "Cards": React.JSX.Element;
    "Crosswords": React.JSX.Element;
    "Puzzles": React.JSX.Element;
    "Quizzes": React.JSX.Element;
    "Reading": React.JSX.Element;
    "Wordsearches": React.JSX.Element;
    "Painting": React.JSX.Element;
    "Colouring": React.JSX.Element;
    "Drawing": React.JSX.Element;
    "Knitting & Crochet": React.JSX.Element;
    "Creating Photo Album": React.JSX.Element;
    "Chatting with Family & Friends": React.JSX.Element;
    "Group Activities": React.JSX.Element;
    "Pets": React.JSX.Element;
    "Reminiscence": React.JSX.Element;
    "Listening to Music": React.JSX.Element;
    "Playing Instruments": React.JSX.Element;
    "Singing": React.JSX.Element;
    "Basketball / Netball": React.JSX.Element;
    "Dancing": React.JSX.Element;
    "Football": React.JSX.Element;
    "Gardening": React.JSX.Element;
    "Swimming": React.JSX.Element;
    "Walking": React.JSX.Element;
    "Yoga": React.JSX.Element;
    "Birdwatching": React.JSX.Element;
    "Breathing Exercises / Meditation": React.JSX.Element;
    "Hand Massaging": React.JSX.Element;
}

const logo = {
    "Boardgames": <FontAwesome5 name="chess" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Cards": <MaterialCommunityIcons name="cards-club" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Crosswords": <FontAwesome5 name="pen" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Puzzles": <Foundation name="puzzle" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Quizzes": <MaterialIcons name="quiz" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Reading": <FontAwesome name="book" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Wordsearches": <Entypo name="magnifying-glass" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Painting": <FontAwesome name="paint-brush" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Colouring": <Fontisto name="picture" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Drawing": <FontAwesome name="pencil" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Knitting & Crochet": <FontAwesome5 name="socks" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Creating Photo Album": <Fontisto name="photograph" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Chatting with Family & Friends": <Entypo name="chat" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Group Activities": <FontAwesome name="group" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Pets": <MaterialIcons name="pets" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Reminiscence": <FontAwesome name="newspaper-o" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Listening to Music": <FontAwesome name="music" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Playing Instruments": <FontAwesome5 name="drum" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Singing": <MaterialCommunityIcons name="microphone-variant" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Basketball / Netball": <FontAwesome5 name="basketball-ball" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Dancing": <MaterialCommunityIcons name="human-female-dance" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Football": <Ionicons name="football" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Gardening": <Entypo name="flower" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Swimming": <FontAwesome5 name="swimmer" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Walking": <FontAwesome5 name="walking" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Yoga": <MaterialCommunityIcons name="yoga" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Birdwatching": <MaterialCommunityIcons name="bird" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Breathing Exercises / Meditation": <MaterialCommunityIcons name="meditation" size={LOGO_SIZE} color={LOGO_COLOR} />,
    "Hand Massaging": <FontAwesome6 name="hand" size={LOGO_SIZE} color={LOGO_COLOR} />,
};

const ActivityButton = ({ navigation, patient, activity, favourited }:
    { navigation: ScreenNavigationProp, patient: Patient, activity: string, favourited: boolean }) => {

    return (
        <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate("ActivitySectionMenu", { patient: patient, activityName: activity })}>

            <LinearGradient
                style={[globalStyles.button, { flex: 1 }, favourited && { borderColor: COLOURS.buttonSelectedBorder }]}
                colors={favourited ? [COLOURS.buttonSelectedTop, COLOURS.buttonSelectedBottom] : [COLOURS.buttonTop, COLOURS.buttonBottom]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>
                {logo[activity as keyof LogoProps]}
                <Text style={[FONTSTYLES.buttonText]}>{activity}</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default ActivityButton;