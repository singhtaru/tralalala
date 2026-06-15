import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function HomeHeader({ customer, setScreen }) {
  const initial = customer.name?.trim()?.[0]?.toUpperCase() || "A";

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.locationLabel}>Delivering in 10 mins</Text>
        <Text numberOfLines={1} style={styles.location}>Home - Shivani Srivastava</Text>
      </View>
      <Pressable onPress={() => setScreen("profile")} style={styles.profileButton}>
        <Text style={styles.initial}>{initial}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: "#e8f8fb",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 14,
    paddingHorizontal: 18,
    paddingTop: 16
  },
  locationLabel: {
    color: "#007185",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2
  },
  location: {
    color: colors.amazonBlue,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 2,
    maxWidth: 245
  },
  profileButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 22,
    height: 42,
    justifyContent: "center",
    width: 42,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6
  },
  initial: {
    color: colors.amazonBlue,
    fontSize: 17,
    fontWeight: "800"
  }
});
