import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { colors } from "../theme/colors";

const deliveryFee = 19;
const handlingFee = 6;
const discount = 25;

const paymentOptions = [
  {
    id: "Google Pay",
    subtitle: "Pay securely using UPI",
    icon: "google"
  },
  {
    id: "Amazon Wallet",
    subtitle: "Available balance INR 1,250",
    icon: "wallet-outline"
  },
  {
    id: "Credit or Debit Card",
    subtitle: "Visa, Mastercard and RuPay",
    icon: "credit-card-outline"
  },
  {
    id: "Cash on Delivery",
    subtitle: "Pay when your order arrives",
    icon: "cash"
  }
];

export default function PaymentScreen({
  cart,
  goBack,
  onPlaceOrder,
  paymentMethod,
  setPaymentMethod,
  total
}) {
  const grandTotal = Math.max(0, total + deliveryFee + handlingFee - discount);

  return (
    <View style={styles.screen}>
      <ScreenTopBar title="Review bill" subtitle="Order will be placed immediately" goBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.billCard}>
          <Text style={styles.cardTitle}>Bill details</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemDot} />
              <Text numberOfLines={1} style={styles.itemName}>{item.qty} x {item.name}</Text>
              <Text style={styles.itemPrice}>INR {item.price * item.qty}</Text>
            </View>
          ))}
          <BillRow label="Item total" value={`INR ${total}`} />
          <BillRow label="Delivery partner fee" value={`INR ${deliveryFee}`} />
          <BillRow label="Handling fee" value={`INR ${handlingFee}`} />
          <BillRow label="Amazon Now coupon" value={`- INR ${discount}`} green />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>To pay</Text>
            <Text style={styles.totalValue}>INR {grandTotal}</Text>
          </View>
        </View>

        <View style={styles.walletSummary}>
          <MaterialCommunityIcons name="wallet-outline" size={27} color={colors.amazonBlue} />
          <View style={styles.walletCopy}>
            <Text style={styles.walletTitle}>Amazon Wallet synced</Text>
            <Text style={styles.walletBalance}>Balance INR 1,250</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment methods</Text>
        {paymentOptions.map((option) => {
          const selected = paymentMethod === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setPaymentMethod(option.id)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={26}
                color={selected ? colors.amazonOrange : colors.amazonBlue}
              />
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>{option.id}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons
                name={selected ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={selected ? colors.amazonOrange : "#9ba3ad"}
              />
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.payBar}>
        <View>
          <Text style={styles.payLabel}>Place order for</Text>
          <Text style={styles.payTotal}>INR {grandTotal}</Text>
        </View>
        <Pressable onPress={onPlaceOrder} style={styles.payButton}>
          <Text style={styles.payButtonText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

function BillRow({ label, value, green }) {
  return (
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>{label}</Text>
      <Text style={[styles.billValue, green && styles.greenValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.skyLight,
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 176
  },
  billCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d8eef5",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10
  },
  itemRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 9
  },
  itemDot: {
    backgroundColor: colors.green,
    borderRadius: 3,
    height: 6,
    marginRight: 8,
    width: 6
  },
  itemName: {
    color: colors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: "800"
  },
  itemPrice: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  billRow: {
    alignItems: "center",
    borderTopColor: "#eef2f4",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9
  },
  billLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  billValue: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  greenValue: {
    color: colors.green
  },
  totalRow: {
    alignItems: "center",
    borderTopColor: colors.stroke,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12
  },
  totalLabel: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  totalValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900"
  },
  walletSummary: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d8eef5",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 14,
    padding: 14
  },
  walletCopy: {
    marginLeft: 12
  },
  walletTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  walletBalance: {
    color: "#007185",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 20
  },
  option: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors.stroke,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
    padding: 14
  },
  optionSelected: {
    backgroundColor: "#fff8eb",
    borderColor: colors.amazonOrange
  },
  optionCopy: {
    flex: 1,
    marginLeft: 12
  },
  optionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  optionSubtitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  payBar: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopColor: colors.stroke,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    padding: 16,
    position: "absolute",
    right: 0
  },
  payLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  payTotal: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "900"
  },
  payButton: {
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 14
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900"
  }
});
