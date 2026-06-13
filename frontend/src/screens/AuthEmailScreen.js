import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export default function AuthEmailScreen({ email, onNext }) {
  const [value, setValue] = useState(email);
  const isValid = value.includes("@");

  return (
    <View style={styles.screen}>
      <View style={styles.brand}>
        <Image source={require("../../assets/intro/amazon-now-transparent.png")} style={styles.logo} />
      </View>
      <View style={styles.panel}>
        <View style={styles.iconWrap}>
          <Ionicons name="person-outline" size={28} color={colors.amazonBlue} />
        </View>
        <Text style={styles.title}>Sign in with Amazon</Text>
        <Text style={styles.copy}>
          Use your Amazon email to sync Amazon Pay, saved addresses and previous orders.
        </Text>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          autoFocus
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setValue}
          placeholder="name@example.com"
          textContentType="emailAddress"
          value={value}
          style={styles.input}
        />
        <Pressable
          disabled={!isValid}
          onPress={() => onNext(value)}
          style={[styles.button, !isValid && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
        <Text style={styles.terms}>
          By continuing, you agree to the Amazon Now demo terms and privacy notice.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#eaf8fc",
    flex: 1,
    padding: 22,
    paddingTop: 52
  },
  brand: {
    alignItems: "center",
    marginBottom: 30
  },
  logo: {
    height: 86,
    resizeMode: "contain",
    width: 260
  },
  panel: {
    backgroundColor: "#ffffff",
    borderColor: "#d5e8ee",
    borderRadius: 8,
    borderWidth: 1,
    padding: 20
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#dff4fa",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  title: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 18
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 8
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 7,
    marginTop: 22
  },
  input: {
    borderColor: "#9ebbc5",
    borderRadius: 7,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    paddingHorizontal: 13,
    paddingVertical: 13
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.amazonOrange,
    borderRadius: 7,
    marginTop: 16,
    paddingVertical: 14
  },
  buttonDisabled: {
    opacity: 0.45
  },
  buttonText: {
    color: "#17202b",
    fontSize: 15,
    fontWeight: "900"
  },
  terms: {
    color: "#7a8790",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 18,
    textAlign: "center"
  }
});
