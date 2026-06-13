import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { colors } from "../theme/colors";

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

export default function PaymentScreen({ goBack, paymentMethod, setPaymentMethod, total }) {
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <View style={styles.successScreen}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={40} color="#ffffff" />
        </View>
        <Text style={styles.successTitle}>Order placed</Text>
        <Text style={styles.successText}>
          Your order is confirmed and will arrive in 10-15 minutes.
        </Text>
        <Text style={styles.successMeta}>{paymentMethod} | INR {total}</Text>
        <Pressable onPress={goBack} style={styles.doneButton}>
          <Text style={styles.doneText}>View Cart</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenTopBar title="Choose payment" subtitle={`Pay INR ${total}`} goBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.walletSummary}>
          <MaterialCommunityIcons name="wallet-outline" size={27} color={colors.amazonBlue} />
          <View style={styles.walletCopy}>
            <Text style={styles.walletTitle}>Amazon Wallet</Text>
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
          <Text style={styles.payLabel}>Payable amount</Text>
          <Text style={styles.payTotal}>INR {total}</Text>
        </View>
        <Pressable onPress={() => setPlaced(true)} style={styles.payButton}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 176
  },
  walletSummary: {
    alignItems: "center",
    backgroundColor: "#eef8ff",
    borderRadius: 8,
    flexDirection: "row",
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
  },
  successScreen: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "center",
    padding: 28
  },
  successIcon: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 38,
    height: 76,
    justifyContent: "center",
    width: 76
  },
  successTitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 18
  },
  successText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center"
  },
  successMeta: {
    color: "#007185",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 16
  },
  doneButton: {
    backgroundColor: colors.amazonOrange,
    borderRadius: 8,
    marginTop: 24,
    paddingHorizontal: 30,
    paddingVertical: 14
  },
  doneText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  }
});
