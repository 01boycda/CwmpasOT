import React, { useEffect, useState } from "react";
import { Keyboard, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { DATABASE_NAME, INPUT_PLACEHOLDER } from "../constants/constantValues";
import globalStyles from "../constants/styles";
import FONTSTYLES from "../constants/fontstyles";
import COLOURS from "../constants/colours";

import { Patient, ScreenNavigationProp } from "../constants/types";

import * as SQLite from "expo-sqlite";
import GradientButton from "../components/GradientButton";
import DatePicker from "../components/DatePicker";

const AddPatient = () => {
    const navigation = useNavigation<ScreenNavigationProp>();

    // Name Input Vars
    const [firstName, setFirstName] = useState<string>("");
    const [middleNames, setMiddleNames] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    // Date Picker Vars
    const [dob, setDob] = useState<string>("");
    const [showPicker, setShowPicker] = useState<boolean>(false);

    const toggleDatePicker = () => {
        Keyboard.dismiss();
        setShowPicker(!showPicker);
    }

    // SQL
    const addPatient = async () => {
        console.log("Opening DB");
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

        let joined = new Date().toLocaleDateString();
        let lastAssessment = new Date(0).toLocaleDateString();
        console.log("Joined:", joined, "Last Assessment:", lastAssessment);

        try {
            let updatedDB = await db.runAsync(`INSERT INTO patients (firstName, middleNames, lastName, dob, joined, fScore, fLevel, lastAssessment, cookingLevel, dressingLevel, eatingLevel, choresLevel, washingLevel, readingLevel, communicationLevel, socialisingLevel, leisureLevel, physicalLevel, cognitiveLevel, siblings, married) VALUES ('${firstName}', '${middleNames}', '${lastName}', '${dob}', '${joined}', 0, 'Finish Assessment', '${lastAssessment}', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);`);

            console.log("Last Patient ID:", updatedDB.lastInsertRowId);

            let newPatient: Patient = {
                id: updatedDB.lastInsertRowId,
                firstName: firstName,
                middleNames: middleNames,
                lastName: lastName,
                dob: dob,

                joined: new Date().toLocaleDateString(),
                fScore: 0,
                fLevel: "Finish Assessment",
                lastAssessment: new Date(0).toLocaleDateString(),

                cookingLevel: 0,
                dressingLevel: 0,
                eatingLevel: 0,
                choresLevel: 0,
                washingLevel: 0,
                readingLevel: 0,
                communicationLevel: 0,
                socialisingLevel: 0,
                leisureLevel: 0,
                physicalLevel: 0,
                cognitiveLevel: 0,

                siblings: false,
                married: false,
            }

            navigation.navigate("FunctionalityTest", { patient: newPatient });
        } catch (e) {
            console.log("Error adding patient:\n", e);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient
                style={globalStyles.pageContainer}
                colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>
                <Text style={FONTSTYLES.inputHeaderText}>First Name</Text>
                <TextInput
                    style={globalStyles.input}
                    onChangeText={setFirstName}
                    placeholder={INPUT_PLACEHOLDER}
                    returnKeyType="done"
                    placeholderTextColor={COLOURS.purpleSoft}
                    selectionColor={COLOURS.purpleDark}
                />

                <Text style={FONTSTYLES.inputHeaderText}>Middle Names</Text>
                <TextInput
                    style={globalStyles.input}
                    onChangeText={setMiddleNames}
                    placeholder={INPUT_PLACEHOLDER}
                    returnKeyType="done"
                    placeholderTextColor={COLOURS.purpleSoft}
                    selectionColor={COLOURS.purpleDark}
                />

                <Text style={FONTSTYLES.inputHeaderText}>Last Name</Text>
                <TextInput
                    style={globalStyles.input}
                    onChangeText={setLastName}
                    placeholder={INPUT_PLACEHOLDER}
                    returnKeyType="done"
                    placeholderTextColor={COLOURS.purpleSoft}
                    selectionColor={COLOURS.purpleDark}
                />

                <Text style={FONTSTYLES.inputHeaderText}>Date of Birth</Text>
                <Pressable onPress={toggleDatePicker}>
                    <TextInput
                        style={globalStyles.input}
                        placeholder={INPUT_PLACEHOLDER}
                        value={dob}
                        placeholderTextColor={COLOURS.purpleSoft}
                        editable={false}
                        onPressIn={toggleDatePicker}
                    />
                </Pressable>

                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <GradientButton onPress={addPatient} text="Create User" type={(firstName === "" || lastName === "" || dob === "") ? "disabled" : "normal"} />
                </View>

                <DatePicker setDateString={setDob} showPicker={showPicker} setShowPicker={setShowPicker}/>

            </LinearGradient>
        </TouchableWithoutFeedback >
    )
}

export default AddPatient;