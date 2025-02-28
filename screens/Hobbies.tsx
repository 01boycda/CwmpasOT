import React, { useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import DropDownPicker from 'react-native-dropdown-picker';
import * as SQLite from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";

import { DATABASE_NAME } from "../constants/constantValues";
import COLOURS from "../constants/colours";
import FONTSTYLES from "../constants/fontstyles";
import globalStyles from "../constants/styles";
import { HobbiesRouteProp, ScreenNavigationProp } from "../constants/types";
import ActivityButton from "../components/ActivityButton";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import CustomScrollView from "../components/CustomScrollView";

const screenDimensions = Dimensions.get('screen');

const Hobbies: React.FC = () => {
    const route = useRoute<HobbiesRouteProp>();
    const navigation = useNavigation<ScreenNavigationProp>();
    const patient = route.params.patient;

    // Load activity data from Json
    const activitiesData = require('../data/activities.json');

    // Dropdown
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);
    const [items, setItems] = useState([
        { label: "Favourites", value: "Favourites" },
        { label: "Cognitive Activities", value: "Cognitive Activities" },
        { label: "Creative Activities", value: "Creative Activities" },
        { label: "Engaging with Others", value: "Engaging with Others" },
        { label: "Music", value: "Music" },
        { label: "Physical Activities", value: "Physical Activities" },
        { label: "Relaxation", value: "Relaxation" },
    ]);
    const [category, setCategory] = useState<string>(route.params.category);
    const [activities, setActivities] = useState<string[]>([]);

    // Update activity buttons
    const handleCategory = () => {
        let currentActivities: string[] = [];
        if (category === "Favourites") {
            Object.keys(activitiesData).map(key => {
                if (favourites.indexOf(key) > -1) {
                    currentActivities.push(key);
                }
            });
        } else {
            Object.keys(activitiesData).map(key => {
                if (activitiesData[key]["activityCategory"] === category) {
                    currentActivities.push(key);
                }
            });
        }

        setActivities(currentActivities);
    }

    // FAVOURITES SECTION
    const [favourites, setFavourites] = useState<string[]>([]);

    // Load Favourites Data
    const loadFavouritesData = async () => {
        try {
            const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

            // Create table if not existing
            await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS hobbies (
                        id INTEGER PRIMARY KEY NOT NULL,
                        patient_id INTEGER REFERENCES patients(id),
                        activity TEXT NOT NULL);`
            );

            // Create favourites list
            let favouritesData: { "activity": string }[] = await db.getAllAsync(`SELECT DISTINCT activity FROM hobbies WHERE patient_id = ${patient.id}`);
            let favouritesList: string[] = [];
            Object.values(favouritesData).forEach(a => favouritesList.push(a["activity"]));

            // Update favourites hook
            setFavourites(favouritesList);
        } catch (e) {
            console.log("Failed to get patient data:\n", e)
        }
    }

    // Load favourites when page opened
    useFocusEffect(
        React.useCallback(() => {
            loadFavouritesData();
        }, [])
    );

    // Load category after favourites synced
    useEffect(() => {
        handleCategory();
    }, [favourites]);

    // Toggle Favourite
    const toggleFavourite = async (activity: string) => {
        try {
            // Load database
            const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

            // Add / Remove activity from favourites
            if (favourites.indexOf(activity) > -1) {
                await db.runAsync('DELETE FROM hobbies WHERE patient_id = $id AND activity = $act', { $id: patient.id, $act: activity });
            } else {
                await db.runAsync(`INSERT INTO hobbies (patient_id, activity) VALUES ('${patient.id}', '${activity}');`);
            }
        } catch (e) {
            console.log("Failed to get patient data:\n", e)
        }

        // Reload favourites
        loadFavouritesData();
    }

    // Info Menu
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
    }, [navigation, showInfo]);

    return (
        <LinearGradient
            style={globalStyles.pageContainer}
            colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>
            <DropDownPicker
                open={openDropdown}
                value={category}
                items={items}
                setOpen={setOpenDropdown}
                setValue={setCategory}
                setItems={setItems}
                onChangeValue={handleCategory}
                placeholder={"Favourites"}

                style={globalStyles.dropdown}
                dropDownContainerStyle={globalStyles.dropdownList}
                selectedItemContainerStyle={globalStyles.dropdownSelected}
                textStyle={FONTSTYLES.dropdownText}
                selectedItemLabelStyle={{ color: COLOURS.purpleLighter }}

                ArrowDownIconComponent={() => <AntDesign name="down" size={30} />}
                ArrowUpIconComponent={() => <AntDesign name="up" size={30} />}
                showTickIcon={false}
            />

            {activities.length > 0 ?
                <CustomScrollView>
                    {activities.map((activity, i) => {
                        return (
                            <View key={activity}>
                                <ActivityButton navigation={navigation} patient={patient} activity={activity} favourited={favourites.indexOf(activity) > -1} />
                                <TouchableOpacity onPress={() => toggleFavourite(activity)} style={{ position: "absolute", right: 10, top: 10 }}>
                                    <FontAwesome name={favourites.indexOf(activity) > -1 ? "star" : "star-o"} size={60} color={COLOURS.white} />
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </CustomScrollView>
                :
                <LinearGradient
                    style={[globalStyles.scrollContainer, { alignContent: "center", justifyContent: 'center' }]}
                    colors={[COLOURS.textContainerGradBottom, COLOURS.textContainerGradTop, COLOURS.textContainerGradTop, COLOURS.textContainerGradBottom]}
                    locations={[0, 0.2, 0.8, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}>
                    <Text style={FONTSTYLES.subheaderText}>No Favourites Found</Text>
                </LinearGradient>
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

                            <TouchableOpacity style={{ position: "absolute", left: Dimensions.get("screen").width / 2 - 25, top: 18 }} onPress={() => setInfoBox(infoBox === 1 ? 0 : 1)}>
                                <View style={globalStyles.infoIconFill} />
                                <MaterialCommunityIcons name="chat-question-outline" size={60} color={COLOURS.purpleDark} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ position: "absolute", right: 40, top: 120 }} onPress={() => setInfoBox(infoBox === 2 ? 0 : 2)}>
                                <View style={globalStyles.infoIconFill} />
                                <MaterialCommunityIcons name="chat-question-outline" size={60} color={COLOURS.purpleDark} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ position: "absolute", left: Dimensions.get("screen").width / 2 - 25, top: 150 }} onPress={() => setInfoBox(infoBox === 3 ? 0 : 3)}>
                                <View style={globalStyles.infoIconFill} />
                                <MaterialCommunityIcons name="chat-question-outline" size={60} color={COLOURS.purpleDark} />
                            </TouchableOpacity>

                            {infoBox > 0 &&
                                (
                                    <Pressable onTouchEnd={() => setInfoBox(0)} style={globalStyles.infoBox}>
                                        <Text style={FONTSTYLES.textBox}>
                                            {infoBox == 1 && " Use the dropdown box to select different Activity Categories."}
                                            {infoBox == 2 && "Click star to favourite activities."}
                                            {infoBox == 3 && "Click the activities for personalised guidance."}
                                        </Text>
                                    </Pressable>
                                )
                            }

                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

        </LinearGradient>
    )
}

export default Hobbies;
