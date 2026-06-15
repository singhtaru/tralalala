import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function PromoBanner({ onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.banner}>
      <View style={styles.copy}>
        <Text style={styles.kicker}>amazon now</Text>
        <Text style={styles.title}>Fresh picks, fastest delivery</Text>
        <Text style={styles.sub}>Groceries, snacks and daily essentials at your door.</Text>
      </View>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80" }}
        style={styles.image}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.softYellow,
    borderRadius: 14,
    flexDirection: "row",
    margin: 16,
    minHeight: 132,
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10
  },
  copy: {
    flex: 1,
    justifyContent: "center",
    padding: 16
  },
  kicker: {
    color: "#007185",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 27,
    marginTop: 5
  },
  sub: {
    color: "#5f6670",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    marginTop: 6
  },
  image: {
    width: 132
  }
});
