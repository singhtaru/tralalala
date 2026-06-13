import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function HomeHeader({ setScreen }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.locationLabel}>Delivering in 10 mins</Text>
        <Text numberOfLines={1} style={styles.location}>Home - Shivani Srivastava</Text>
      </View>
      <Pressable onPress={() => setScreen("profile")} style={styles.profileButton}>
        <Ionicons name="person-circle-outline" size={34} color={colors.amazonBlue} />
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
    paddingBottom: 12,
    paddingHorizontal: 18,
    paddingTop: 14
  },
  locationLabel: {
    color: "#007185",
    fontSize: 13,
    fontWeight: "900"
  },
  location: {
    color: colors.amazonBlue,
    fontSize: 18,
    fontWeight: "900",
    maxWidth: 245
  },
  profileButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40
  }
});
