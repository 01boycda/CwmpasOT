import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dimensions, Keyboard, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';

import { useNavigation, useRoute } from "@react-navigation/native";
import DropDownPicker from 'react-native-dropdown-picker';
import * as SQLite from "expo-sqlite";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";

import COLOURS from "../constants/colours";
import FONTSTYLES from "../constants/fontstyles";
import globalStyles from "../constants/styles";
import { DATABASE_NAME, textSize } from "../constants/constantValues";
import { Activity, ActivityRouteProp, Level, Patient, ScreenNavigationProp } from "../constants/types";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../components/GradientButton";

const screenDimensions = Dimensions.get('screen');

const ActivityPage: React.FC = (props: any) => {
    // Navigation settings
    const route = useRoute<ActivityRouteProp>();
    const navigation = useNavigation<ScreenNavigationProp>();
    const patient: Patient = route.params.patient;

    // Load activity data from Json
    const customData = require('../data/activities.json');
    const activity: Activity = customData[route.params.activityName];

    // Dropdown variables
    const [sectionNum, setSectionNum] = useState<number>(route.params.section);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [items, setItems] = useState<{ label: string, value: number }[]>([
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
    ]);

    // Get activity instructions based on patient's answer to relevant functionality question
    const [activityLevel, setActivityLevel] = useState<Level>("Prompting");
    const calculateLevel = () => {
        let score = 0;
        activity.relativeQuestions.forEach(q => {
            score += patient[q as keyof Patient] as number;
        });
        score /= activity.relativeQuestions.length;
        score = Math.round(score);

        switch (score) {
            case 1:
                setActivityLevel("Prompting");
                break;
            case 2:
                setActivityLevel("Some Support");
                break;
            case 3:
                setActivityLevel("Step-by-Step Guidance");
                break;
            default:
                setActivityLevel("Full Assistance");
                break;
        }
    }

    // Setup keyboard avoiding view
    const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

    // Scroll comment section down to bottom when selected
    useEffect(() => { sectionScrollView.current?.scrollToEnd({ animated: true }); }, [keyboardVisible])

    useEffect(() => {
        const keyboardDidShowListener = Platform.OS === "ios" ? Keyboard.addListener('keyboardWillShow', (e) => {setKeyboardVisible(true), setKeyboardHeight(e.endCoordinates.height)}) : Keyboard.addListener('keyboardDidShow', (e) => {setKeyboardVisible(true), setKeyboardHeight(e.endCoordinates.height)});
        const keyboardDidHideListener = Platform.OS === "ios" ? Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false)) : Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        calculateLevel();
        // Cleanup on unmount
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    // Load any notes saved to patient object
    const sectionScrollView = useRef<ScrollView>(null);
    const [currentNotes, setCurrentNotes] = useState<string>("");

    const loadNotes = async () => {
        try {
            const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

            // Create table if not existing
            await db.execAsync(`
                        CREATE TABLE IF NOT EXISTS notes (
                            id INTEGER PRIMARY KEY NOT NULL,
                            patient_id INTEGER REFERENCES patients(id),
                            activity TEXT NOT NULL,
                            section NUMBER NOT NULL,
                            note TEXT NOT NULL);`
            );

            let noteData: { "note": string } | null = await db.getFirstAsync(`SELECT note FROM notes WHERE patient_id = ? AND activity = ? AND section = ?`, patient.id, activity.activityName, sectionNum);

            setCurrentNotes(noteData === null ? "" : noteData.note);
        } catch (e) {
            console.log("Failed to get note data:\n", e)
        }
    }

    // Save activity notes
    const saveNoteData = async (text: string) => {
        // Update database
        try {
            const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
            await db.runAsync('DELETE FROM notes WHERE patient_id = $id AND activity = $act AND section = $section', { $id: patient.id, $act: activity.activityName, $section: sectionNum });
            await db.runAsync(`INSERT INTO notes (note, patient_id, activity, section) VALUES ('${text}', '${patient.id}', '${activity.activityName}', '${sectionNum}');`);

            loadNotes();
        } catch (e) {
            console.log("Unable to save answer:\n", e)
        }
    }

    useEffect(() => { loadNotes(); }, [sectionNum])

    // Comment bubbles
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [infoBox, setInfoBox] = useState<number>(0);
    const ActivityInfoButton = () => {
        return (
            <TouchableOpacity style={globalStyles.headerButtonContainer} onPress={() => setShowInfo(!showInfo)}>
                {showInfo ?
                    <FontAwesome name="close" size={40} color={COLOURS.white} /> :
                    <MaterialCommunityIcons name="chat-question-outline" size={40} color={COLOURS.white} />
                }
            </TouchableOpacity>
        )
    }

    // Setup header buttons
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<ActivityInfoButton />)
        });
        setInfoBox(0);
    }, [showInfo]);

    return (
        <LinearGradient
            style={globalStyles.pageContainer}
            colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>

            {!keyboardVisible && (
                <>
                    <DropDownPicker
                        open={openDropdown}
                        value={sectionNum}
                        items={items}
                        setOpen={setOpenDropdown}
                        setValue={setSectionNum}
                        setItems={setItems}
                        placeholder={"What I Can Do"}

                        style={globalStyles.dropdown}
                        dropDownContainerStyle={globalStyles.dropdownList}
                        selectedItemContainerStyle={globalStyles.dropdownSelected}
                        textStyle={FONTSTYLES.dropdownText}
                        selectedItemLabelStyle={{ color: COLOURS.purpleLighter }}

                        ArrowDownIconComponent={() => <AntDesign name="down" size={30} />}
                        ArrowUpIconComponent={() => <AntDesign name="up" size={30} />}
                        showTickIcon={false}
                    />
                </>
            )}

            <LinearGradient
                style={globalStyles.scrollContainer}
                colors={[COLOURS.textContainerGradBottom, COLOURS.textContainerGradTop, COLOURS.textContainerGradTop, COLOURS.textContainerGradBottom]}
                locations={[0, 0.2, 0.8, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>

                <ScrollView
                    ref={sectionScrollView}
                    contentContainerStyle={globalStyles.scrollContainerContent}

                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    {...props}
                >
                    <Text style={FONTSTYLES.subheaderText}>{activityLevel}</Text>
                    <Text style={FONTSTYLES.textBox}>{activity[activityLevel as keyof Activity][sectionNum]}</Text>
                    <TextInput
                        multiline
                        placeholder="Add additional notes to section..."
                        defaultValue={currentNotes}

                        // Styles
                        style={styles.notesInput}
                        placeholderTextColor={COLOURS.textContainerDark}
                        cursorColor={COLOURS.purpleDark}
                        selectionColor={COLOURS.purpleDark}

                        // Functions
                        onChangeText={text => saveNoteData(text)}
                    />
                </ScrollView>
            </LinearGradient>

            {keyboardVisible ?
                (
                    <View style={Platform.OS === "ios" && { height: keyboardHeight + 55 }}>
                        <GradientButton onPress={Keyboard.dismiss} text="CLOSE" />
                    </View>
                )
                :
                (
                    <Slider
                        style={{ marginHorizontal: 10, height: 40 }}

                        minimumValue={0}
                        maximumValue={10}

                        step={1}
                        value={sectionNum}

                        onSlidingComplete={value => setSectionNum(value)}
                        
                        minimumTrackTintColor={COLOURS.purpleDark}
                        maximumTrackTintColor={COLOURS.purpleLight}
                        thumbTintColor={COLOURS.purpleLighter}
                    />
                )
            }

            <Modal animationType="fade" transparent={true} visible={showInfo} onRequestClose={() => { setShowInfo(!showInfo) }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ height: screenDimensions.height / 10, flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity
                            style={{ height: 80, width: 80, marginTop: 20 }}
                            onPress={() => navigation.goBack()}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ height: 80, width: 80, marginTop: 20 }}
                            onPress={() => setShowInfo(false)}>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: "#B8A2C770" }}>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

                            <TouchableOpacity style={{ position: "absolute", left: Dimensions.get("screen").width / 2 - 20, top: 18 }} onPress={() => setInfoBox(infoBox === 1 ? 0 : 1)}>
                                <View style={globalStyles.infoIconFill} />
                                <MaterialCommunityIcons name="chat-question-outline" size={60} color={COLOURS.purpleDark} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ position: "absolute", right: 60, top: 150 }} onPress={() => setInfoBox(infoBox === 2 ? 0 : 2)}>
                                <View style={globalStyles.infoIconFill} />
                                <MaterialCommunityIcons name="chat-question-outline" size={60} color={COLOURS.purpleDark} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ position: "absolute", right: 60, bottom: 100 }} onPress={() => setInfoBox(infoBox === 3 ? 0 : 3)}>
                                <View style={globalStyles.infoIconFill} />
                                <MaterialCommunityIcons name="chat-question-outline" size={60} color={COLOURS.purpleDark} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ position: "absolute", left: Dimensions.get("screen").width / 2 - 20, bottom: 6 }} onPress={() => setInfoBox(infoBox === 4 ? 0 : 4)}>
                                <View style={globalStyles.infoIconFill} />
                                <MaterialCommunityIcons name="chat-question-outline" size={60} color={COLOURS.purpleDark} />
                            </TouchableOpacity>

                            {infoBox > 0 &&
                                (
                                    <Pressable onTouchEnd={() => setInfoBox(0)} style={globalStyles.infoBox}>
                                        <Text style={FONTSTYLES.textBox}>
                                            {infoBox == 1 && "Use the dropdown box to select Activity Section."}
                                            {infoBox == 2 && "Here is the activity guide tailored to each users function level."}
                                            {infoBox == 3 && "Add users personal preference here."}
                                            {infoBox == 4 && "Quickly navigate between Activity Sections with the Slider."}
                                        </Text>
                                    </Pressable>
                                )
                            }

                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

        </LinearGradient >
    );
}

export default ActivityPage;

export const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    arrowButton: {
        aspectRatio: 1,
        borderColor: COLOURS.purpleDark,
        borderWidth: 4,
        borderRadius: 10,
        backgroundColor: COLOURS.purpleSoft,

        padding: 5,

        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        borderColor: COLOURS.purpleSoft,
        backgroundColor: COLOURS.purpleLight,
    },
    notesInput: {
        minHeight: 200,
        borderColor: COLOURS.textContainerDark,
        borderRadius: 8,
        borderWidth: 2,
        padding: 10,

        color: COLOURS.black,
        fontSize: textSize[1],
        fontFamily: 'arial',
        fontStyle: "italic",

        textAlign: 'left',
        textAlignVertical: "top",
    },
});