import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export type Level = "Prompting" | "Some Support" | "Step-by-Step Guidance" | "Full Assistance" | "Finish Assessment";

export type Patient = {
    id: number;
    firstName: string;
    middleNames?: string;
    lastName: string;

    dob: string;
    joined: string;

    fScore: number;
    fLevel: Level;
    lastAssessment: string;

    cookingLevel: number;
    dressingLevel: number;
    eatingLevel: number;
    choresLevel: number;
    washingLevel: number;
    readingLevel: number;
    communicationLevel: number;
    socialisingLevel: number;
    leisureLevel: number;
    physicalLevel: number;
    cognitiveLevel: number;

    hobbies?: string[];

    preferredLanguage?: string;
    birthplace?: string;
    familyBackground?: string;
    nicknames?: string;
    nicknameOrigin?: string;
    father?: string;
    mother?: string;
    parentsMeet?: string;
    siblings: boolean;
    siblingsLike?: string;
    siblingsRoom?: string;
    siblingsMemory?: string;
    childhoodLived?: string;
    childhoodFriends?: string;
    childhoodMemory?: string;
    friendsPlay?: string;
    school?: string;
    favSubject?: string;
    favTeacher?: string;
    schoolUniform?: string;
    schoolMemory?: string;
    pets?: string;
    petName?: string;
    petMemory?: string;
    personalValues?: string;
    religion?: string;
    likeSmell?: string;
    likeFood?: string;
    likeSeason?: string;
    likeSaying?: string;
    likeJoke?: string;
    likeShow?: string;
    likeRadio?: string;
    likeMusic?: string;
    likeHobby?: string;
    likeSport?: string;
    likeTime?: string;
    dislikeSmell?: string;
    dislikeFood?: string;
    dislikeSeason?: string;
    dislikeShow?: string;
    dislikeRadio?: string;
    dislikeMusic?: string;
    dislikeSport?: string;
    dislikeTime?: string;
    routineMorning?: string;
    routineLunch?: string;
    routineAfternoon?: string;
    routineEvening?: string;
    routineNight?: string;
    married: boolean;
    marriedWho?: string;
    marriedWhen?: string;
    marriedAt?: string;
    marriedMemory?: string;
    partnerWho?: string;
    partnerMet?: string;
    childrenNames?: string;
    childrenNameReasons?: string;
    childrenLikeYou?: string;
    childrenStories?: string;
    childrenActivities?: string;
    grandchildrenNames?: string;
    grandchildrenLikeYou?: string;
    grandchildrenStories?: string;
    grandchildrenActivities?: string;
    jobFirst?: string;
    jobStartAge?: number;
    jobPay?: string;
    jobFav?: string;
    jobYears?: number;
    jobOthers?: string;
    jobMemory?: string;
    retiredJob?: string;
    retiredYears?: number;
    retiredParty?: string;
    retiredFeelings?: string;
    retiredDid?: string;
    friends?: string;
    friendsThen?: string;
    friendsMeet?: string;
    friendsMemory?: string;
    favHobbies?: string;
    clubs?: string;
    tripFav?: string;
    tripWhen?: string;
    tripBestPart?: string;
    tripWith?: string;
    otherTrips?: string;
    firstDrink?: string;
    firstDate?: string;
    firstDance?: string;
    firstKiss?: string;
    firstLove?: string;
    homeFav?: string;
    homeBecause?: string;
    homeWhat?: string;
    homeGarden?: string;
    homeDecorate?: string;
    traditions?: string;
    familyTrip?: string;
    pocketMoney?: number;
    newYear?: string;
    mealTime?: string;
    weekends?: string;
    carsPassed?: number;
    carsFirst?: string;
    carsFav?: string;
    carsPlace?: string;
    eventBig?: string;
    eventCovid?: string;
    eventTowers?: string;
    eventBrexit?: string;
    eventKennedy?: string;
    eventMoon?: string;
    eventPhone?: string;
    eventBerlin?: string;
    eventChernobyl?: string;
    eventGulf?: string;
}

export type Activity = {
    "activityName": string;
    "activityCategory": string;
    "relativeQuestions": string[],
    "Prompting": string[];
    "Some Support": string[];
    "Step-by-Step Guidance": string[];
    "Full Assistance": string[];
}

// List of screens that are allowed
export type RootStackParamList = {
    PatientDirectory: undefined;
    AddPatient: undefined;
    FunctionalityTest: { patient: Patient };
    PatientProfile: { patient: Patient };
    DailyActivities: { patient: Patient };
    Hobbies: { patient: Patient, category: string };
    ActivitySectionMenu: { patient: Patient, activityName: string };
    ActivityPage: { patient: Patient, activityName: string, section: number };
    PatientInfo: { patient: Patient };
    LifeStory: { patient: Patient };
    About: undefined;
}


// Used to auto fill navigation tools with allowed scenes
export type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type PatientRouteProp = RouteProp<RootStackParamList, "PatientProfile">;
export type HobbiesRouteProp = RouteProp<RootStackParamList, "Hobbies">;
export type ActivitySectionsRouteProp = RouteProp<RootStackParamList, "ActivitySectionMenu">;
export type ActivityRouteProp = RouteProp<RootStackParamList, "ActivityPage">;