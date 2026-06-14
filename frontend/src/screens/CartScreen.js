import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { colors } from "../theme/colors";

export default function CartScreen({ cart, goBack, onCheckout, total }) {
  return (
    <View style={styles.screen}>
      <ScreenTopBar title="My Cart" subtitle="Delivery in 10-15 mins" goBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyTitle}>Your basket is waiting</Text>
            <Text style={styles.emptyText}>Add groceries, snacks or fresh picks from the home page.</Text>
          </View>
        ) : null}
        {cart.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />
            <View style={styles.cartCopy}>
              <Text numberOfLines={2} style={styles.cartName}>{item.name}</Text>
              <Text style={styles.cartQty}>{item.quantity} | Qty {item.qty}</Text>
            </View>
            <Text style={styles.cartPrice}>INR {item.price * item.qty}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutLabel}>Total</Text>
          <Text style={styles.checkoutTotal}>INR {total}</Text>
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

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  content: {
    gap: 12,
    padding: 16,
    paddingBottom: 190
  },
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
    borderColor: colors.stroke,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 10
  },
  cartImage: {
    borderRadius: 7,
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
  cartPrice: {
    color: colors.ink,
    fontSize: 15,
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
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 13
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
