import React, { useEffect, useRef, useState } from "react";
import { ColorValue, Keyboard, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import * as SQLite from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import { BORDER_WIDTH, DATABASE_NAME, INPUT_PLACEHOLDER, textSize } from "../constants/constantValues";

import COLOURS from "../constants/colours";
import FONTSTYLES from "../constants/fontstyles";
import globalStyles from "../constants/styles";

import { Patient, PatientRouteProp, ScreenNavigationProp } from "../constants/types";
import { MemoryBookBackButton } from "../components/HeaderButtons";
import GradientButton from "../components/GradientButton";
import DatePicker from "../components/DatePicker";

const PatientInfo = () => {
    const route = useRoute<PatientRouteProp>();
    const navigation = useNavigation<ScreenNavigationProp>();
    const [patient, setPatient] = useState<Patient>(route.params.patient);

    // Name Input Vars
    const [firstName, setFirstName] = useState<string>(patient.firstName);
    const [middleNames, setMiddleNames] = useState<string>(patient.middleNames ? patient.middleNames : "");
    const [lastName, setLastName] = useState<string>(patient.lastName);

    // Date Picker Vars
    const [dob, setDob] = useState<string>(patient.dob);
    const [date, setDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState<boolean>(false);

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    }

    const onChange = (event: DateTimePickerEvent, selectedDate: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
            setDob(selectedDate.toLocaleDateString());
            toggleDatePicker();
        } else {
            toggleDatePicker();
        }
    };

    // Functionality Test
    const retakeTest = () => {
        navigation.navigate("FunctionalityTest", { patient: patient });
    }

    const ActivitySection = ({ category, colour }: { category: string, colour: ColorValue }) => {
        const key = `${category}Level` as keyof Patient;
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colour, borderRadius: 8, paddingHorizontal: 10, flex: 0.5 }}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.functionalitySection}>{category.charAt(0).toUpperCase() + category.slice(1)}:</Text>
                <Text style={styles.functionalitySection}>{patient[key]}</Text>
            </View>
        );
    }

    // Edit profile
    const pageRef = useRef<ScrollView>(null);
    const [editEnabled, setEditEnabled] = useState<boolean>(false);

    const openEditing = () => {
        pageRef.current?.scrollTo({ y: 0, animated: true });
        setEditEnabled(true);
    }

    const saveProfile = async () => {
        try {
            const db: SQLite.SQLiteDatabase = await SQLite.openDatabaseAsync(DATABASE_NAME);
            await db.runAsync(`UPDATE patients SET firstName = ? WHERE id = ?`, firstName, patient.id);
            await db.runAsync(`UPDATE patients SET middleNames = ? WHERE id = ?`, middleNames, patient.id);
            await db.runAsync(`UPDATE patients SET lastName = ? WHERE id = ?`, lastName, patient.id);
            await db.runAsync(`UPDATE patients SET dob = ? WHERE id = ?`, dob, patient.id);
        } catch (e) {
            console.log("Unable to update profile:\n", e)
        }

        setPatient((prev) => ({
            ...prev,
            firstName: firstName,
            middleNames: middleNames,
            lastName: lastName,
            dob: dob
        }));

        setEditEnabled(false);
    }

    // Delete patient
    const [deleting, setDeleting] = useState<boolean>(false);

    const deletePatient = async () => {
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        await db.runAsync('DELETE FROM patients WHERE id = $value', { $value: patient.id });

        navigation.popToTop();
    }

    // Setup keyboard spacer
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (<MemoryBookBackButton patient={patient} />),
        });
    }, [patient]);

    const Divider = (props: any) => {
        if (editEnabled) return;

        return (
            <View style={{
                borderColor: COLOURS.purpleSoft,
                borderRadius: 4,
                borderWidth: 4,
                margin: 6,
            }} />
        )
    }

    return (
        <LinearGradient
            style={[globalStyles.pageContainer, { padding: 0 }]}
            colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16, rowGap: 6 }} ref={pageRef}>

                <Text style={FONTSTYLES.inputHeaderText}>First Name</Text>
                <TextInput
                    editable={editEnabled}
                    style={globalStyles.input}
                    returnKeyType="done"
                    value={firstName}
                    onChangeText={setFirstName}
                    cursorColor={COLOURS.purpleDark}
                    selectionColor={COLOURS.purpleDark}
                />

                {(editEnabled || middleNames) && (
                    <>
                        <Text style={FONTSTYLES.inputHeaderText}>Middle Names</Text>
                        <TextInput
                            style={globalStyles.input}
                            returnKeyType="done"
                            placeholder={INPUT_PLACEHOLDER}
                            placeholderTextColor={COLOURS.purpleSoft}
                            value={middleNames}
                            onChangeText={setMiddleNames}
                            cursorColor={COLOURS.purpleDark}
                            selectionColor={COLOURS.purpleDark}
                        />
                    </>
                )}

                <Text style={FONTSTYLES.inputHeaderText}>Last Name</Text>
                <TextInput
                    editable={editEnabled}
                    style={globalStyles.input}
                    returnKeyType="done"
                    value={lastName}
                    onChangeText={setLastName}
                    cursorColor={COLOURS.purpleDark}
                    selectionColor={COLOURS.purpleDark}
                />

                <Text style={FONTSTYLES.inputHeaderText}>Date of Birth</Text>
                <Pressable
                    disabled={!editEnabled}
                    style={globalStyles.input}
                    onPress={toggleDatePicker}
                >
                    <Text style={{
                        fontSize: textSize[3],
                        fontFamily: 'Roboto-Bold',
                        textAlign: 'center',
                        color: COLOURS.purpleDark
                    }}>{dob}</Text>
                </Pressable>

                <Divider />

                {!editEnabled && patient.fLevel === "Finish Assessment" && (
                    <TouchableOpacity
                        onPress={retakeTest}
                        style={globalStyles.button}>
                        <Text style={[FONTSTYLES.buttonText, { color: COLOURS.yellowlight }]}>Finish Test</Text>
                    </TouchableOpacity>
                )}

                {!editEnabled && patient.fLevel !== "Finish Assessment" && (
                    <View style={{ rowGap: 10 }}>
                        <Text style={FONTSTYLES.inputHeaderText}>Functionality Level</Text>
                        <View style={styles.fBarContainer}>
                            <View style={[styles.fBar, { width: `${100 - patient.fScore * 3.333}%` }]} />
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", height: 28 - BORDER_WIDTH }}>
                                <View style={styles.fDivider} />
                                <View style={styles.fDivider} />
                                <View style={styles.fDivider} />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.fSectionDesc}>Full Assistance</Text>
                            <Text style={styles.fSectionDesc}>Step-by-Step Guidance</Text>
                            <Text style={styles.fSectionDesc}>Some Support</Text>
                            <Text style={styles.fSectionDesc}>Prompting</Text>
                        </View>

                        <Text style={FONTSTYLES.inputHeaderText}>Last Assessment</Text>
                        <TextInput
                            editable={false}
                            style={globalStyles.input}
                            value={patient.lastAssessment}
                            cursorColor={COLOURS.purpleDark}
                            selectionColor={COLOURS.purpleDark}
                        />

                        <View style={{ flexDirection: "row", columnGap: 10 }}>
                            <View style={{ flex: 1, rowGap: 6 }}>
                                <ActivitySection category="cooking" colour={rowColors[1]} />
                                <ActivitySection category="dressing" colour={rowColors[0]} />
                                <ActivitySection category="eating" colour={rowColors[1]} />
                                <ActivitySection category="chores" colour={rowColors[0]} />
                                <ActivitySection category="washing" colour={rowColors[1]} />
                            </View>
                            <View style={{ flex: 1, rowGap: 6 }}>
                                <ActivitySection category="reading" colour={rowColors[1]} />
                                <ActivitySection category="communication" colour={rowColors[0]} />
                                <ActivitySection category="socialising" colour={rowColors[1]} />
                                <ActivitySection category="leisure" colour={rowColors[0]} />
                                <ActivitySection category="physical" colour={rowColors[1]} />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "center" }}>
                            <ActivitySection category="cognitive" colour={rowColors[0]} />
                        </View>

                        <GradientButton onPress={retakeTest} text="Retake Test" />

                        <Divider />
                    </View>
                )}


                {!editEnabled &&
                    <>
                        <Text style={FONTSTYLES.inputHeaderText}>Profile Created</Text>
                        <TextInput
                            editable={false}
                            style={globalStyles.input}
                            value={patient.joined}
                            cursorColor={COLOURS.purpleDark}
                            selectionColor={COLOURS.purpleDark}
                        />
                    </>
                }

                {editEnabled && <GradientButton onPress={saveProfile} text="Save Profile" type="selected" />}

                {!editEnabled && <GradientButton onPress={openEditing} text="Edit Profile" />}

                {!editEnabled && <GradientButton onPress={() => setDeleting(true)} text="Delete Profile" type="danger" />}

                <DatePicker setDateString={setDob} showPicker={showPicker} setShowPicker={setShowPicker}/>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={deleting}
                    onRequestClose={() => { setDeleting(!deleting); }}>
                    <View style={globalStyles.hoverContainer}>
                        <Text style={FONTSTYLES.subheaderText}>Deleting Profile</Text>
                        <Text style={[FONTSTYLES.textBox, { textAlign: "center" }]}>Once completed all patient data will be permanently deleted</Text>
                        <GradientButton onPress={deletePatient} text="Delete Profile" type="danger" />
                        <GradientButton onPress={() => setDeleting(false)} text="Cancel" />
                    </View>
                </Modal>
                
            </ScrollView>
        </LinearGradient >
    )
}

export default PatientInfo;

const styles = StyleSheet.create({
    fBarContainer: {
        height: 28,
        backgroundColor: COLOURS.purpleLighter,

        borderColor: COLOURS.purpleDark,
        borderWidth: BORDER_WIDTH,
        borderRadius: 14,
    },
    fBar: {
        backgroundColor: COLOURS.purpleStrong,
        borderRadius: 14 - BORDER_WIDTH,
        height: 28 - BORDER_WIDTH * 2,
        position: "absolute",
    },
    fDivider: {
        backgroundColor: COLOURS.purpleDark,
        width: BORDER_WIDTH,
        position: "relative",
    },
    fDescContainer: {
        flexDirection: "row",
    },
    fSectionDesc: {
        flex: 1,
        fontSize: 11,
        textAlign: "center",
    },
    functionalitySection: {
        textAlign: "left",
        fontSize: textSize[1],

        color: COLOURS.purpleDark,
        fontFamily: 'Roboto-Bold',
    },
})

const rowColors = [
    COLOURS.backgroundGradBottom,
    COLOURS.backgroundGradTop,
]