import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import * as SQLite from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

import COLOURS from "../constants/colours";
import globalStyles from "../constants/styles";
import { DATABASE_NAME } from "../constants/constantValues";

import { Patient, ScreenNavigationProp } from "../constants/types";

// Custom components
import PatientDirectoryButton from "../components/PatientDirectoryButton";
import CustomScrollView from "../components/CustomScrollView";
import GradientButton from "../components/GradientButton";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

const PatientDirectory: React.FC = () => {
    // Navigation
    const navigation = useNavigation<ScreenNavigationProp>();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [paywallResult, setPaywallResult] = useState<PAYWALL_RESULT>()

    const loadPatientData = async () => {
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        try {
            // Create table if not existing
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS patients (
                    id INTEGER PRIMARY KEY NOT NULL,
                    firstName TEXT NOT NULL,
                    middleNames TEXT,
                    lastName TEXT NOT NULL,
                    dob TEXT NOT NULL,
                    joined TEXT NOT NULL,
                    fScore INTEGER NOT NULL,
                    fLevel TEXT NOT NULL,
                    lastAssessment TEXT NOT NULL,
                    cookingLevel INTEGER NOT NULL,
                    dressingLevel INTEGER NOT NULL,
                    eatingLevel INTEGER NOT NULL,
                    choresLevel INTEGER NOT NULL,
                    washingLevel INTEGER NOT NULL,
                    readingLevel INTEGER NOT NULL,
                    communicationLevel INTEGER NOT NULL,
                    socialisingLevel INTEGER NOT NULL,
                    leisureLevel INTEGER NOT NULL,
                    physicalLevel INTEGER NOT NULL,
                    cognitiveLevel INTEGER NOT NULL,
                    preferredLanguage TEXT,
                    birthplace TEXT,
                    familyBackground TEXT,
                    nicknames TEXT,
                    nicknameOrigin TEXT,
                    father TEXT,
                    mother TEXT,
                    parentsMeet TEXT,
                    siblings INTEGER NOT NULL,
                    siblingsLike TEXT,
                    siblingsRoom TEXT,
                    siblingsMemory TEXT,
                    childhoodLived TEXT,
                    childhoodFriends TEXT,
                    childhoodMemory TEXT,
                    friendsPlay TEXT,
                    school TEXT,
                    favSubject TEXT,
                    favTeacher TEXT,
                    schoolUniform TEXT,
                    schoolMemory TEXT,
                    pets TEXT,
                    petName TEXT,
                    petMemory TEXT,
                    personalValues TEXT,
                    religion TEXT,
                    likeSmell TEXT,
                    likeFood TEXT,
                    likeSeason TEXT,
                    likeSaying TEXT,
                    likeJoke TEXT,
                    likeShow TEXT,
                    likeRadio TEXT,
                    likeMusic TEXT,
                    likeHobby TEXT,
                    likeSport TEXT,
                    likeTime TEXT,
                    dislikeSmell TEXT,
                    dislikeFood TEXT,
                    dislikeSeason TEXT,
                    dislikeShow TEXT,
                    dislikeRadio TEXT,
                    dislikeMusic TEXT,
                    dislikeSport TEXT,
                    dislikeTime TEXT,
                    routineMorning TEXT,
                    routineLunch TEXT,
                    routineAfternoon TEXT,
                    routineEvening TEXT,
                    routineNight TEXT,
                    married INTEGER NOT NULL,
                    marriedWho TEXT,
                    marriedWhen TEXT,
                    marriedAt TEXT,
                    marriedMemory TEXT,
                    partnerWho TEXT,
                    partnerMet TEXT,
                    childrenNames TEXT,
                    childrenNameReasons TEXT,
                    childrenLikeYou TEXT,
                    childrenStories TEXT,
                    childrenActivities TEXT,
                    grandchildrenNames TEXT,
                    grandchildrenLikeYou TEXT,
                    grandchildrenStories TEXT,
                    grandchildrenActivities TEXT,
                    jobFirst TEXT,
                    jobStartAge NUMBER,
                    jobPay TEXT,
                    jobFav TEXT,
                    jobYears NUMBER,
                    jobOthers TEXT,
                    jobMemory TEXT,
                    retiredJob TEXT,
                    retiredYears NUMBER,
                    retiredParty TEXT,
                    retiredFeelings TEXT,
                    retiredDid TEXT,
                    friends TEXT,
                    friendsThen TEXT,
                    friendsMeet TEXT,
                    friendsMemory TEXT,
                    favHobbies TEXT,
                    clubs TEXT,
                    tripFav TEXT,
                    tripWhen TEXT,
                    tripBestPart TEXT,
                    tripWith TEXT,
                    otherTrips TEXT,
                    firstDrink TEXT,
                    firstDate TEXT,
                    firstDance TEXT,
                    firstKiss TEXT,
                    firstLove TEXT,
                    homeFav TEXT,
                    homeBecause TEXT,
                    homeWhat TEXT,
                    homeGarden TEXT,
                    homeDecorate TEXT,
                    traditions TEXT,
                    familyTrip TEXT,
                    pocketMoney NUMBER,
                    newYear TEXT,
                    mealTime TEXT,
                    weekends TEXT,
                    carsPassed NUMBER,
                    carsFirst TEXT,
                    carsFav TEXT,
                    carsPlace TEXT,
                    eventBig TEXT,
                    eventCovid TEXT,
                    eventTowers TEXT,
                    eventBrexit TEXT,
                    eventKennedy TEXT,
                    eventMoon TEXT,
                    eventPhone TEXT,
                    eventBerlin TEXT,
                    eventChernobyl TEXT,
                    eventGulf TEXT);`);

            // Create table if not existing
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS notes (
                    id INTEGER PRIMARY KEY NOT NULL,
                    patient_id INTEGER REFERENCES patients(id),
                    activity TEXT NOT NULL,
                    section NUMBER NOT NULL,
                    note TEXT NOT NULL);`
            );
        } catch (e) {
            console.log("Failed to create new table:\n", e)
        }

        try {
            const patientList = await db.getAllAsync('SELECT * FROM patients') as Patient[];
            setPatients(patientList);
        } catch (e) {
            console.log("Failed to get patient data:\n", e)
        }
        db.closeSync();
    }

    const SubscriptionButton = ({ subscribed }: { subscribed: boolean }) => {
        return (
            <Pressable style={globalStyles.headerButtonContainer} onPress={() => checkSubscriptionStatus(true)}>
                <AntDesign
                    name={subscribed ? "checkcircleo" : "exclamationcircleo"}
                    color={subscribed ? COLOURS.white : "red"}
                    size={30}
                />
            </Pressable>
        )
    }

    const refreshSubscriptionButton = async () => {
        const customerInfo = await Purchases.getCustomerInfo();
        console.log("RC customer:", customerInfo);

        navigation.setOptions({
            headerLeft: () => (<SubscriptionButton
                subscribed={typeof customerInfo.entitlements.active["full_access"] !== "undefined"}
            />)
        });
    }

    const checkSubscriptionStatus = async (showAlert: boolean) => {
        try {
            const result: PAYWALL_RESULT = await RevenueCatUI.presentPaywallIfNeeded({
                requiredEntitlementIdentifier: "full_access",
            });

            if (result === "NOT_PRESENTED" && showAlert) {
                Alert.alert("You Are Subscribed!");
            }

            console.log("Paywall Result:", result);
            setPaywallResult(result);
        } catch (error) {
            if (showAlert) {
                Alert.alert("RC Error");
            }
            console.log("RC Error:", error);
        }
    };

    useEffect(() => { refreshSubscriptionButton(); }, [paywallResult])
    useFocusEffect(
        React.useCallback(() => {
            checkSubscriptionStatus(false);
            loadPatientData();
        }, [])
    );

    return (
        <LinearGradient
            style={globalStyles.pageContainer}
            colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>

            {patients.length > 0 ?

                <CustomScrollView>
                    {patients.sort((a, b) => a.firstName.localeCompare(b.firstName)).map(patient => {
                        return <PatientDirectoryButton key={patient.id} patient={patient} nav={navigation} />
                    })}
                </CustomScrollView>

                :

                <LinearGradient
                    style={[globalStyles.scrollContainer, { padding: 16, justifyContent: "space-between" }]}
                    colors={[COLOURS.textContainerGradBottom, COLOURS.textContainerGradTop, COLOURS.textContainerGradTop, COLOURS.textContainerGradBottom]}
                    locations={[0, 0.2, 0.8, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}>

                    <Text adjustsFontSizeToFit numberOfLines={2} style={[styles.subheaderText, { fontSize: 30 }]}>{"Welcome to the CwmpasOT App!"}</Text>

                    <Text adjustsFontSizeToFit numberOfLines={4} style={[styles.subheaderText, { fontSize: 22 }]}>{"This app acts as an activities guide when supporting individuals living with dementia."}</Text>

                    <View style={{ alignItems: "center" }}>
                        <Text adjustsFontSizeToFit numberOfLines={3} style={[styles.subheaderText, { fontSize: 22 }]}>{"First add the details of the person you are caring for. Press 'Add User' to Continue."}</Text>
                        <FontAwesome5 name="arrow-down" size={60} color={COLOURS.purpleDark} />
                    </View>

                </LinearGradient>
            }

            <View>
                <GradientButton onPress={() => navigation.navigate("AddPatient")} text="Add User" type="selected" />
            </View>
        </LinearGradient>
    )
}

export default PatientDirectory;

const styles = StyleSheet.create({
    subheaderText: {
        color: COLOURS.purpleDark,
        fontWeight: '200',
        fontFamily: 'Roboto-Regular',
        textAlign: "center",
    },
});