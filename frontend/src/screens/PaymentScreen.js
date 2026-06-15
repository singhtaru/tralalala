import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { colors } from "../theme/colors";

const deliveryFee = 19;
const handlingFee = 6;
const discount = 25;

export default function PaymentScreen({
  cart,
  goBack,
  onPlaceOrder,
  paymentMethod,
  setPaymentMethod,
  total,
  walletBalance,
  emergencyDeposit,
  selectedAddress,
  onChangeAddress,
  onAddFunds
}) {
  const grandTotal = Math.max(0, total + deliveryFee + handlingFee - discount);
  const isInsufficient = walletBalance < grandTotal;

  // Detect if the cart contains any emergency items
  const isEmergencyCart = cart.some(item => item.id.startsWith("E"));
  
  // Decide if we can use the emergency deposit
  const canUseEmergencyDeposit = isEmergencyCart && (walletBalance + emergencyDeposit >= grandTotal);

  const paymentOptions = [
    {
      id: "Google Pay",
      subtitle: "UPI Direct payment",
      icon: "google",
      disabled: false
    },
    {
      id: "Amazon Wallet",
      subtitle: `Standard balance ₹${walletBalance}`,
      icon: "wallet-outline",
      disabled: false
    },
    {
      id: "Emergency Deposit",
      subtitle: `Locked reserve ₹${emergencyDeposit}`,
      icon: "shield-check",
      disabled: !isEmergencyCart // Only selectable/applicable during emergency checkouts
    },
    {
      id: "Credit Card",
      subtitle: "Coming Soon",
      icon: "credit-card-outline",
      disabled: true
    },
    {
      id: "Debit Card",
      subtitle: "Coming Soon",
      icon: "credit-card-outline",
      disabled: true
    }
  ];

  const handleCheckout = () => {
    if (paymentMethod === "Amazon Wallet" && isInsufficient) {
      if (canUseEmergencyDeposit) {
        // Automatically deduct from emergency deposit
        onPlaceOrder("Emergency Deposit");
      } else {
        // Must top up standard wallet
        if (onAddFunds) onAddFunds(grandTotal - walletBalance);
      }
      return;
    }
    onPlaceOrder(paymentMethod);
  };

  return (
    <View style={styles.screen}>
      <ScreenTopBar title="Review Bill" subtitle="Verify and place order" goBack={goBack} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Address Selection Section */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Ionicons name="location-outline" size={20} color={colors.amazonBlue} />
            <Text style={styles.addressTitle}>Delivery Address</Text>
            <Pressable onPress={onChangeAddress} style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
            </Pressable>
          </View>
          {selectedAddress ? (
            <View style={styles.addressDetails}>
              <Text style={styles.customerName}>{selectedAddress.name} ({selectedAddress.phone})</Text>
              <Text style={styles.addressText}>
                {selectedAddress.flat}, {selectedAddress.street}, {selectedAddress.area},{"\n"}
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pin}
              </Text>
            </View>
          ) : (
            <Text style={styles.noAddressText}>No address selected. Please add one.</Text>
          )}
        </View>

        {/* Bill Details */}
        <View style={styles.billCard}>
          <Text style={styles.cardTitle}>Bill details</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemDot} />
              <Text numberOfLines={1} style={styles.itemName}>{item.qty} x {item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
            </View>
          ))}
          <BillRow label="Item total" value={`₹${total}`} />
          <BillRow label="Delivery fee" value={`₹${deliveryFee}`} />
          <BillRow label="Handling fee" value={`₹${handlingFee}`} />
          <BillRow label="Amazon Now coupon" value={`- ₹${discount}`} green />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>To pay</Text>
            <Text style={styles.totalValue}>₹{grandTotal}</Text>
          </View>
        </View>

        {/* Wallet Balances Summary */}
        <View style={styles.walletBalances}>
          <View style={styles.walletCol}>
            <Text style={styles.walletLabel}>Amazon Wallet</Text>
            <Text style={styles.walletBalanceVal}>₹{walletBalance}</Text>
          </View>
          <View style={styles.walletDivider} />
          <View style={styles.walletCol}>
            <Text style={styles.walletLabel}>Emergency Reserve</Text>
            <Text style={[styles.walletBalanceVal, { color: colors.green }]}>₹{emergencyDeposit}</Text>
          </View>
        </View>

        {/* Insufficient Balance warning and action */}
        {paymentMethod === "Amazon Wallet" && isInsufficient && (
          canUseEmergencyDeposit ? (
            <View style={[styles.warningBox, styles.emergencyTappedBox]}>
              <Ionicons name="shield-checkmark" size={20} color="#16a34a" />
              <View style={styles.warningCopy}>
                <Text style={[styles.warningTitle, { color: "#16a34a" }]}>Emergency Deposit Covered</Text>
                <Text style={styles.warningText}>
                  Standard wallet is insufficient. Since this is an emergency checkout, the deficit of ₹{grandTotal - walletBalance} will be covered automatically by your Emergency Deposit.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={22} color="#dc2626" />
              <View style={styles.warningCopy}>
                <Text style={styles.warningTitle}>Insufficient Wallet Balance</Text>
                <Text style={styles.warningText}>
                  Your Amazon Wallet balance (₹{walletBalance}) is insufficient to cover the total ₹{grandTotal}.
                </Text>
                <Pressable onPress={() => onAddFunds(grandTotal - walletBalance)} style={styles.addFundsBtn}>
                  <Text style={styles.addFundsBtnText}>Add Funds</Text>
                </Pressable>
              </View>
            </View>
          )
        )}

        <Text style={styles.sectionTitle}>Payment methods</Text>
        {paymentOptions.map((option) => {
          const selected = paymentMethod === option.id;
          const isDisabled = option.disabled;
          return (
            <Pressable
              key={option.id}
              disabled={isDisabled}
              onPress={() => setPaymentMethod(option.id)}
              style={[
                styles.option,
                selected && styles.optionSelected,
                isDisabled && styles.optionDisabled
              ]}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={26}
                color={selected ? colors.amazonOrange : (isDisabled ? "#9ca3af" : colors.amazonBlue)}
              />
              <View style={styles.optionCopy}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={[styles.optionTitle, isDisabled && styles.disabledText]}>{option.id}</Text>
                  {option.id === "Emergency Deposit" && (
                    <Text style={styles.emergencyPill}>EMERGENCY MODE ONLY</Text>
                  )}
                </View>
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

      {/* Pay Bar */}
      <View style={styles.payBar}>
        <View>
          <Text style={styles.payLabel}>Place order for</Text>
          <Text style={styles.payTotal}>₹{grandTotal}</Text>
        </View>
        
        {paymentMethod === "Amazon Wallet" && isInsufficient && !canUseEmergencyDeposit ? (
          <Pressable onPress={() => onAddFunds(grandTotal - walletBalance)} style={[styles.payButton, { backgroundColor: colors.amazonOrange }]}>
            <Text style={styles.payButtonText}>Add Funds</Text>
          </Pressable>
        ) : (
          <Pressable onPress={handleCheckout} style={styles.payButton}>
            <Text style={styles.payButtonText}>Checkout</Text>
          </Pressable>
        )}
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
  addressCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d8eef5",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14
  },
  addressHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10
  },
  addressTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 6,
    flex: 1
  },
  changeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  changeBtnText: {
    color: "#007aff",
    fontSize: 13,
    fontWeight: "700"
  },
  customerName: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4
  },
  addressText: {
    color: "#4b5563",
    fontSize: 12,
    lineHeight: 16
  },
  noAddressText: {
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "600"
  },
  billCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d8eef5",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14
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
  walletBalances: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d8eef5",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    paddingVertical: 14,
    marginBottom: 14
  },
  walletCol: {
    alignItems: "center",
    flex: 1
  },
  walletDivider: {
    backgroundColor: "#e5e7eb",
    height: 32,
    width: 1
  },
  walletLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  },
  walletBalanceVal: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 4
  },
  warningBox: {
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    padding: 12,
    marginBottom: 14
  },
  emergencyTappedBox: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac"
  },
  warningCopy: {
    flex: 1,
    marginLeft: 8
  },
  warningTitle: {
    color: "#991b1b",
    fontSize: 14,
    fontWeight: "900"
  },
  warningText: {
    color: "#7f1d1d",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  addFundsBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderColor: "#dc2626",
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  addFundsBtnText: {
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "700"
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 10
  },
  option: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#f0f2f4",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
    padding: 14
  },
  optionSelected: {
    backgroundColor: "#fff9ef",
    borderColor: colors.amazonOrange
  },
  optionDisabled: {
    opacity: 0.85
  },
  disabledText: {
    color: "#6b7280"
  },
  emergencyPill: {
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
    borderWidth: 0.5,
    borderRadius: 4,
    color: "#dc2626",
    fontSize: 8,
    fontWeight: "800",
    marginLeft: 6,
    paddingHorizontal: 4,
    paddingVertical: 1
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
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 14
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900"
  }
});
