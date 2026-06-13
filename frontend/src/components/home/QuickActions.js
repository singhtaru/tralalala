import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

const actions = [
  { id: "emergency", title: "Emergency", subtitle: "Instant care cart", icon: "medical-outline", color: "#fff0f0" },
  { id: "assistant", title: "Ask Amazon Now", subtitle: "Speak your need", icon: "sparkles-outline", color: "#e9f8fc" },
  { id: "reorder", title: "Reorder", subtitle: "Your essentials", icon: "history", library: "material", color: "#fff7e5" },
  { id: "wallet", title: "Emergency wallet", subtitle: "Deposit ready", icon: "wallet-outline", color: "#eef7ee" }
];

export default function QuickActions({ setScreen }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Need it now?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {actions.map((action) => {
          const Icon = action.library === "material" ? MaterialCommunityIcons : Ionicons;
          return (
            <Pressable key={action.id} onPress={() => setScreen(action.id)} style={[styles.action, { backgroundColor: action.color }]}>
              <Icon name={action.icon} size={24} color={action.id === "emergency" ? "#c62828" : colors.amazonBlue} />
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSub}>{action.subtitle}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 4 },
  title: { color: colors.ink, fontSize: 21, fontWeight: "900", marginBottom: 10, marginHorizontal: 16 },
  row: { gap: 9, paddingHorizontal: 16 },
  action: { borderColor: colors.stroke, borderRadius: 8, borderWidth: 1, height: 112, padding: 12, width: 138 },
  actionTitle: { color: colors.ink, fontSize: 14, fontWeight: "900", marginTop: 9 },
  actionSub: { color: colors.muted, fontSize: 11, fontWeight: "700", marginTop: 3 }
});
