import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Keyboard, Platform, View } from "react-native";

import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";

import COLOURS from "../constants/colours";
import globalStyles from "../constants/styles";
import { Patient, PatientRouteProp, ScreenNavigationProp } from "../constants/types";
import { MemoryBookBackButton } from "../components/HeaderButtons";

import {
    IntroPage,
    CarsPage,
    ChildhoodPage,
    ChildrenPage,
    EventsPage,
    FamilyPage,
    FirstsPage,
    FriendshipsPage,
    GrandchildrenPage,
    HobbiesPage,
    HomesPage,
    LikesPage,
    MarriagePage,
    NicknamesPage,
    PetsPage,
    RetirementPage,
    RoutinePage,
    SchoolPage,
    TraditionsPage,
    TravelPage,
    ValuesPage,
    WorkPage
} from "../components/memoryBookPages";
import GradientButton from "../components/GradientButton";


const MemoryBook = () => {
    const PAGE_WIDTH: number = (Dimensions.get("screen").width - 16);
    const KEYBOARD_BUFFER: number = 220;

    const navigation = useNavigation<ScreenNavigationProp>();
    const route = useRoute<PatientRouteProp>();
    const [patient, setPatient] = useState<Patient>(route.params.patient);

    const flatListRef = useRef<FlatList>(null);
    const [page, setPage] = useState<number>(0);
    const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

    const handleScroll = (offsetX: number) => {
        const page = Math.round(offsetX / PAGE_WIDTH);
        setPage(page);
    }

    // Page slider
    const handlePageSlider = (page: number) => {
        flatListRef.current?.scrollToOffset({ offset: PAGE_WIDTH * page, animated: false });
        setPage(page)
    }

    // Setup keyboard spacer
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (<MemoryBookBackButton patient={patient} />),
        });
    }, [patient]);


    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    useFocusEffect(() => {
        const keyboardDidShowListener = Platform.OS === "ios" ? Keyboard.addListener('keyboardWillShow', (e) => { setKeyboardVisible(true), setKeyboardHeight(e.endCoordinates.height) }) : Keyboard.addListener('keyboardDidShow', (e) => { setKeyboardVisible(true), setKeyboardHeight(e.endCoordinates.height) });
        const keyboardDidHideListener = Platform.OS === "ios" ? Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false)) : Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(true));

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    });

    const pages = [
        { key: 'IntroPage', component: <IntroPage patient={patient} setPatient={setPatient} /> },
        { key: 'NicknamesPage', component: <NicknamesPage patient={patient} setPatient={setPatient} /> },
        { key: 'FamilyPage', component: <FamilyPage patient={patient} setPatient={setPatient} /> },
        { key: 'ChildhoodPage', component: <ChildhoodPage patient={patient} setPatient={setPatient} /> },
        { key: 'SchoolPage', component: <SchoolPage patient={patient} setPatient={setPatient} /> },
        { key: 'PetsPage', component: <PetsPage patient={patient} setPatient={setPatient} /> },
        { key: 'ValuesPage', component: <ValuesPage patient={patient} setPatient={setPatient} /> },
        { key: 'LikesPage', component: <LikesPage patient={patient} setPatient={setPatient} /> },
        { key: 'RoutinePage', component: <RoutinePage patient={patient} setPatient={setPatient} /> },
        { key: 'MarriagePage', component: <MarriagePage patient={patient} setPatient={setPatient} /> },
        { key: 'ChildrenPage', component: <ChildrenPage patient={patient} setPatient={setPatient} /> },
        { key: 'GrandchildrenPage', component: <GrandchildrenPage patient={patient} setPatient={setPatient} /> },
        { key: 'WorkPage', component: <WorkPage patient={patient} setPatient={setPatient} /> },
        { key: 'RetirementPage', component: <RetirementPage patient={patient} setPatient={setPatient} /> },
        { key: 'FriendshipsPage', component: <FriendshipsPage patient={patient} setPatient={setPatient} /> },
        { key: 'HobbiesPage', component: <HobbiesPage patient={patient} setPatient={setPatient} /> },
        { key: 'TravelPage', component: <TravelPage patient={patient} setPatient={setPatient} /> },
        { key: 'FirstsPage', component: <FirstsPage patient={patient} setPatient={setPatient} /> },
        { key: 'HomesPage', component: <HomesPage patient={patient} setPatient={setPatient} /> },
        { key: 'TraditionsPage', component: <TraditionsPage patient={patient} setPatient={setPatient} /> },
        { key: 'CarsPage', component: <CarsPage patient={patient} setPatient={setPatient} /> },
        { key: 'EventsPage', component: <EventsPage patient={patient} setPatient={setPatient} /> }
    ];

    return (
        <LinearGradient
            style={[globalStyles.pageContainer, { margin: 0, padding: 0 }]}
            colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>
            <FlatList
                data={pages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate={0}
                snapToInterval={PAGE_WIDTH}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ padding: 8, paddingBottom: 0 }}
                renderItem={({ item }) => (
                    <View style={{ width: PAGE_WIDTH }}>{item.component}</View>
                )}

                onScroll={(event) => handleScroll(event.nativeEvent.contentOffset.x)}
                ref={flatListRef}

                keyboardDismissMode="none"
            />

            <View style={{ padding: 16, paddingTop: 0 }}>
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
                            maximumValue={pages.length - 1}

                            step={1}
                            value={page}

                            onSlidingComplete={value => handlePageSlider(value)}

                            minimumTrackTintColor={COLOURS.purpleDark}
                            maximumTrackTintColor={COLOURS.purpleLight}
                            thumbTintColor={COLOURS.purpleLighter}
                        />
                    )
                }
            </View>

        </LinearGradient>
    )
}

export default MemoryBook;