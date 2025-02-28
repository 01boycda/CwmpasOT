import { useState } from "react";
import { Modal, Platform, StyleSheet, Text, Touchable, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

import COLOURS from "./../constants/colours";
import globalStyles from "./../constants/styles";
import { textSize } from "./../constants/constantValues";
import GradientButton from "./GradientButton";

type DatePickerProps = {
    setDateString: React.Dispatch<React.SetStateAction<string>>;
    showPicker: boolean;
    setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatePicker = ({ setDateString, showPicker, setShowPicker }: DatePickerProps) => {
    const [date, setDate] = useState<DateType>(dayjs());

    const onChange = (selectedDate: DateType) => {
        if (selectedDate) {
            setDateString(dayjs(selectedDate).format('DD/MM/YYYY'));
            setDate(selectedDate);
            setShowPicker(!showPicker);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showPicker}
            onRequestClose={() => setShowPicker(!showPicker)}
        >
            <LinearGradient
                style={globalStyles.hoverContainer}
                colors={[COLOURS.backgroundGradTop, COLOURS.backgroundGradBottom]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>

                <DateTimePicker
                    mode="single"
                    date={date}
                    onChange={(params) => onChange(params.date?.toLocaleString())}
                />

                <GradientButton onPress={() => setShowPicker(!showPicker)} text="CLOSE" />

            </LinearGradient>
        </Modal>
    )
}

export default DatePicker;

const styles = StyleSheet.create({
    button: {
        flex: 1,
        borderRadius: 50,
        padding: 16,
    },
    buttonText: {
        color: COLOURS.white,
        fontSize: textSize[1],
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    }
})