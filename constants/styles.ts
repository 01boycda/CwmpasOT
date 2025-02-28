import { Dimensions, Platform, StyleSheet } from "react-native";
import COLOURS from "./colours";
import { BORDER_WIDTH, textSize } from "./constantValues";

const screenDimensions = Dimensions.get('screen');

const globalStyles = StyleSheet.create({

    button: {
        borderColor: COLOURS.buttonBorder,
        borderWidth: BORDER_WIDTH,
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 10,
    },

    centerContent: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
    },

    checkbox: {
        height: 40,
        width: 40,
    },

    datePicker: {
        height: 120,
    },
    datePickerButton: {
        backgroundColor: COLOURS.purpleLighter,
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        padding: 14,
    },

    dropdown: {
        height: 70,

        borderColor: COLOURS.purpleDark,
        borderWidth: BORDER_WIDTH,
        borderRadius: 10,

        backgroundColor: COLOURS.white,
        marginBottom: 6,
        padding: 10,
        justifyContent: 'center',
    },
    dropdownList: {
        borderColor: COLOURS.purpleDark,
        borderWidth: BORDER_WIDTH,
        borderTopWidth: 0,
        borderRadius: 10,

        backgroundColor: COLOURS.white,
        marginBottom: 6,
        padding: 10,
        justifyContent: 'center',

    },
    dropdownSelected: {
        borderRadius: 10,
        backgroundColor: COLOURS.purpleStrong,

        color: COLOURS.purpleLight,
    },
    headerButtonContainer: {
        margin: 20,
        marginVertical: 10,
        minWidth: 40,
    },
    headerContainer: {
        backgroundColor: COLOURS.header,
        borderBottomWidth: 3,
        borderBottomColor: COLOURS.purpleDark,
        borderStyle: 'solid',
        height: screenDimensions.height / 10,
    },

    hoverContainer: {
        alignSelf: "center",
        position: "absolute",
        width: screenDimensions.width - 32,
        padding: 16,
        bottom: 16,

        rowGap: 10,

        backgroundColor: COLOURS.purpleLight,

        // Border
        borderColor: COLOURS.purpleDark,
        borderRadius: 10,
        borderWidth: BORDER_WIDTH,

        // Shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    infoBox: {
        backgroundColor: COLOURS.yellowlight,
        
        borderColor: COLOURS.purpleDark,
        borderRadius: 10,
        borderWidth: BORDER_WIDTH,

        padding: 10,
        width: 300,
    },
    infoIconFill: {
        position: "absolute",
        left: 10,
        top: 10,

        width: 40,
        height: 35,

        backgroundColor: COLOURS.yellowlight,
        borderRadius: 20
    },

    input: {
        borderColor: COLOURS.purpleDark,
        borderWidth: BORDER_WIDTH,
        borderRadius: 10,

        backgroundColor: COLOURS.white,
        padding: 10,

        color: COLOURS.purpleDark,
        fontSize: textSize[3],
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
    },

    pageContainer: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: COLOURS.purpleLight,
        padding: 16,
        rowGap: 10,
    },

    questionButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,

        backgroundColor: COLOURS.purpleSoft,

        borderColor: COLOURS.purpleDark,
        borderWidth: BORDER_WIDTH,
        borderRadius: 10,
    },

    scrollContainer: {
        flex: 1,
        borderColor: COLOURS.purpleDark,
        borderRadius: 10,
        borderWidth: BORDER_WIDTH,
    },
    scrollContainerContent: {
        padding: 10,
        rowGap: 10,
    },
})

export default globalStyles;