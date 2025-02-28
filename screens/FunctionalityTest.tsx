import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';

import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";

import { DATABASE_NAME, textSize } from "../constants/constantValues";
import COLOURS from "../constants/colours";
import FONTSTYLES from "../constants/fontstyles";
import globalStyles from "../constants/styles";
import { Level, Patient, PatientRouteProp, ScreenNavigationProp } from "../constants/types";

import questions from "../data/questionnaire";
import GradientButton from "../components/GradientButton";

const FunctionalityTest = () => {
    const route = useRoute<PatientRouteProp>();
    const navigation = useNavigation<ScreenNavigationProp>();
    const patient = route.params.patient;

    // Welcome Message Vars
    const [showWelcome, setShowWelcome] = useState<boolean>(false);

    const handleWelcomeMessage = () => {
        setShowWelcome(false);
    }

    // Questionnaire Vars
    const [questionNum, setQuestionNum] = useState<number>(0);
    const [answers, setAnswers] = useState<number[]>(Array(11).fill(0));

    const loadPreviousAnswers = async (): Promise<number[]> => {
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        const patientData = await db.getFirstAsync(`SELECT * FROM patients WHERE id = ${patient.id};`) as Patient;

        const latestAnswers = questions.map((question) => {
            const key = question.sqlKey as keyof Patient;
            return patientData[key] as number;
        });

        return latestAnswers;
    }

    const uploadPatientAnswer = async (answer: number) => {
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        await db.runAsync(`UPDATE patients SET ${questions[questionNum].sqlKey} = ? WHERE id = ?`, answer, patient.id);
    }

    const handleAnswer = (answer: number) => {
        // Update answers hook
        let newAnswers = [...answers];
        newAnswers[questionNum] = answer;

        setAnswers(newAnswers);
        uploadPatientAnswer(answer);
    }

    const previousQuestion = () => {
        setQuestionNum(prev => prev - 1)
    }

    const nextQuestion = () => {
        if (questionNum < 10) {
            // Commit answer to db
            setQuestionNum(prev => prev + 1)
        } else {
            uploadPatientFunctionality();
        }
    }

    const uploadPatientFunctionality = async () => {

        const db: SQLite.SQLiteDatabase = await SQLite.openDatabaseAsync(DATABASE_NAME);

        let lastAssessment: string = new Date().toLocaleDateString();
        await db.runAsync(`UPDATE patients SET lastAssessment = ? WHERE id = ?`, lastAssessment, patient.id);

        let score: number = answers.reduce((total, answer) => total + answer, -questions.length);
        await db.runAsync(`UPDATE patients SET fScore = ? WHERE id = ?`, score, patient.id);

        let level: Level = "Full Assistance";
        if (score <= 7) level = "Prompting";
        else if (score <= 17) level = "Some Support";
        else if (score <= 27) level = "Step-by-Step Guidance";
        await db.runAsync(`UPDATE patients SET fLevel = ? WHERE id = ?`, level, patient.id);

        let updatedPatient = {
            ...patient,
            fScore: score,
            fLevel: level,
            lastAssessment: lastAssessment,

            cookingLevel: answers[0],
            dressingLevel: answers[1],
            eatingLevel: answers[2],
            choresLevel: answers[3],
            washingLevel: answers[4],
            readingLevel: answers[5],
            communicationLevel: answers[6],
            socialisingLevel: answers[7],
            leisureLevel: answers[8],
            physicalLevel: answers[9],
            cognitiveLevel: answers[10],
        };
        navigation.navigate("PatientProfile", { patient: updatedPatient });
    }

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const fetchAnswers = async () => {
                const latestAnswers = await loadPreviousAnswers();
                if (isActive) {
                    setAnswers(latestAnswers);

                    // Find the first index where the answer is 0 and update questionNum
                    const firstUnanswered = latestAnswers.findIndex(answer => answer === 0);

                    // If there's a value of 0, set questionNum to that index
                    if (firstUnanswered !== -1) {
                        setQuestionNum(firstUnanswered); // Set questionNum to the index of the first unanswered question
                    } else {
                        setQuestionNum(0); // All answers are filled, so set to the end
                    }

                    // Check if the first answer is 0
                    if (latestAnswers[0] === 0) {
                        setShowWelcome(true);
                    }
                }
            };

            fetchAnswers();

            return () => {
                isActive = false;
            };

        }, [])
    );

    // Render welcome message if no answers completed
    if (showWelcome) {
        return (
            <LinearGradient
                style={globalStyles.pageContainer}
                colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>
                <Text style={[FONTSTYLES.pageHeaderText, { fontSize: 40, textAlign: 'center' }]}>Welcome!</Text>
                <LinearGradient
                    style={[globalStyles.scrollContainer, globalStyles.scrollContainerContent]}
                    colors={[COLOURS.textContainerGradBottom, COLOURS.textContainerGradTop, COLOURS.textContainerGradTop, COLOURS.textContainerGradBottom]}
                    locations={[0, 0.2, 0.8, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}>
                    <Text style={[styles.welcomeText]}>
                        Complete the questionnaire to recieve a tailored profile that helps us support your daily activities based on your needs.
                    </Text>
                    <Text style={[styles.welcomeText]}>
                        You'll also unlock our Memory Book feature to capture and reflect on special moments.
                    </Text>
                    <Text style={[styles.welcomeText]}>
                        Feel free to save your progress and return later.
                    </Text>
                </LinearGradient>
                <GradientButton onPress={handleWelcomeMessage} text="Continue" />
            </LinearGradient>
        )
    }

    const QuestionButton = ({ q, a }: { q: number, a: number }) => {
        return (
            <>
                <TouchableOpacity onPress={() => handleAnswer(a)} style={{ flex: 1 }}>
                    <LinearGradient
                        style={answers[q] === a ? [globalStyles.questionButton, {borderColor:COLOURS.redBorder}]:[globalStyles.questionButton]}
                        colors={answers[q] === a ? [COLOURS.buttonSelectedTop, COLOURS.buttonSelectedBottom] : [COLOURS.buttonTop, COLOURS.buttonBottom]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}>
                        <Text adjustsFontSizeToFit numberOfLines={3} style={FONTSTYLES.questionText}>{questions[q].answers[a - 1]}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </>
        );
    }

    // Render question
    return (
        <LinearGradient
            style={globalStyles.pageContainer}
            colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>

            <Text style={FONTSTYLES.pageHeaderText}>{questions[questionNum].heading}</Text>
            <View style={{ flex: 8, rowGap: 10 }}>
                <QuestionButton q={questionNum} a={1} />
                <QuestionButton q={questionNum} a={2} />
                <QuestionButton q={questionNum} a={3} />
                <QuestionButton q={questionNum} a={4} />
                <View style={styles.arrowsContainer}>

                    <GradientButton
                        onPress={previousQuestion}
                        icon={<AntDesign name="left" size={40} color={COLOURS.purpleLighter} />}
                        type={questionNum === 0 ? "disabled" : "normal"}
                    />
                    <Text style={FONTSTYLES.textBox}>Question {questionNum + 1}/11</Text>
                    <GradientButton
                        onPress={nextQuestion}
                        icon={<AntDesign name={questionNum < 10 ? "right" : "like2"} size={40} color={COLOURS.purpleLighter} />}
                        type={answers[questionNum] === 0 ? "disabled" : questionNum < 10 ? "normal" : "selected"}
                    />

                </View>
            </View>
        </LinearGradient>
    );
}

export default FunctionalityTest;

const styles = StyleSheet.create({
    arrowsContainer: {
        flex: 0.8,
        flexDirection: 'row',
        columnGap: 10,
        justifyContent: 'space-between',
        alignItems: "center",
    },
    welcomeText: {
        color: COLOURS.black,
        fontSize: textSize[2],
        fontFamily: 'Roboto-Regular',
    },
});