import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ProductCard from "./ProductCard";

export default function ProductShelf({
  horizontal,
  products,
  title,
  actionLabel,
  addToCart,
  getQuantity,
  removeFromCart,
  openProduct
}) {
  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <Text style={styles.title}>{title}</Text>
        {actionLabel ? <Text style={styles.action}>{actionLabel}</Text> : null}
      </View>
      {horizontal ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              compact
              product={product}
              recommended={index === 0}
              quantity={getQuantity(product.id)}
              onDecrement={() => removeFromCart(product)}
              onIncrement={() => addToCart(product)}
              onPress={() => openProduct(product)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.grid}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              recommended={index === 0}
              quantity={getQuantity(product.id)}
              onDecrement={() => removeFromCart(product)}
              onIncrement={() => addToCart(product)}
              onPress={() => openProduct(product)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 12
  },
  headingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  title: {
    color: "#242931",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.2
  },
  action: {
    color: "#007185",
    fontSize: 13,
    fontWeight: "700"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  horizontal: {
    gap: 12,
    paddingBottom: 10
  }
});
