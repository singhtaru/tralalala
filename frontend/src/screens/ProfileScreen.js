import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { colors } from "../theme/colors";

export default function ProfileScreen({ goBack }) {
  return (
    <View style={styles.screen}>
      <ScreenTopBar title="Your Account" goBack={goBack} />
      <View style={styles.content}>
        <Ionicons name="person-circle-outline" size={86} color={colors.amazonBlue} />
        <Text style={styles.name}>Shivani Srivastava</Text>
        <Text style={styles.detail}>Home delivery account</Text>
        <Pressable style={styles.loginButton}>
          <Text style={styles.loginText}>Sign in or manage account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  content: {
    alignItems: "center",
    padding: 28
  },
  name: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10
  },
  detail: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5
  },
  loginButton: {
    backgroundColor: colors.amazonOrange,
    borderRadius: 8,
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 14
  },
  loginText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  }
});
