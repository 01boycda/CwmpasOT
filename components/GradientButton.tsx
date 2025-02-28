import { LinearGradient } from 'expo-linear-gradient';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';
import globalStyles from '../constants/styles';
import FONTSTYLES from '../constants/fontstyles';
import COLOURS from '../constants/colours';
import { AntDesign } from '@expo/vector-icons';

type buttonProps = {
    onPress: () => void;
    text?: string;
    type?: "selected" | "disabled" | "danger" | "normal";
    textColour?: string;
    icon?: React.JSX.Element;
}

const GradientButton = ({ onPress, text, type = "normal", textColour, icon }: buttonProps) => {
    let colors: readonly [string, string, ...string[]] = ["", ""];
    let border: string = '#ffffff';

    switch (type) {
        case "selected":
            colors = [COLOURS.buttonSelectedTop, COLOURS.buttonSelectedBottom];
            border = COLOURS.buttonSelectedBorder;
            break;
        case "disabled":
            colors = [COLOURS.buttonDisabledTop, COLOURS.buttonDisabledBottom];
            border = COLOURS.buttonDisabledBorder;
            break;
        case "danger":
            colors = [COLOURS.buttonDangerTop, COLOURS.buttonDangerBottom];
            border = COLOURS.buttonDangerBorder;
            break;
        default:
            colors = [COLOURS.buttonTop, COLOURS.buttonBottom];
            border = COLOURS.buttonBorder;
            break;
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={type === "disabled" ? true : false}>
            <LinearGradient
                style={[globalStyles.button, { borderColor: border }]}
                colors={colors}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}>
                {icon && icon}
                {text && <Text style={[FONTSTYLES.buttonText, textColour && { color: textColour }]}>{text}</Text>}
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default GradientButton;