import React from "react";
import { Text, TextProps } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";

import COLOURS from "./constants/colours";
import FONTSTYLES from "./constants/fontstyles";
import globalStyles from "./constants/styles";

import { RootStackParamList } from "./constants/types";

// Screens
import PatientDirectory from "./screens/PatientDirectory";
import AddPatient from "./screens/AddPatient";
import FunctionalityTest from "./screens/FunctionalityTest";
import PatientProfile, { styles } from "./screens/PatientProfile";
import DailyActivities from "./screens/DailyActivities";
import Hobbies from "./screens/Hobbies";
import ActivitySectionMenu from "./screens/ActivitySectionMenu";
import ActivityPage from "./screens/ActivityPage";
import PatientInfo from "./screens/PatientInfo";
import MemoryBook from "./screens/MemoryBook";
import About from "./screens/About";

// Custom Components
import { BackButton, HomeButton, HomeButtonArrow } from "./components/HeaderButtons";
import { RevenueCatProvider } from "./RevenueCatProvider";

const Stack = createStackNavigator<RootStackParamList>();
const Navigator: React.FC = () => {

    const defaultNavProps: StackNavigationOptions = {
        headerLeftContainerStyle: { minWidth: "20%", maxWidth: "20%" },
        headerRightContainerStyle: { minWidth: "20%", maxWidth: "20%" },


        headerStyle: globalStyles.headerContainer,
        headerTitleStyle: FONTSTYLES.screenHeaderText,
        headerTitleAlign: 'center',
        headerTintColor: COLOURS.purpleLight,
        gestureEnabled: false,

        headerTitleContainerStyle: { minWidth: "60%", maxWidth: "60%", marginHorizontal: 0 }
    }

    const createHeaderTitle = (title: string) => (
        <Text style={FONTSTYLES.screenHeaderText} adjustsFontSizeToFit numberOfLines={1}>{title}</Text>
    );

    return (
            <NavigationContainer >
                <Stack.Navigator>

                    <Stack.Screen name="PatientDirectory" component={PatientDirectory}
                        options={{ ...defaultNavProps, headerTitle: () => createHeaderTitle("User Directory") }} />

                    <Stack.Screen name="AddPatient" component={AddPatient}
                        options={{ ...defaultNavProps, headerTitle: "Add User", headerLeft: () => (<BackButton />) }} />

                    <Stack.Screen name="FunctionalityTest" component={FunctionalityTest}
                        options={{ ...defaultNavProps, headerLeft: () => (<HomeButtonArrow />), headerTitle: () => createHeaderTitle("Questionnaire") }} />

                    <Stack.Screen name="PatientProfile" component={PatientProfile}
                        options={({ route }: { route: any }) => ({ ...defaultNavProps, headerTitle: () => createHeaderTitle(`${route.params.patient.firstName} ${route.params.patient.lastName[0]}`), headerLeft: () => (<HomeButton />) })} />

                    <Stack.Screen name={"DailyActivities"} component={DailyActivities}
                        options={{ ...defaultNavProps, headerTitle: () => createHeaderTitle("Daily Activities"), headerLeft: () => (<BackButton />) }} />

                    <Stack.Screen name={"Hobbies"} component={Hobbies}
                        options={({ }) => ({ ...defaultNavProps, headerTitle: "Hobbies", headerLeft: () => (<BackButton />) })} />

                    <Stack.Screen name={"ActivitySectionMenu"} component={ActivitySectionMenu}
                        options={({ }) => ({ ...defaultNavProps, headerTitle: () => createHeaderTitle("Activity Section"), headerLeft: () => (<BackButton />) })} />

                    <Stack.Screen name={"ActivityPage"} component={ActivityPage}
                        options={({ route }: { route: any }) => ({ ...defaultNavProps, headerTitle: () => createHeaderTitle(`${route.params.activityName}`), headerLeft: () => (<BackButton />) })} />

                    <Stack.Screen name={"PatientInfo"} component={PatientInfo}
                        options={{ ...defaultNavProps, headerTitle: "User Info" }} />

                    <Stack.Screen name={"LifeStory"} component={MemoryBook}
                        options={{ ...defaultNavProps, headerTitle: "Life Story" }} />

                    <Stack.Screen name={"About"} component={About}
                        options={{ ...defaultNavProps, headerTitle: "About Us", headerLeft: () => (<BackButton />) }} />

                </Stack.Navigator>
            </NavigationContainer>
    )
}

export default Navigator;