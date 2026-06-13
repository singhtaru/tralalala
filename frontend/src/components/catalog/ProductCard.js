import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ProductImage from "./ProductImage";

export default function ProductCard({
  product,
  compact,
  recommended,
  quantity = 0,
  onDecrement,
  onIncrement,
  onPress
}) {
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compact,
        pressed && styles.pressed
      ]}
    >
      <View style={styles.imageWrap}>
        {product.tag ? <Text style={styles.ribbon}>{product.tag}</Text> : null}
        <ProductImage product={product} style={styles.image} />
      </View>
      <View style={styles.body}>
        <Text style={styles.quantity}>{product.quantity}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>INR {product.price}</Text>
          {product.mrp > product.price ? <Text style={styles.mrp}>INR {product.mrp}</Text> : null}
        </View>
        {discount ? <Text style={styles.discount}>{discount}% off</Text> : null}
        <Text numberOfLines={2} style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>{product.deliveryMins} mins  |  {product.rating} star</Text>
        {recommended ? <Text style={styles.ai}>AI recommended</Text> : null}
        {onIncrement ? (
          quantity > 0 ? (
            <View style={styles.stepper}>
              <Pressable onPress={onDecrement} style={styles.stepButton}>
                <Ionicons name="remove" size={18} color="#ffffff" />
              </Pressable>
              <Text style={styles.stepCount}>{quantity}</Text>
              <Pressable onPress={onIncrement} style={styles.stepButton}>
                <Ionicons name="add" size={18} color="#ffffff" />
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={onIncrement} style={styles.addButton}>
              <Text style={styles.addText}>ADD</Text>
            </Pressable>
          )
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#edf0f2",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    overflow: "hidden",
    width: "48%"
  },
  compact: {
    width: 158
  },
  pressed: {
    opacity: 0.86
  },
  imageWrap: {
    backgroundColor: "#eaf7f4",
    height: 138,
    justifyContent: "center",
    overflow: "hidden"
  },
  image: {
    height: "100%",
    width: "100%"
  },
  ribbon: {
    backgroundColor: "#fff2c7",
    borderBottomRightRadius: 7,
    color: "#6b4b00",
    fontSize: 11,
    fontWeight: "900",
    left: 0,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: "absolute",
    top: 0,
    zIndex: 2
  },
  body: {
    padding: 10,
    paddingBottom: 12
  },
  quantity: {
    color: "#2b2f36",
    fontSize: 18,
    fontWeight: "900"
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginTop: 4
  },
  price: {
    color: "#1f2937",
    fontSize: 17,
    fontWeight: "900"
  },
  mrp: {
    color: "#8a9099",
    fontSize: 12,
    textDecorationLine: "line-through"
  },
  discount: {
    color: "#0b8b3e",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2
  },
  name: {
    color: "#282d35",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 19,
    marginTop: 5
  },
  meta: {
    color: "#67707c",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6
  },
  ai: {
    alignSelf: "flex-start",
    backgroundColor: "#e7f4ff",
    borderRadius: 5,
    color: "#0073bb",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 6,
    overflow: "hidden",
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  addButton: {
    alignItems: "center",
    borderColor: "#1f9c39",
    borderRadius: 7,
    borderWidth: 1.5,
    marginTop: 10,
    paddingVertical: 8
  },
  addText: {
    color: "#148028",
    fontSize: 13,
    fontWeight: "900"
  },
  stepper: {
    alignItems: "center",
    backgroundColor: "#16852e",
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    minHeight: 36,
    paddingHorizontal: 5
  },
  stepButton: {
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    width: 30
  },
  stepCount: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900"
  }
});
