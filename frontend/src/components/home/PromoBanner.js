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
    borderRadius: 8,
    flexDirection: "row",
    margin: 16,
    minHeight: 132,
    overflow: "hidden"
  },
  copy: {
    flex: 1,
    justifyContent: "center",
    padding: 14
  },
  kicker: {
    color: "#007185",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 27,
    marginTop: 4
  },
  sub: {
    color: "#5f6670",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 6
  },
  image: {
    width: 132
  }
});
