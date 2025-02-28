import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import Navigator from "./Navigator";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import COLOURS from "./constants/colours";

const App = () => {
  const [loaded, error] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.appContainer}>
          <Navigator />
        </SafeAreaView>
        <StatusBar style="light" />
      </View>

  )
}

export default App;

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: COLOURS.header,
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
})