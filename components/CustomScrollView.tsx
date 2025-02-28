import { ScrollView } from "react-native";
import globalStyles from "../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import COLOURS from "../constants/colours";

const CustomScrollView = (props: any) => {
    
    return (
        <LinearGradient
            style={globalStyles.scrollContainer}
            colors={[COLOURS.textContainerGradBottom, COLOURS.textContainerGradTop, COLOURS.textContainerGradTop, COLOURS.textContainerGradBottom]}
            locations={[0, 0.2, 0.8, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}>

            <ScrollView
                contentContainerStyle={globalStyles.scrollContainerContent}

                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                {...props}
            />

        </LinearGradient>
    );
};

export default CustomScrollView;