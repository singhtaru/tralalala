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
  const handleNestedPress = (event, callback) => {
    event?.stopPropagation?.();
    callback?.();
  };

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
        <Text numberOfLines={2} style={styles.name}>{product.name}</Text>
        {product.brand ? (
          <Text style={styles.brand}>Brand: {product.brand}</Text>
        ) : null}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.mrp > product.price ? <Text style={styles.mrp}>₹{product.mrp}</Text> : null}
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>⭐ {product.rating}</Text>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.deliveryText}>{product.deliveryMins} mins</Text>
        </View>
        {discount ? <Text style={styles.discount}>{discount}% off</Text> : null}
        {recommended ? <Text style={styles.ai}>AI recommended</Text> : null}
        {onIncrement ? (
          quantity > 0 ? (
            <View style={styles.stepper}>
              <Pressable onPress={(event) => handleNestedPress(event, onDecrement)} style={styles.stepButton}>
                <Ionicons name="remove" size={18} color="#ffffff" />
              </Pressable>
              <Text style={styles.stepCount}>{quantity}</Text>
              <Pressable onPress={(event) => handleNestedPress(event, onIncrement)} style={styles.stepButton}>
                <Ionicons name="add" size={18} color="#ffffff" />
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={(event) => handleNestedPress(event, onIncrement)} style={styles.addButton}>
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
    borderColor: "#f0f2f4",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    overflow: "hidden",
    width: "48%",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  compact: {
    width: 158
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }]
  },
  imageWrap: {
    backgroundColor: "#f5faf8",
    height: 138,
    justifyContent: "center",
    overflow: "hidden"
  },
  image: {
    height: "100%",
    width: "100%"
  },
  ribbon: {
    backgroundColor: "#fff8e1",
    borderBottomRightRadius: 8,
    color: "#6b4b00",
    fontSize: 10,
    fontWeight: "800",
    left: 0,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    top: 0,
    zIndex: 2
  },
  body: {
    padding: 11,
    paddingBottom: 13
  },
  brand: {
    color: "#8b929a",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 6
  },
  price: {
    color: "#1f2937",
    fontSize: 17,
    fontWeight: "900"
  },
  mrp: {
    color: "#a1a7b0",
    fontSize: 12,
    textDecorationLine: "line-through"
  },
  discount: {
    color: "#0b8b3e",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 3
  },
  name: {
    color: "#282d35",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 2
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginTop: 5
  },
  ratingText: {
    color: "#3d4450",
    fontSize: 11,
    fontWeight: "700"
  },
  bullet: {
    color: "#c5cad1",
    fontSize: 10
  },
  deliveryText: {
    color: "#67707c",
    fontSize: 11,
    fontWeight: "600"
  },
  ai: {
    alignSelf: "flex-start",
    backgroundColor: "#eef6ff",
    borderRadius: 6,
    color: "#0073bb",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 6,
    overflow: "hidden",
    paddingHorizontal: 7,
    paddingVertical: 3
  },
  addButton: {
    alignItems: "center",
    borderColor: "#1f9c39",
    borderRadius: 8,
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
    borderRadius: 8,
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
