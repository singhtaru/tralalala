import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ProductImage from "../components/catalog/ProductImage";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { colors } from "../theme/colors";

export default function CartScreen({ cart, changeQuantity, emergencyMode, goBack, onCheckout, total }) {
  const deliveryFee = 19;
  const handlingFee = 6;
  const discount = 25;
  const grandTotal = Math.max(0, total + deliveryFee + handlingFee - discount);

  return (
    <View style={styles.screen}>
      <ScreenTopBar title="My Cart" subtitle="Delivery in 10-15 mins" goBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {emergencyMode ? (
          <View style={styles.emergencyTag}>
            <Ionicons name="flash" size={16} color="#ffffff" />
            <Text style={styles.emergencyText}>Emergency order - deposit protection active</Text>
          </View>
        ) : null}
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyTitle}>Your basket is waiting</Text>
            <Text style={styles.emptyText}>Add groceries, snacks or fresh picks from the home page.</Text>
          </View>
        ) : null}
        {cart.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <ProductImage product={item} style={styles.cartImage} />
            <View style={styles.cartCopy}>
              <Text numberOfLines={2} style={styles.cartName}>{item.name}</Text>
              <Text style={styles.cartQty}>{item.quantity} | {item.deliveryMins} mins</Text>
              <View style={styles.cartStepper}>
                <Pressable onPress={() => changeQuantity(item, -1)} style={styles.cartStepButton}>
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </Pressable>
                <Text style={styles.cartStepCount}>{item.qty}</Text>
                <Pressable onPress={() => changeQuantity(item, 1)} style={styles.cartStepButton}>
                  <Ionicons name="add" size={16} color="#ffffff" />
                </Pressable>
              </View>
            </View>
            <Text style={styles.cartPrice}>₹{item.price * item.qty}</Text>
          </View>
        ))}
        {cart.length ? (
          <View style={styles.billCard}>
            <Text style={styles.billTitle}>Bill details</Text>
            <BillRow label="Item total" value={`₹${total}`} />
            <BillRow label="Delivery partner fee" value={`₹${deliveryFee}`} />
            <BillRow label="Handling fee" value={`₹${handlingFee}`} />
            <BillRow label="Amazon Now savings" value={`- ₹${discount}`} green />
            <View style={styles.billTotalRow}>
              <Text style={styles.billTotalLabel}>Grand total</Text>
              <Text style={styles.billTotalValue}>₹{grandTotal}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutLabel}>Total</Text>
          <Text style={styles.checkoutTotal}>₹{grandTotal}</Text>
        </View>
        <Pressable
          disabled={cart.length === 0}
          onPress={onCheckout}
          style={[styles.checkoutButton, cart.length === 0 && styles.checkoutDisabled]}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

function BillRow({ label, value, green }) {
  return (
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>{label}</Text>
      <Text style={[styles.billValue, green && styles.billGreen]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  content: {
    gap: 12,
    padding: 16,
    paddingBottom: 220
  },
  emergencyTag: { alignItems: "center", backgroundColor: "#b42318", borderRadius: 7, flexDirection: "row", gap: 7, padding: 10 },
  emergencyText: { color: "#ffffff", fontSize: 12, fontWeight: "900" },
  emptyCart: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderRadius: 8,
    padding: 24
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "center"
  },
  cartItem: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#f0f2f4",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4
  },
  cartImage: {
    borderRadius: 10,
    height: 66,
    width: 66
  },
  cartCopy: {
    flex: 1
  },
  cartName: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  cartQty: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5
  },
  cartStepper: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.green,
    borderRadius: 7,
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  cartStepButton: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24
  },
  cartStepCount: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    minWidth: 16,
    textAlign: "center"
  },
  cartPrice: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  billCard: {
    backgroundColor: colors.skyLight,
    borderColor: "#dbeef5",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 6,
    padding: 16
  },
  billTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8
  },
  billRow: {
    alignItems: "center",
    borderBottomColor: "#dfeef3",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8
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
  billGreen: {
    color: colors.green
  },
  billTotalRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12
  },
  billTotalLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  billTotalValue: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "900"
  },
  checkoutBar: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopColor: colors.stroke,
    borderTopWidth: 1,
    bottom: 84,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    padding: 14,
    position: "absolute",
    right: 0
  },
  checkoutLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  checkoutTotal: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900"
  },
  checkoutButton: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 14
  },
  checkoutDisabled: {
    opacity: 0.45
  },
  checkoutText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900"
  }
});
