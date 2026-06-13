import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"];

export default function AuthOtpScreen({ email, onBack, onVerified }) {
  const [otp, setOtp] = useState("");
  const isCorrect = otp === "1234";

  const pressKey = (key) => {
    if (key === "clear") {
      setOtp("");
      return;
    }
    if (key === "back") {
      setOtp((value) => value.slice(0, -1));
      return;
    }
    setOtp((value) => (value.length < 4 ? `${value}${key}` : value));
  };

  return (
    <View style={styles.screen}>
      <Pressable onPress={onBack} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color={colors.amazonBlue} />
      </Pressable>
      <View style={styles.message}>
        <Text style={styles.messageTitle}>Amazon Now OTP</Text>
        <Text style={styles.messageText}>Your verification code is 1234</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.eyebrow}>VERIFY AMAZON ACCOUNT</Text>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.copy}>Sent to the phone registered with {email}</Text>
        <View style={styles.otpRow}>
          {[0, 1, 2, 3].map((index) => (
            <View key={index} style={[styles.otpBox, otp[index] && styles.otpBoxFilled]}>
              <Text style={styles.otpDigit}>{otp[index] || ""}</Text>
            </View>
          ))}
        </View>
        <Pressable onPress={() => setOtp("1234")} style={styles.otpSuggestion}>
          <Ionicons name="chatbubble-ellipses" size={16} color="#2673c9" />
          <Text style={styles.otpSuggestionText}>1234 from Messages</Text>
        </Pressable>
        {otp.length === 4 && !isCorrect ? (
          <Text style={styles.error}>Incorrect OTP. Copy the message code above.</Text>
        ) : null}
        {isCorrect ? (
          <Pressable onPress={onVerified} style={styles.button}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.keypad}>
        {keys.map((key) => (
          <Pressable key={key} onPress={() => pressKey(key)} style={styles.key}>
            {key === "back" ? (
              <Ionicons name="backspace-outline" size={25} color={colors.ink} />
            ) : (
              <Text style={styles.keyText}>{key === "clear" ? "Clear" : key}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#eaf8fc",
    flex: 1,
    padding: 18,
    paddingTop: 34
  },
  back: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  message: {
    alignSelf: "stretch",
    backgroundColor: "#ffffff",
    borderColor: "#cfe7ef",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    padding: 14
  },
  messageTitle: {
    color: colors.amazonBlue,
    fontSize: 14,
    fontWeight: "900"
  },
  messageText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4
  },
  panel: {
    backgroundColor: "#ffffff",
    borderColor: "#d5e8ee",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 18
  },
  eyebrow: {
    color: "#007185",
    fontSize: 11,
    fontWeight: "900"
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 8
  },
  otpRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18
  },
  otpBox: {
    alignItems: "center",
    borderColor: "#9ebbc5",
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    height: 54,
    justifyContent: "center"
  },
  otpBoxFilled: {
    borderColor: colors.sky,
    backgroundColor: "#effbff"
  },
  otpDigit: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900"
  },
  error: {
    color: "#b42318",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center"
  },
  otpSuggestion: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#edf6ff",
    borderRadius: 16,
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  otpSuggestionText: {
    color: "#2673c9",
    fontSize: 12,
    fontWeight: "900"
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.amazonOrange,
    borderRadius: 7,
    marginTop: 16,
    paddingVertical: 14
  },
  buttonText: {
    color: "#17202b",
    fontSize: 15,
    fontWeight: "900"
  },
  keypad: {
    bottom: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    left: 18,
    position: "absolute",
    right: 18
  },
  key: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    flexBasis: "30.9%",
    height: 52,
    justifyContent: "center"
  },
  keyText: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: "800"
  }
});
