import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function ProfileScreen({
  customer,
  addresses = [],
  orderHistory = [],
  walletBalance = 120,
  goBack,
  onSignOut,
  onManageAddresses,
  onManageWallet,
  onReorderPastItems
}) {
  const name = customer?.name || "Shivi";
  const phone = customer?.phone || "62993 36649";
  const initial = name.trim()[0]?.toUpperCase() || "S";

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Profile Hero card */}
        <View style={styles.profileHero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.phone}>{phone}</Text>
            <Text style={styles.email}>shivi@amazon.com</Text>
          </View>
        </View>

        {/* Amazon Pay Balance card */}
        <View style={styles.cashCard}>
          <View style={styles.cashTop}>
            <MaterialCommunityIcons name="wallet-giftcard" size={26} color="#9c1ee8" />
            <Text style={styles.cashTitle}>Amazon Pay & Gift Card</Text>
            <Pressable onPress={onManageWallet} style={styles.manageBtn}>
              <Text style={styles.manageBtnText}>Manage</Text>
            </Pressable>
          </View>
          <View style={styles.cashBottom}>
            <View>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balance}>₹{walletBalance}</Text>
            </View>
            <Pressable onPress={onManageWallet} style={styles.balanceButton}>
              <Text style={styles.balanceButtonText}>Recharge</Text>
            </Pressable>
          </View>
        </View>

        {/* Saved Addresses list links */}
        <Text style={styles.sectionTitle}>Your Information</Text>
        <View style={styles.listCard}>
          <Pressable onPress={onManageAddresses} style={styles.infoRow}>
            <Ionicons name="location-outline" size={25} color="#111827" />
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Saved Addresses</Text>
              <Text style={styles.infoSubtitle}>{addresses.length} address(es) saved</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#59616d" />
          </Pressable>
          
          <Pressable onPress={onManageWallet} style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="wallet-outline" size={25} color="#111827" />
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Payment Management</Text>
              <Text style={styles.infoSubtitle}>Wallet, Emergency Deposit</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#59616d" />
          </Pressable>
        </View>

        {/* Order History list */}
        <Text style={styles.sectionTitle}>Order History</Text>
        {orderHistory.length === 0 ? (
          <View style={styles.emptyOrdersCard}>
            <Text style={styles.emptyOrdersText}>No orders placed yet.</Text>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orderHistory.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderId}>Order ID: #{order.id.slice(-5)}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <Text style={styles.orderStatusBadge}>Delivered</Text>
                </View>
                
                <Text style={styles.orderItemsText}>{order.itemsText}</Text>
                
                <View style={styles.orderCardFooter}>
                  <Text style={styles.orderPrice}>Total: ₹{order.price}</Text>
                  <Pressable
                    onPress={() => onReorderPastItems && onReorderPastItems(order.items)}
                    style={styles.reorderBtn}
                  >
                    <Text style={styles.reorderBtnText}>Buy Again</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Sign Out */}
        <Pressable onPress={onSignOut} style={styles.logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
        <Text style={styles.version}>App version 26.5.5 (Amazon Now Prototype)</Text>
      </ScrollView>
    </View>
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
    paddingVertical: 12
  },
  backButton: {
    alignItems: "center",
    borderColor: colors.stroke,
    borderRadius: 22,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 20,
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
    fontSize: 22,
    fontWeight: "900"
  },
  phone: {
    color: "#59616d",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2
  },
  email: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  cashCard: {
    backgroundColor: "#f5e8ff",
    borderColor: "#e0c5f6",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
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
  manageBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  manageBtnText: {
    color: "#8b22d8",
    fontSize: 12,
    fontWeight: "800"
  },
  cashBottom: {
    alignItems: "center",
    borderTopColor: "#e8d7f4",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 13,
    paddingTop: 13
  },
  balanceLabel: {
    color: "#8a8492",
    fontSize: 12,
    fontWeight: "700"
  },
  balance: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 2
  },
  balanceButton: {
    backgroundColor: "#ffffff",
    borderColor: "#8b22d8",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  balanceButtonText: {
    color: "#8b22d8",
    fontSize: 13,
    fontWeight: "900"
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 20
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
    minHeight: 56,
    paddingHorizontal: 16
  },
  infoCopy: {
    flex: 1
  },
  infoTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900"
  },
  infoSubtitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2
  },
  emptyOrdersCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderColor: colors.stroke,
    borderWidth: 1,
    padding: 24,
    alignItems: "center"
  },
  emptyOrdersText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  ordersList: {
    gap: 12
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderColor: colors.stroke,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14
  },
  orderCardHeader: {
    alignItems: "center",
    borderBottomColor: "#f3f4f6",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8
  },
  orderId: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "800"
  },
  orderDate: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2
  },
  orderStatusBadge: {
    backgroundColor: "#e8f8ed",
    borderRadius: 4,
    color: colors.green,
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  orderItemsText: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 10
  },
  orderCardFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  orderPrice: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900"
  },
  reorderBtn: {
    backgroundColor: "#fff7e6",
    borderColor: "#ff9900",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  reorderBtnText: {
    color: "#ff9900",
    fontSize: 12,
    fontWeight: "800"
  },
  logout: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors.stroke,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 24,
    paddingVertical: 14
  },
  logoutText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "900"
  },
  version: {
    color: "#59616d",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 16,
    textAlign: "center"
  }
});
