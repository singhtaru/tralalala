import React from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";

export default function AppShell({ children }) {
  return (
    <View style={styles.desktopStage}>
      <View style={styles.phoneFrame}>
        <View style={styles.speaker} />
        <SafeAreaView style={styles.phoneScreen}>{children}</SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopStage: {
    alignItems: "center",
    backgroundColor: colors.desktopBackground,
    flex: 1,
    justifyContent: "center",
    padding: Platform.OS === "web" ? 18 : 0
  },
  phoneFrame: {
    ...shadows.phone,
    backgroundColor: "#050607",
    borderRadius: Platform.OS === "web" ? 46 : 0,
    height: Platform.OS === "web" ? 852 : "100%",
    maxHeight: "98%",
    maxWidth: 393,
    overflow: "hidden",
    padding: Platform.OS === "web" ? 10 : 0,
    width: Platform.OS === "web" ? 393 : "100%"
  },
  speaker: {
    alignSelf: "center",
    backgroundColor: "#1b1f24",
    borderRadius: 4,
    display: Platform.OS === "web" ? "flex" : "none",
    height: 5,
    marginBottom: 8,
    width: 72
  },
  phoneScreen: {
    backgroundColor: colors.appBackground,
    borderRadius: Platform.OS === "web" ? 34 : 0,
    flex: 1,
    overflow: "hidden"
  }
});
