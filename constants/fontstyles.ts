import React from "react"
import { StyleSheet } from "react-native"

import COLOURS from "./colours"
import { textSize } from "./constantValues"

const FONTSTYLES = StyleSheet.create({
    buttonText: {
        color: COLOURS.white,
        fontSize: textSize[3],
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
    dropdownText: {
        color: COLOURS.purpleDark,
        fontSize: textSize[2],
        fontFamily: 'Roboto-Regular',
    },
    iconText: {
        color: COLOURS.purpleLight,
        fontSize: textSize[0],
        fontFamily: 'Roboto-Regular',
        marginTop: 4,
    },
    inputHeaderText: {
        color: COLOURS.purpleDark,
        fontSize: textSize[2],
        fontFamily: 'Roboto-Regular',
    },
    lightText: {
        color: COLOURS.purpleLighter,
        fontSize: textSize[1],
        fontFamily: 'Roboto-Regular',
    },
    pageHeaderText: {
        color: COLOURS.purpleDark,
        fontSize: textSize[4],
        margin: 2,
        fontFamily: 'Roboto-Regular',
        textAlign: "center",
        justifyContent: "center",
        textAlignVertical: "center",
    },
    screenHeaderText: {
        color: COLOURS.white,
        fontSize: textSize[4],
        margin: 2,
        fontFamily: 'Roboto-Regular',
        textAlign: "center",
        justifyContent: "center",
        textAlignVertical: "center",
    },
    questionText: {
        color: COLOURS.white,
        fontSize: 16,
        textAlign: 'left',
        fontFamily: 'Roboto-Regular',
        textAlignVertical: 'bottom',
    },
    subheaderText: {
        color: COLOURS.purpleDark,
        fontSize: textSize[2],
        fontWeight: '200',
        fontFamily: 'Roboto-Regular',
        textAlign: "center",
    },
    textBox: {
        color: COLOURS.black,
        fontSize: textSize[1],
        fontFamily: 'Roboto-Regular',
    },
})

export default FONTSTYLES;