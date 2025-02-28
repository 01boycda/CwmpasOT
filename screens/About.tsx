import React from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

import COLOURS from "../constants/colours";
import FONTSTYLES from "../constants/fontstyles";
import globalStyles from "../constants/styles";
import { BORDER_WIDTH } from "../constants/constantValues";

const About = () => {

    return (

        <LinearGradient
            style={[globalStyles.pageContainer, { padding: 0 }]}
            colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>
            <ScrollView
                contentContainerStyle={{ padding: 16, justifyContent: "space-around" }}
                overScrollMode="never" >
                <Image
                    style={styles.banner}
                    source={require("./../assets/cwmpas-banner.png")}
                />

                    <LinearGradient
                        style={[globalStyles.scrollContainer, globalStyles.scrollContainerContent]}
                        colors={[COLOURS.textContainerGradBottom, COLOURS.textContainerGradTop, COLOURS.textContainerGradTop, COLOURS.textContainerGradBottom]}
                        locations={[0, 0.2, 0.8, 1]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}>
                        <Text style={FONTSTYLES.textBox}>
                            Savanna and Lauren, founders of CwmpasOT, created this app to enhance the lives of people living with Dementia.
                            Inspired by their work on a dementia ward, they saw the need for person-centred care that adapts to each
                            individual’s needs.
                        </Text>
                        <Text style={FONTSTYLES.textBox}>
                            Their app helps families and caregivers understand the best ways to support someone based on
                            their function level and stage of Dementia, with the goal of improving care and making daily life more
                            meaningful.
                        </Text>
                    </LinearGradient>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => { Linking.openURL('https://www.facebook.com/profile.php?id=100091770139042') }}>
                        <View style={styles.iconFill} />
                        <AntDesign name="facebook-square" color={COLOURS.buttonBottom} size={70} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { Linking.openURL('https://www.cwmpasot.org/') }}>
                        <View style={styles.iconWebFill} />
                        <MaterialCommunityIcons name="web" color={COLOURS.buttonBottom} size={70} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { Linking.openURL('https://www.linkedin.com/in/cwmpasot-community-interested-company-036133304/') }}>
                        <View style={styles.iconFill} />
                        <AntDesign name="linkedin-square" color={COLOURS.buttonBottom} size={70} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { Linking.openURL('https://twitter.com/CwmpasOT') }}>
                        <View style={styles.iconXFill} />
                        <FontAwesome6 name="square-x-twitter" color={COLOURS.buttonBottom} size={70} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default About;

const styles = StyleSheet.create({
    banner: {
        backgroundColor: COLOURS.white,
        borderColor: COLOURS.purpleDark,
        borderRadius: 10,
        borderWidth: BORDER_WIDTH,

        height: 100,
        width: '100%',

        marginBottom: 16,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 16,
    },
    webButton: {
        flex: 1,
    },
    iconFill: {
        borderRadius: 8,
        borderWidth: 4,

        backgroundColor: COLOURS.white,
        position: "absolute",

        left: 1,
        top: 1,

        height: 68.5,
        width: 68,
    },
    iconWebFill: {
        borderRadius: 34,
        borderWidth: 4,

        backgroundColor: COLOURS.white,
        position: "absolute",

        left: 3,
        top: 3,

        height: 64.5,
        width: 64.5,
    },
    iconXFill: {
        borderRadius: 13,
        borderWidth: 4,

        backgroundColor: COLOURS.white,
        position: "absolute",

        top: 3,
        left: -4,

        height: 68,
        width: 68.5,
    }
})