import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

const quickCards = [
  { title: "Your\nOrders", icon: "bag-handle-outline" },
  { title: "Help &\nSupport", icon: "chatbubbles-outline" },
  { title: "Your\nWishlist", icon: "heart-outline" }
];

const infoRows = [
  { title: "Your Refunds", icon: "cash-outline" },
  { title: "Your Wishlist", icon: "heart-outline" },
  { title: "E-Gift Cards", icon: "card-outline" },
  { title: "Help & Support", icon: "chatbubbles-outline" },
  { title: "Saved Addresses", subtitle: "3 Addresses", icon: "location-outline" },
  { title: "Profile", icon: "person-circle-outline" },
  { title: "Rewards", icon: "gift-outline" },
  { title: "Payment Management", icon: "wallet-outline" }
];

const otherRows = [
  { title: "Change App Icon", icon: "alpha-z-box-outline", library: "material" },
  { title: "Suggest Products", icon: "sparkles-outline" },
  { title: "Notifications", icon: "notifications-outline" },
  { title: "General Info", icon: "information-circle-outline" }
];

export default function ProfileScreen({ customer, goBack, onSignOut }) {
  const name = customer?.name || "Shivi";
  const initial = name.trim()[0]?.toUpperCase() || "S";

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileHero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.phone}>62993 36649</Text>
          </View>
        </View>

        <View style={styles.quickRow}>
          {quickCards.map((card) => (
            <Pressable key={card.title} style={styles.quickCard}>
              <Ionicons name={card.icon} size={29} color="#111827" />
              <Text style={styles.quickText}>{card.title}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.cashCard}>
          <View style={styles.cashTop}>
            <MaterialCommunityIcons name="wallet-giftcard" size={26} color="#9c1ee8" />
            <Text style={styles.cashTitle}>Amazon Pay & Gift Card</Text>
            <Text style={styles.newBadge}>NEW</Text>
            <Ionicons name="chevron-forward" size={22} color={colors.muted} />
          </View>
          <View style={styles.cashBottom}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balance}>INR 0</Text>
            <Pressable style={styles.balanceButton}>
              <Text style={styles.balanceButtonText}>Add Balance</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.updateRow}>
          <Ionicons name="settings-outline" size={33} color="#111827" />
          <View style={styles.updateCopy}>
            <Text style={styles.updateTitle}>Update Available</Text>
            <Text style={styles.updateText}>Enjoy a more seamless shopping experience</Text>
          </View>
          <Text style={styles.newBadge}>New</Text>
          <Ionicons name="chevron-forward" size={20} color="#e75c95" />
        </View>

        <Text style={styles.sectionTitle}>Your Information</Text>
        <View style={styles.listCard}>
          {infoRows.map((row) => <ProfileRow key={row.title} row={row} />)}
        </View>

        <Text style={styles.sectionTitle}>Other Information</Text>
        <View style={styles.listCard}>
          {otherRows.map((row) => <ProfileRow key={row.title} row={row} />)}
        </View>

        <Pressable onPress={onSignOut} style={styles.logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
        <Text style={styles.version}>App version 26.5.5</Text>
        <Text style={styles.version}>v170-7</Text>
      </ScrollView>
    </View>
  );
}

function ProfileRow({ row }) {
  const Icon = row.library === "material" ? MaterialCommunityIcons : Ionicons;
  return (
    <Pressable style={styles.infoRow}>
      <Icon name={row.icon} size={27} color="#111827" />
      <View style={styles.infoCopy}>
        <Text style={styles.infoTitle}>{row.title}</Text>
        {row.subtitle ? <Text style={styles.infoSubtitle}>{row.subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={22} color="#59616d" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f3f5f7",
    flex: 1
  },
  header: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomColor: colors.stroke,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: 16
  },
  backButton: {
    alignItems: "center",
    borderColor: colors.stroke,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  content: {
    padding: 14,
    paddingBottom: 120
  },
  profileHero: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    paddingVertical: 16
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#e7cdf9",
    borderRadius: 36,
    height: 72,
    justifyContent: "center",
    width: 72
  },
  avatarText: {
    color: "#8b22d8",
    fontSize: 34,
    fontWeight: "900"
  },
  name: {
    color: "#111827",
    fontSize: 25,
    fontWeight: "900"
  },
  phone: {
    color: "#59616d",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3
  },
  quickRow: {
    flexDirection: "row",
    gap: 10
  },
  quickCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors.stroke,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 114,
    justifyContent: "center",
    padding: 10
  },
  quickText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
    marginTop: 9,
    textAlign: "center"
  },
  cashCard: {
    backgroundColor: "#f5e8ff",
    borderColor: "#e0c5f6",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 18,
    padding: 14
  },
  cashTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  cashTitle: {
    color: "#111827",
    flex: 1,
    fontSize: 15,
    fontWeight: "900"
  },
  newBadge: {
    backgroundColor: "#22b981",
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  cashBottom: {
    alignItems: "center",
    borderTopColor: "#e8d7f4",
    borderTopWidth: 1,
    flexDirection: "row",
    marginTop: 13,
    paddingTop: 13
  },
  balanceLabel: {
    color: "#8a8492",
    fontSize: 13,
    fontWeight: "700"
  },
  balance: {
    color: "#111827",
    flex: 1,
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 10
  },
  balanceButton: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  balanceButtonText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900"
  },
  updateRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 26
  },
  updateCopy: {
    flex: 1
  },
  updateTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900"
  },
  updateText: {
    color: "#59616d",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 14
  },
  listCard: {
    backgroundColor: "#ffffff",
    borderColor: colors.stroke,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden"
  },
  infoRow: {
    alignItems: "center",
    borderBottomColor: "#f0f1f3",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 14,
    minHeight: 62,
    paddingHorizontal: 16
  },
  infoCopy: {
    flex: 1
  },
  infoTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900"
  },
  infoSubtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2
  },
  logout: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors.stroke,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 22,
    paddingVertical: 16
  },
  logoutText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900"
  },
  version: {
    color: "#59616d",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center"
  }
});
