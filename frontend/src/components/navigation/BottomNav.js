import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";

const navItems = [
  { id: "home", label: "Home", icon: "home-outline", library: "ion" },
  { id: "reorder", label: "Order Again", icon: "history", library: "material" },
  { id: "category", label: "Categories", icon: "grid-outline", library: "ion" },
  { id: "cart", label: "Cart", icon: "cart-outline", library: "ion" }
];

export default function BottomNav({ active, cartCount, setScreen }) {
  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isCart = item.id === "cart";
        const label = isCart ? `${item.label} ${cartCount}` : item.label;
        const isActive = active === item.id;
        const iconColor = isActive ? colors.amazonOrange : colors.ink;

        return (
          <Pressable
            key={item.id}
            onPress={() => setScreen(item.id === "reorder" ? "home" : item.id)}
            style={styles.navItem}
          >
            {item.library === "material" ? (
              <MaterialCommunityIcons name={item.icon} size={23} color={iconColor} />
            ) : (
              <Ionicons name={item.icon} size={23} color={iconColor} />
            )}
            <Text style={[styles.navLabel, isActive && styles.navActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    ...shadows.floatingBar,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors.stroke,
    borderRadius: 28,
    borderWidth: 1,
    bottom: 14,
    flexDirection: "row",
    justifyContent: "space-around",
    left: 18,
    paddingVertical: 9,
    position: "absolute",
    right: 18
  },
  navItem: {
    alignItems: "center",
    minWidth: 64
  },
  navLabel: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2
  },
  navActive: {
    color: colors.amazonOrange
  }
});
