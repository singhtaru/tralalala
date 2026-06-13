import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function AuthOtpScreen({
  email,
  onBack,
  onVerified,
  focusInput,
  updateKeyboardValue,
  hideKeyboard,
  triggerSms
}) {
  const [otp, setOtp] = useState("");
  const [smsArrived, setSmsArrived] = useState(false);
  const otpRef = useRef(otp);
  otpRef.current = otp;

  const triggerFocus = (hasSms = false) => {
    focusInput({
      type: "numeric",
      value: otpRef.current,
      placeholder: "",
      onChangeText: (text) => {
        const clean = text.replace(/[^0-9]/g, "").slice(0, 6);
        setOtp(clean);
        otpRef.current = clean;
        updateKeyboardValue(clean);
      },
      onSubmit: () => {
        if (otpRef.current === "123456") {
          onVerified();
        }
      },
      suggestion: hasSms ? "123456" : null
    });
  };

  useEffect(() => {
    // Initial focus on numeric keyboard without suggestion
    triggerFocus(false);

    // Simulate SMS arrival after 2 seconds
    const timer = setTimeout(() => {
      setSmsArrived(true);
      triggerSms();
      // Re-focus keyboard with SMS AutoFill suggestion!
      triggerFocus(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      hideKeyboard();
    };
  }, []);

  // Watch OTP changes to auto-verify when 6 digits are reached
  useEffect(() => {
    if (otp === "123456") {
      // Small timeout for visual confirmation of the 6th digit filling
      const t = setTimeout(() => {
        onVerified();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [otp]);

  // Re-trigger focus with SMS suggestion if keyboard is opened/closed
  const handleFocusClick = () => {
    triggerFocus(smsArrived);
  };

  return (
    <View style={styles.screen}>
      {/* iOS Top Nav Bar */}
      <View style={styles.navBar}>
        <Pressable onPress={onBack} style={styles.navBack}>
          <Ionicons name="chevron-back" size={24} color="#007aff" />
          <Text style={styles.navBackText}>Back</Text>
        </Pressable>
        <Text style={styles.navTitle}>Verification</Text>
        <View style={styles.navPlaceholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter security code</Text>
        <Text style={styles.subtitle}>
          For security, we've sent a one-time verification code to:{"\n"}
          <Text style={styles.emailHighlight}>{email}</Text>
        </Text>

        {/* 6 Digit Passcode Display Box Row */}
        <Pressable onPress={handleFocusClick} style={styles.otpRow}>
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const digit = otp[index] || "";
            const isActive = otp.length === index;
            return (
              <React.Fragment key={index}>
                {/* Visual gap spacer between box 2 and 3 (splitting 3 and 3 digits) */}
                {index === 3 ? <View style={styles.otpSeparator} /> : null}
                
                <View style={[styles.otpBox, isActive && styles.otpBoxActive, digit && styles.otpBoxFilled]}>
                  {isActive ? (
                    <View style={styles.blinkingCursor} />
                  ) : (
                    <Text style={styles.otpText}>{digit}</Text>
                  )}
                </View>
              </React.Fragment>
            );
          })}
        </Pressable>

        {otp.length === 6 && otp !== "123456" ? (
          <Text style={styles.errorText}>Invalid code. Please try again.</Text>
        ) : null}

        {/* Action Button */}
        <Pressable
          disabled={otp.length !== 6}
          onPress={() => {
            if (otp === "123456") onVerified();
          }}
          style={[styles.button, otp.length !== 6 && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Submit Code</Text>
        </Pressable>

        <View style={styles.linksRow}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <Pressable onPress={() => triggerFocus(smsArrived)}>
            <Text style={styles.resendLink}>Resend Code</Text>
          </Pressable>
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
    paddingHorizontal: 8
  },
  navBack: {
    alignItems: "center",
    flexDirection: "row"
  },
  navBackText: {
    color: "#007aff",
    fontSize: 16
  },
  navTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700"
  },
  navPlaceholder: {
    width: 60
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28
  },
  title: {
    color: "#000000",
    fontSize: 26,
    fontWeight: "300",
    marginBottom: 10
  },
  subtitle: {
    color: "#4b5563",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28
  },
  emailHighlight: {
    color: "#000000",
    fontWeight: "700"
  },
  otpRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 28,
    width: "100%"
  },
  otpBox: {
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    marginHorizontal: 4,
    width: 40,
    borderColor: "#d1d5db",
    borderWidth: 1
  },
  otpBoxActive: {
    borderColor: "#007aff",
    borderWidth: 1.5,
    backgroundColor: "#ffffff"
  },
  otpBoxFilled: {
    backgroundColor: "#ffffff",
    borderColor: "#9ca3af"
  },
  otpText: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "700"
  },
  otpSeparator: {
    height: 2,
    width: 12,
    backgroundColor: "#9ca3af",
    marginHorizontal: 6
  },
  blinkingCursor: {
    backgroundColor: "#007aff",
    height: 20,
    width: 2
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ff9900",
    borderRadius: 4,
    height: 44,
    justifyContent: "center",
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
  linksRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22
  },
  resendText: {
    color: "#4b5563",
    fontSize: 13
  },
  resendLink: {
    color: "#0066c0",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6
  }
});
