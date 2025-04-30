import { StatusBar } from "expo-status-bar";
import React, { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import Navigator from "./Navigator";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import COLOURS from "./constants/colours";

import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";

// RevenueCat
import Purchases, { LOG_LEVEL } from "react-native-purchases";
Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

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

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    if (Platform.OS === "ios") {
      if (!process.env.EXPO_PUBLIC_RC_IOS) {
        Alert.alert(
          "RC Error Config",
          "RevenueCat API key for ios not provided"
        );
      } else {
        Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_IOS });
      }
    } else if (Platform.OS === "android") {
      if (!process.env.EXPO_PUBLIC_RC_ANDROID) {
        Alert.alert(
          "RC Error Config",
          "RevenueCat API key for android not provided"
        );
      } else {
        Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_ANDROID });
      }
    }
  }, [])

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