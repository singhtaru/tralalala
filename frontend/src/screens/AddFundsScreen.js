import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function AddFundsScreen({ deficitAmount, onSelectGooglePay, goBack }) {
  const suggestAmounts = [deficitAmount > 0 ? deficitAmount : 500, 500, 1000, 2000];
  const [amount, setAmount] = useState(suggestAmounts[0]);

  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.navBar}>
        <Pressable onPress={goBack} style={styles.navBack}>
          <Ionicons name="chevron-back" size={24} color={colors.ink} />
        </Pressable>
        <Text style={styles.navTitle}>Add Funds</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Top up Amazon Wallet</Text>
        <Text style={styles.subText}>Funds will be instantly added to your standard shopping wallet.</Text>

        {/* Selected Amount display */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>ADD AMOUNT</Text>
          <Text style={styles.amountValue}>₹{amount}</Text>
        </View>

        {/* Suggest Tiers */}
        <View style={styles.tiersRow}>
          {suggestAmounts.map((val, idx) => (
            <Pressable
              key={`${val}-${idx}`}
              onPress={() => setAmount(val)}
              style={[
                styles.tierPill,
                amount === val && styles.tierPillActive
              ]}
            >
              <Text
                style={[
                  styles.tierText,
                  amount === val && styles.tierTextActive
                ]}
              >
                +₹{val}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionHeader}>PAYMENT METHOD</Text>

        {/* Option 1: GPay */}
        <Pressable onPress={() => onSelectGooglePay(amount)} style={styles.paymentOption}>
          <Ionicons name="logo-google" size={22} color="#1a73e8" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Google Pay</Text>
            <Text style={styles.optionSub}>Instant transfer via UPI</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>

        {/* Option 2: Credit Card (Coming Soon) */}
        <View style={[styles.paymentOption, styles.optionDisabled]}>
          <Ionicons name="card-outline" size={22} color="#9ca3af" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.optionDisabledTitle}>Credit Card</Text>
            <Text style={styles.optionSub}>Visa, Mastercard, RuPay</Text>
          </View>
          <Text style={styles.comingSoonBadge}>Coming Soon</Text>
        </View>

        {/* Option 3: Debit Card (Coming Soon) */}
        <View style={[styles.paymentOption, styles.optionDisabled, { borderBottomWidth: 0 }]}>
          <Ionicons name="wallet-outline" size={22} color="#9ca3af" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.optionDisabledTitle}>Debit Card</Text>
            <Text style={styles.optionSub}>Rupay, Maestro, Visa</Text>
          </View>
          <Text style={styles.comingSoonBadge}>Coming Soon</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f3f4f6",
    flex: 1
  },
  navBar: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  navBack: {
    padding: 4
  },
  navTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700"
  },
  content: {
    padding: 16
  },
  title: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8
  },
  subText: {
    color: "#4b5563",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20
  },
  amountCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  amountLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  },
  amountValue: {
    color: "#111827",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 4
  },
  tiersRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 14
  },
  tierPill: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 8
  },
  tierPillActive: {
    backgroundColor: "#fff7e6",
    borderColor: "#ff9900"
  },
  tierText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700"
  },
  tierTextActive: {
    color: "#ff9900"
  },
  sectionHeader: {
    color: "#4b5563",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 20,
    marginLeft: 6
  },
  paymentOption: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomColor: "#f3f4f6",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 56,
    paddingHorizontal: 14
  },
  optionTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700"
  },
  optionSub: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2
  },
  optionDisabled: {
    opacity: 0.6
  },
  optionDisabledTitle: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "700"
  },
  comingSoonBadge: {
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    color: "#6b7280",
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 3
  }
});
