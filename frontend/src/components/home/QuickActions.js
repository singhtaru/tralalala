import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

const actions = [
  { id: "emergency", title: "Emergency", subtitle: "Instant care", icon: "flash-outline", color: "#fef2f2", iconColor: "#dc2626" },
  { id: "reorder", title: "Reorder", subtitle: "Quick restock", icon: "history", library: "material", color: "#fff7e5", iconColor: "#b45309" },
  { id: "baby", title: "Baby Care", subtitle: "Infant needs", icon: "baby-face-outline", library: "material", color: "#f0fdf4", iconColor: "#16a34a" },
  { id: "firstaid", title: "First Aid", subtitle: "Injury relief", icon: "bandage-outline", color: "#e0f2fe", iconColor: "#0284c7" },
  { id: "snacks", title: "Snacks", subtitle: "Munchies & drinks", icon: "pizza-outline", color: "#faf5ff", iconColor: "#7c3aed" },
  { id: "grocery", title: "Grocery", subtitle: "Kitchen staples", icon: "basket-outline", color: "#f5f5f4", iconColor: "#57534e" }
];

export default function QuickActions({ onAction }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Need it now?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {actions.map((action) => {
          const Icon = action.library === "material" ? MaterialCommunityIcons : Ionicons;
          return (
            <Pressable
              key={action.id}
              onPress={() => onAction(action.id)}
              style={[styles.action, { backgroundColor: action.color }]}
            >
              <Icon name={action.icon} size={24} color={action.iconColor} />
              <Text numberOfLines={1} style={styles.actionTitle}>{action.title}</Text>
              <Text numberOfLines={1} style={styles.actionSub}>{action.subtitle}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 4,
    marginTop: 10
  },
  title: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 10,
    marginHorizontal: 16
  },
  row: {
    gap: 9,
    paddingHorizontal: 16
  },
  action: {
    borderColor: colors.stroke,
    borderRadius: 8,
    borderWidth: 1,
    height: 112,
    padding: 12,
    width: 124
  },
  actionTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 9
  },
  actionSub: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3
  }
});
