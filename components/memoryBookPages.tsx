import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, KeyboardTypeOptions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import * as SQLite from "expo-sqlite";

import COLOURS from "../constants/colours";
import globalStyles from "../constants/styles";
import { BORDER_WIDTH, DATABASE_NAME, INPUT_PLACEHOLDER, textSize } from "../constants/constantValues";
import { Patient } from "../constants/types";
import DatePicker from "../components/DatePicker";

const screenDimensions = Dimensions.get('screen');

type MemoryInputProps = {
    patient: Patient;
    setPatient: React.Dispatch<React.SetStateAction<Patient>>;
    pageRef: React.RefObject<ScrollView>;
    sqlKey: string;
    keyboardType?: KeyboardTypeOptions;
    placeholder?: string;
}

const MemoryInput = ({ patient, setPatient, pageRef, sqlKey, keyboardType, placeholder }: MemoryInputProps) => {
    // Shift component to centre of screen
    const inputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState<boolean>(false);

    const handleFocus = () => {
        inputRef.current?.measure((x, y, width, height, pageX, pageY) => {
            pageRef.current?.scrollTo({ y: y - 100, animated: true });
        });
        setFocused(true);
    }

    // Update database and patient object
    const uploadAnswer = async (answer: string) => {
        // Update database
        try {
            const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
            await db.runAsync(`UPDATE patients SET ${sqlKey} = ? WHERE id = ?`, answer, patient.id);
        } catch (e) {
            console.log("Unable to save answer:\n", e)
        }

        // Update hook
        setPatient((prev) => ({ ...prev, [sqlKey]: answer }));
        setFocused(false);
    }

    return (
        <TextInput
            ref={inputRef}
            keyboardType={keyboardType}

            multiline
            defaultValue={patient[sqlKey as keyof Patient] as string}
            placeholder={placeholder ? placeholder : INPUT_PLACEHOLDER}

            // Styles
            style={[styles.input, focused && { borderColor: COLOURS.purpleStrong }, keyboardType === "numeric" && { width: 70 }]}
            placeholderTextColor={COLOURS.textContainerDark}
            cursorColor={COLOURS.purpleDark}
            selectionColor={COLOURS.purpleDark}

            // Functions
            onFocus={handleFocus}
            onEndEditing={e => uploadAnswer(e.nativeEvent.text)}
        />
    )
}

type MemoryDateProps = {
    patient: Patient;
    setPatient: React.Dispatch<React.SetStateAction<Patient>>;
    sqlKey: string;
}

const MemoryDateInput = ({ patient, setPatient, sqlKey }: MemoryDateProps) => {
    // Date Picker Variables
    const [date, setDate] = useState<string>(patient[sqlKey as keyof Patient] as string);
    const [showPicker, setShowPicker] = useState<boolean>(false);

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    }

    // Update database and patient object
    const uploadAnswer = async () => {
        // Update database
        try {
            const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
            await db.runAsync(`UPDATE patients SET ${sqlKey} = ? WHERE id = ?`, date, patient.id);
        } catch (e) {
            console.log("Unable to save answer:\n", e)
        }

        // Update hook
        setPatient((prev) => ({ ...prev, [sqlKey]: date }));
    }

    useEffect(() => {
        uploadAnswer();
    }, [date]);

    return (
        <>
            <Pressable onPress={toggleDatePicker} style={styles.input}>
                <Text style={[styles.buttonText, date === "" && { color: COLOURS.textContainerDark }]}>
                    {date === "" ? INPUT_PLACEHOLDER : date}
                </Text>
            </Pressable>
            
            <DatePicker setDateString={setDate} showPicker={showPicker} setShowPicker={setShowPicker}/>
        </>
    )
}

type MemoryPageProps = {
    patient: Patient;
    setPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

export const IntroPage = ({ patient, setPatient }: MemoryPageProps) => {
    // Text Input Focus
    const pageRef = useRef<ScrollView>(null);

    const swipeAnimation = useRef(new Animated.Value(80)).current;
    const swipeOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.parallel([
                Animated.timing(swipeAnimation, { toValue: -80, duration: 2000, useNativeDriver: true }),
                Animated.sequence([
                    Animated.timing(swipeOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
                    Animated.timing(swipeOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
                ]),
            ])
        ).start();
    }, []);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.subheader}>{"This booklet\ndetails the life of"}</Text>

            <View style={styles.nameContainer}>
                <Text style={styles.pageHeader}>{patient.firstName}</Text>
                <Text style={styles.pageHeader}>{patient.lastName}</Text>
            </View>

            <Text style={styles.question}>Preferred language:</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="preferredLanguage" pageRef={pageRef} />

            <Text style={styles.question}>Date of birth:</Text>
            <TextInput
                editable={false}
                style={styles.input}
                value={patient.dob}
            />

            <Text style={styles.question}>Place of birth:</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="birthplace" pageRef={pageRef} />

            <Animated.View style={{
                alignItems: "center",
                padding: 20,
                transform: [{ translateX: swipeAnimation }],
                opacity: swipeOpacity,
            }}>
                <FontAwesome name="hand-pointer-o" size={50} color={COLOURS.purpleDark} />
            </Animated.View>

        </ScrollView>
    )
}

export const NicknamesPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            style={styles.storyPage}
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Nicknames</Text>

            <Text style={styles.question}>Do you know the background of your family name?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="familyBackground" pageRef={pageRef} />

            <Text style={styles.question}>What nicknames do you have?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="nicknames" pageRef={pageRef} />

            <Text style={styles.question}>How did you get them?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="nicknameOrigin" pageRef={pageRef} />

        </ScrollView>
    )
}

export const FamilyPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);
    const [siblings, setSiblings] = useState(true);

    const updateSibling = async (answer: string) => {
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        await db.runAsync(`UPDATE patients SET siblings = ? WHERE id = ?`, answer, patient.id);
    }

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Parents & Siblings</Text>

            <Text style={styles.question}>I am the child of</Text>
            <MemoryInput patient={patient} setPatient={setPatient} pageRef={pageRef} sqlKey="father" placeholder="father" />
            <Text style={styles.question}>and</Text>
            <MemoryInput patient={patient} setPatient={setPatient} pageRef={pageRef} sqlKey="mother" placeholder="mother" />

            <Text style={styles.question}>How did your parents meet?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="parentsMeet" pageRef={pageRef} />

            <Text style={styles.question}>Do you have any brothers or sisters?</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Pressable
                    style={siblings ? styles.buttonSelected : styles.buttonDeselected}
                    onPress={() => {
                        updateSibling('1'),
                            setSiblings(true)
                    }}
                >
                    <Text style={styles.buttonText}>Yes</Text>
                </Pressable>
                <Pressable
                    style={siblings ? styles.buttonDeselected : styles.buttonSelected}
                    onPress={() => {
                        updateSibling('0'),
                            setSiblings(false)
                    }}
                >
                    <Text style={styles.buttonText}>No</Text>
                </Pressable>
            </View>

            {siblings && (
                <>
                    <Text style={styles.question}>Did you get on with them?</Text>
                    <MemoryInput patient={patient} setPatient={setPatient} sqlKey="siblingsLike" pageRef={pageRef} />

                    <Text style={styles.question}>Did you share a room with them?</Text>
                    <MemoryInput patient={patient} setPatient={setPatient} sqlKey="siblingsRoom" pageRef={pageRef} />

                    <Text style={styles.question}>What are some of your favourite memories with them?</Text>
                    <MemoryInput patient={patient} setPatient={setPatient} sqlKey="siblingsMemory" pageRef={pageRef} />
                </>
            )}


        </ScrollView>
    )
}

export const ChildhoodPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Childhood</Text>

            <Text style={styles.question}>During my childhood I lived in</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="childhoodLived" pageRef={pageRef} />

            <Text style={styles.question}>My childhood friends were</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="childhoodFriends" pageRef={pageRef} />

            <Text style={styles.question}>My favourite memories with them are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="childhoodMemory" pageRef={pageRef} />

            <Text style={styles.question}>We used to play</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="friendsPlay" pageRef={pageRef} />

        </ScrollView>
    )
}

export const SchoolPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}>
            <Text style={styles.pageHeader}>School</Text>

            <Text style={styles.question}>I went to school at</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="school" pageRef={pageRef} />

            <Text style={styles.question}>My favourite subject was</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="favSubject" pageRef={pageRef} />

            <Text style={styles.question}>My favourite teacher was</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="favTeacher" pageRef={pageRef} />

            <Text style={styles.question}>My school uniform was</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="schoolUniform" pageRef={pageRef} />

            <Text style={styles.question}>My favourite memories of school are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="schoolMemory" pageRef={pageRef} />
        </ScrollView>
    )
}

export const PetsPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Pets</Text>

            <Text style={styles.question}>What pets did you have?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="pets" pageRef={pageRef} />

            <Text style={styles.question}>My pet was called</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="petName" pageRef={pageRef} />

            <Text style={styles.question}>My favourite memories with them were</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="petMemory" pageRef={pageRef} />

        </ScrollView>
    )
}

export const ValuesPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Values & Beliefs</Text>

            <Text style={styles.question}>Values and beliefs important to me are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="personalValues" pageRef={pageRef} />

            <Text style={styles.question}>My religious beliefs are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="religion" pageRef={pageRef} />

        </ScrollView>
    )
}

export const LikesPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Likes & Dislikes</Text>

            <Text style={styles.question}>A few of my favourite things...</Text>
            <Text style={styles.question}>Smells</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeSmell" pageRef={pageRef} />
            <Text style={styles.question}>Foods</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeFood" pageRef={pageRef} />
            <Text style={styles.question}>Seasons</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeSeason" pageRef={pageRef} />
            <Text style={styles.question}>Sayings</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeSaying" pageRef={pageRef} />
            <Text style={styles.question}>Jokes</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeJoke" pageRef={pageRef} />
            <Text style={styles.question}>TV shows/movies</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeShow" pageRef={pageRef} />
            <Text style={styles.question}>Radio programmes/stations</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeRadio" pageRef={pageRef} />
            <Text style={styles.question}>Music</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeMusic" pageRef={pageRef} />
            <Text style={styles.question}>Activities/hobbies</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeHobby" pageRef={pageRef} />
            <Text style={styles.question}>Sports</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeSport" pageRef={pageRef} />
            <Text style={styles.question}>Time of day</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="likeTime" pageRef={pageRef} />

            <Text style={styles.question}>A few things I dislike...</Text>
            <Text style={styles.question}>Smells</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="dislikeSmell" pageRef={pageRef} />
            <Text style={styles.question}>Foods</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="dislikeFood" pageRef={pageRef} />
            <Text style={styles.question}>Seasons</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="dislikeSeason" pageRef={pageRef} />
            <Text style={styles.question}>TV shows/movies</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="dislikeShow" pageRef={pageRef} />
            <Text style={styles.question}>Radio programmes/stations</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="dislikeRadio" pageRef={pageRef} />
            <Text style={styles.question}>Music</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="dislikeMusic" pageRef={pageRef} />
            <Text style={styles.question}>Sports</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="dislikeSport" pageRef={pageRef} />
            <Text style={styles.question}>Time of day</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="dislikeTime" pageRef={pageRef} />

        </ScrollView>
    )
}

export const RoutinePage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >
            <Text style={styles.pageHeader}>My Daily Routine</Text>

            <Text style={styles.question}>In the morning I like to</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="routineMorning" pageRef={pageRef} />

            <Text style={styles.question}>At lunch time I like to</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="routineLunch" pageRef={pageRef} />

            <Text style={styles.question}>In the afternoon I</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="routineAfternoon" pageRef={pageRef} />

            <Text style={styles.question}>In the evening I enjoy</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="routineEvening" pageRef={pageRef} />

            <Text style={styles.question}>At night I</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="routineNight" pageRef={pageRef} />

        </ScrollView>
    )
}

export const MarriagePage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);
    const [married, setMarried] = useState(true);

    const updateMarried = async (answer: string) => {
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        await db.runAsync(`UPDATE patients SET married = ? WHERE id = ?`, answer, patient.id);
    }

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Love & Marriage</Text>

            <Pressable
                style={married ? styles.buttonSelected : styles.buttonDeselected}
                onPress={() => {
                    updateMarried('1'),
                        setMarried(true)
                }}
            >
                <Text style={styles.buttonText}>Married</Text>
            </Pressable>
            <Pressable
                style={married ? styles.buttonDeselected : styles.buttonSelected}
                onPress={() => {
                    updateMarried('0'),
                        setMarried(false)
                }}
            >
                <Text style={styles.buttonText}>Not Married</Text>
            </Pressable>

            {married ?
                <>
                    <Text style={styles.question}>I married</Text>
                    <MemoryInput patient={patient} setPatient={setPatient} sqlKey="marriedWho" pageRef={pageRef} />

                    <Text style={styles.question}>in</Text>
                    <MemoryDateInput patient={patient} setPatient={setPatient} sqlKey="marriedWhen" />

                    <Text style={styles.question}>at</Text>
                    <MemoryInput patient={patient} setPatient={setPatient} sqlKey="marriedAt" pageRef={pageRef} />
                </>
                :
                <>
                    <Text style={styles.question}>My partner's name is</Text>
                    <MemoryInput patient={patient} setPatient={setPatient} sqlKey="partnerWho" pageRef={pageRef} />

                    <Text style={styles.question}>We met at</Text>
                    <MemoryInput patient={patient} setPatient={setPatient} sqlKey="partnerMet" pageRef={pageRef} />
                </>
            }

            <Text style={styles.question}>My favourites memory with them is</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="marriedMemory" pageRef={pageRef} />

        </ScrollView>
    )
}

export const ChildrenPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Children</Text>

            <Text style={styles.question}>My children's names are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="childrenNames" pageRef={pageRef} />

            <Text style={styles.question}>How did you decide on their names?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="childrenNameReasons" pageRef={pageRef} />

            <Text style={styles.question}>Are any of your children like you?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="childrenLikeYou" pageRef={pageRef} />

            <Text style={styles.question}>My favourite stories about my children are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="childrenStories" pageRef={pageRef} />

            <Text style={styles.question}>My favourite activities to do with my children were</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="childrenActivities" pageRef={pageRef} />

        </ScrollView>
    )
}

export const GrandchildrenPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Grandchildren</Text>

            <Text style={styles.question}>My grandchildren's names are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="grandchildrenNames" pageRef={pageRef} />

            <Text style={styles.question}>Are any of your grandchildren like you?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="grandchildrenLikeYou" pageRef={pageRef} />

            <Text style={styles.question}>My favourite stories about my grandchildren are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="grandchildrenStories" pageRef={pageRef} />

            <Text style={styles.question}>My favourite activities to do with my grandchildren are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="grandchildrenActivities" pageRef={pageRef} />
        </ScrollView>
    )
}

export const WorkPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >
            <Text style={styles.pageHeader}>Work</Text>

            <Text style={styles.question}>My first job was</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="jobFirst" pageRef={pageRef} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.question}>when I was </Text>
                <MemoryInput patient={patient} setPatient={setPatient} sqlKey="jobStartAge" pageRef={pageRef} keyboardType="numeric" />
                <Text style={styles.question}> years old.</Text>
            </View>

            <Text style={styles.question}>My first pay packet was</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="jobPay" pageRef={pageRef} />

            <Text style={styles.question}>My favourite job was</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="jobFav" pageRef={pageRef} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.question}>which I did for </Text>
                <MemoryInput patient={patient} setPatient={setPatient} sqlKey="jobYears" pageRef={pageRef} keyboardType="numeric" />
                <Text style={styles.question}> years.</Text>
            </View>

            <Text style={styles.question}>My other jobs were</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="jobOthers" pageRef={pageRef} />

            <Text style={styles.question}>Memories of bosses and workmates</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="jobMemory" pageRef={pageRef} />

        </ScrollView>
    )
}

export const RetirementPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Retirement</Text>

            <Text style={styles.question}>I retired from work on</Text>
            <MemoryDateInput patient={patient} setPatient={setPatient} sqlKey="retiredJob" />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.question}>after </Text>
                <MemoryInput patient={patient} setPatient={setPatient} sqlKey="retiredYears" pageRef={pageRef} keyboardType="numeric" />
                <Text style={styles.question}> years of work.</Text>
            </View>

            <Text style={styles.question}>Did you have a party when you retired?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="retiredParty" pageRef={pageRef} />

            <Text style={styles.question}>When I retired I felt</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="retiredFeelings" pageRef={pageRef} />

            <Text style={styles.question}>What did you do when you retired?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="retiredDid" pageRef={pageRef} />

        </ScrollView>
    )
}

export const FriendshipsPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Friendships</Text>

            <Text style={styles.question}>My close friends include</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="friends" pageRef={pageRef} />

            <Text style={styles.question}>My best friends growing up were</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="friendsThen" pageRef={pageRef} />

            <Text style={styles.question}>How did you meet them?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="friendsMeet" pageRef={pageRef} />

            <Text style={styles.question}>My favourite memories with them are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="friendsMemory" pageRef={pageRef} />

        </ScrollView>
    )
}

export const HobbiesPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Hobbies & Interests</Text>

            <Text style={styles.question}>My hobbies and interests include</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="favHobbies" pageRef={pageRef} />

            <Text style={styles.question}>Were you involved in any clubs?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="clubs" pageRef={pageRef} />

        </ScrollView>
    )
}

export const TravelPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Travel</Text>

            <Text style={styles.question}>My favourite trip was to</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="tripFav" pageRef={pageRef} />

            <Text style={styles.question}>When did you go there?</Text>
            <MemoryDateInput patient={patient} setPatient={setPatient} sqlKey="tripWhen" />

            <Text style={styles.question}>The best part of this trip was</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="tripBestPart" pageRef={pageRef} />

            <Text style={styles.question}>I went with</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="tripWith" pageRef={pageRef} />

            <Text style={styles.question}>My other travel experiences were</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="otherTrips" pageRef={pageRef} />

        </ScrollView>
    )
}

export const FirstsPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Firsts</Text>

            <Text style={styles.question}>Drink</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="firstDrink" pageRef={pageRef} />

            <Text style={styles.question}>Date</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="firstDate" pageRef={pageRef} />

            <Text style={styles.question}>Dance</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="firstDance" pageRef={pageRef} />

            <Text style={styles.question}>Kiss</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="firstKiss" pageRef={pageRef} />

            <Text style={styles.question}>Love</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="firstLove" pageRef={pageRef} />

        </ScrollView>
    )
}

export const HomesPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Homes</Text>

            <Text style={styles.question}>My favourite home was</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="homeFav" pageRef={pageRef} />
            <Text style={styles.question}>because</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="homeBecause" pageRef={pageRef} />

            <Text style={styles.question}>What makes a house a home to you?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="homeWhat" pageRef={pageRef} />

            <Text style={styles.question}>Did you have a garden?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="homeGarden" pageRef={pageRef} />

            <Text style={styles.question}>How did you decorate your home?</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="homeDecorate" pageRef={pageRef} />

        </ScrollView>
    )
}

export const TraditionsPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Family Life & Traditions</Text>

            <Text style={styles.question}>Family traditions I like are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="traditions" pageRef={pageRef} />

            <Text style={styles.question}>My favourite family trip was</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="familyTrip" pageRef={pageRef} />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.question}>I used to get </Text>
                <MemoryInput patient={patient} setPatient={setPatient} sqlKey="pocketMoney" pageRef={pageRef} keyboardType="numeric" />
            </View>
            <Text style={styles.question}>in pocket money a week</Text>

            <Text style={styles.question}>Our new Years traditions are</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="newYear" pageRef={pageRef} />

            <Text style={styles.question}>At meal time we</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="mealTime" pageRef={pageRef} />

            <Text style={styles.question}>On weekends we</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="weekends" pageRef={pageRef} />

        </ScrollView>
    )
}

export const CarsPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>My Cars</Text>

            <Text style={styles.question}>I passed my driving test when</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.question}>I was </Text>
                <MemoryInput patient={patient} setPatient={setPatient} sqlKey="carsPassed" pageRef={pageRef} keyboardType="numeric" />
                <Text style={styles.question}> years old.</Text>
            </View>

            <Text style={styles.question}>My first car was </Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="carsFirst" pageRef={pageRef} />

            <Text style={styles.question}>My favourite car was </Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="carsFav" pageRef={pageRef} />

            <Text style={styles.question}>My favourite place to drive was </Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="carsPlace" pageRef={pageRef} />

        </ScrollView>
    )
}

export const EventsPage = ({ patient, setPatient }: MemoryPageProps) => {
    const pageRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            style={styles.storyPage}

            ref={pageRef}
        >

            <Text style={styles.pageHeader}>Big World Events</Text>

            <Text style={styles.question}>Big news stories</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventBig" pageRef={pageRef} />

            <Text style={styles.question}>Covid 19</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventCovid" pageRef={pageRef} />

            <Text style={styles.question}>Twin Towers</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventTowers" pageRef={pageRef} />

            <Text style={styles.question}>Brexit</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventBrexit" pageRef={pageRef} />

            <Text style={styles.question}>John F Kennedy Assassination</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventKennedy" pageRef={pageRef} />

            <Text style={styles.question}>The Moon Landing</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventMoon" pageRef={pageRef} />

            <Text style={styles.question}>The First Mobile Phone</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventPhone" pageRef={pageRef} />

            <Text style={styles.question}>The Fall of the Berlin Wall</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventBerlin" pageRef={pageRef} />

            <Text style={styles.question}>Chernobyl Disaster</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventChernobyl" pageRef={pageRef} />

            <Text style={styles.question}>The Gulf War</Text>
            <MemoryInput patient={patient} setPatient={setPatient} sqlKey="eventGulf" pageRef={pageRef} />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        color: COLOURS.black,
        fontSize: textSize[3],
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
    },
    buttonSelected: {
        borderColor: COLOURS.black,
        borderWidth: BORDER_WIDTH,

        backgroundColor: COLOURS.textContainerGradBottom,
        padding: 10,

        margin: 6,
        marginHorizontal: 30,
    },
    buttonDeselected: {
        backgroundColor: COLOURS.textContainerGradBottom,
        padding: 10,

        margin: 8,
        marginHorizontal: 32,
    },


    storyPage: {
        backgroundColor: COLOURS.textContainerGradBottom,

        borderColor: COLOURS.purpleDark,
        borderRadius: 8,
        borderWidth: BORDER_WIDTH,

        margin: 8,
        width: screenDimensions.width - 32,
    },
    inputContainer: {
        padding: 10,
        margin: 10,
    },
    input: {
        borderColor: COLOURS.textContainerDark,
        borderRadius: 8,
        borderWidth: BORDER_WIDTH,
        padding: 10,

        backgroundColor: COLOURS.textContainerGradBottom,

        color: COLOURS.black,
        fontSize: textSize[3],
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
    pageHeader: {
        color: COLOURS.purpleDark,
        fontSize: textSize[3],
        fontFamily: 'Roboto-Bold',
        textAlign: "center",
    },
    subheader: {
        color: COLOURS.black,
        fontSize: textSize[2],
        fontFamily: 'Roboto-Bold',
        textAlign: "center",

        margin: 10,
    },
    nameContainer: {
        borderColor: COLOURS.black,
        borderWidth: BORDER_WIDTH,

        padding: 10,
    },
    question: {
        color: COLOURS.black,
        fontSize: textSize[2],
        fontFamily: 'Roboto-Bold',

        marginTop: 12,
        marginBottom: 6,
    },
    prompt: {
        color: COLOURS.textContainerDark,
        fontSize: textSize[2],
        fontFamily: 'Roboto-Bold',
        textAlign: "center",
    },

});