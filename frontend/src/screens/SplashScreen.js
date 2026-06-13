import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function SplashScreen() {
  return (
    <View style={styles.splash}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoAmazon}>amazon</Text>
        <Text style={styles.logoNow}>now</Text>
      </View>
      <Text style={styles.splashLine}>10 minute essentials</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    alignItems: "center",
    backgroundColor: "#131921",
    flex: 1,
    justifyContent: "center"
  },
  logoBadge: {
    alignItems: "center"
  },
  logoAmazon: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0
  },
  logoNow: {
    color: colors.amazonOrange,
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: -9
  },
  splashLine: {
    color: "#d6dde8",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 14
  }
});
