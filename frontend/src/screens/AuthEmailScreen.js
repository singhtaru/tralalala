import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export default function AuthEmailScreen({
  email,
  onNext,
  focusInput,
  updateKeyboardValue,
  hideKeyboard
}) {
  const [value, setValue] = useState(email || "");
  const isValid = value.includes("@");
  const valueRef = useRef(value);
  valueRef.current = value;

  const triggerFocus = () => {
    focusInput({
      type: "text",
      value: valueRef.current,
      placeholder: "name@example.com",
      onChangeText: (text) => {
        setValue(text);
        valueRef.current = text;
      },
      onSubmit: () => {
        if (valueRef.current.includes("@")) {
          onNext(valueRef.current);
        }
      }
    });
  };

  useEffect(() => {
    triggerFocus();
    return () => hideKeyboard();
  }, []);

  const handleTextChange = (text) => {
    setValue(text);
    valueRef.current = text;
    updateKeyboardValue(text);
  };

  const handleClear = () => {
    setValue("");
    valueRef.current = "";
    updateKeyboardValue("");
  };

  return (
    <View style={styles.screen}>
      {/* iOS Top Nav Bar */}
      <View style={styles.navBar}>
        <Text style={styles.navCancel}>Cancel</Text>
        <Text style={styles.navTitle}>amazon.in</Text>
        <Ionicons name="ellipsis-horizontal" size={20} color="#007aff" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Sign in</Text>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Enter the email address associated with your Amazon account.
          </Text>
        </View>

        {/* iOS Styled Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email (phone for mobile accounts)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={value}
              onChangeText={handleTextChange}
              onFocus={triggerFocus}
              placeholder="name@example.com"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              showSoftInputOnFocus={false} // Prevents native OS keyboard popups in web
            />
            {value.length > 0 ? (
              <Pressable onPress={handleClear} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Primary iOS Action Button */}
        <Pressable
          disabled={!isValid}
          onPress={() => onNext(value)}
          style={[styles.button, !isValid && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>

        <Text style={styles.terms}>
          By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.
        </Text>

        {/* Secondary styling links for authenticity */}
        <View style={styles.accordionHeader}>
          <Ionicons name="caret-forward" size={12} color="#4b5563" />
          <Text style={styles.accordionText}>Need help?</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  navBar: {
    alignItems: "center",
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  navCancel: {
    color: "#007aff",
    fontSize: 16,
    fontWeight: "400"
  },
  navTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24
  },
  title: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "300",
    marginBottom: 16
  },
  infoBox: {
    marginBottom: 20
  },
  infoText: {
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20
  },
  inputContainer: {
    marginBottom: 18
  },
  inputLabel: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6
  },
  inputWrapper: {
    alignItems: "center",
    borderColor: "#a1a1aa",
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: "row",
    height: 44,
    paddingHorizontal: 10
  },
  input: {
    color: "#000000",
    flex: 1,
    fontSize: 16,
    height: "100%",
    outlineStyle: "none" // prevents web border highlight
  },
  clearButton: {
    padding: 4
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ff9900",
    borderRadius: 4,
    height: 44,
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1
  },
  buttonDisabled: {
    backgroundColor: "#f3d078",
    opacity: 0.8
  },
  buttonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "500"
  },
  terms: {
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 18
  },
  accordionHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 24
  },
  accordionText: {
    color: "#0066c0",
    fontSize: 13,
    marginLeft: 6
  }
});
