import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function ScreenTopBar({ title, subtitle, goBack, rightLabel }) {
  return (
    <View style={styles.topBar}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        {subtitle ? <Text numberOfLines={1} style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightLabel ? <Text style={styles.action}>{rightLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomColor: "#f0f2f4",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14
  },
  backButton: {
    alignItems: "center",
    height: 38,
    justifyContent: "center",
    width: 30
  },
  backText: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: "300",
    lineHeight: 38
  },
  copy: {
    flex: 1
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  subtitle: {
    color: "#007185",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2
  },
  action: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800"
  }
});
