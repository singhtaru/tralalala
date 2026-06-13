import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

const slides = [
  {
    title: "AI Shopping Assistant",
    subtitle: "Speak your need, get it delivered. The assistant understands your situation and compiles your essentials instantly.",
    icon: "sparkles",
    library: "ion",
    color: "#e0f2fe",
    iconColor: "#0284c7"
  },
  {
    title: "Emergency Mode",
    subtitle: "Urgent needs can't wait. Access dedicated carts for injury, fever, baby care, or power outages with 10-15 min delivery.",
    icon: "flash",
    library: "ion",
    color: "#fef2f2",
    iconColor: "#dc2626"
  },
  {
    title: "Alexa Voice Ordering",
    subtitle: "Conversational shopping has arrived. Tell Alexa what you need, review the AI recommended cart, and confirm orders in one tap.",
    icon: "microphone",
    library: "ion",
    color: "#ecfeff",
    iconColor: "#0891b2"
  },
  {
    title: "Emergency Deposit Wallet",
    subtitle: "Protect your urgent purchases. Set up an emergency deposit to cover critical order totals when your standard wallet is low.",
    icon: "shield-checkmark",
    library: "ion",
    color: "#f0fdf4",
    iconColor: "#16a34a"
  }
];

export default function OnboardingScreen({ onFinish }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      onFinish();
    }
  };

  const current = slides[activeSlide];
  const Icon = current.library === "material" ? MaterialCommunityIcons : Ionicons;

  return (
    <View style={styles.screen}>
      {/* Skip button in header */}
      <View style={styles.header}>
        <Pressable onPress={onFinish} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Main presentation block */}
      <View style={styles.body}>
        <View style={[styles.iconContainer, { backgroundColor: current.color }]}>
          <Icon name={current.icon} size={64} color={current.iconColor} />
        </View>

        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </View>

      {/* Footer controls */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeSlide === index && styles.dotActive
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Pressable onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>
            {activeSlide === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#111827" style={{ marginLeft: 6 }} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20
  },
  header: {
    alignItems: "flex-end",
    height: 40,
    justifyContent: "center"
  },
  skipButton: {
    padding: 6
  },
  skipText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "700"
  },
  body: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40
  },
  iconContainer: {
    alignItems: "center",
    borderRadius: 48,
    height: 120,
    justifyContent: "center",
    marginBottom: 32,
    width: 120,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8
  },
  title: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16
  },
  subtitle: {
    color: "#4b5563",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 10
  },
  footer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 32
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 28
  },
  dot: {
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    height: 8,
    width: 8
  },
  dotActive: {
    backgroundColor: "#ff9900",
    width: 24
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ff9900",
    borderRadius: 8,
    flexDirection: "row",
    height: 48,
    justifyContent: "center",
    width: "100%",
    shadowColor: "#ff9900",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6
  },
  buttonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900"
  }
});
