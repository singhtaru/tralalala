import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ProductCard from "../components/catalog/ProductCard";
import { products } from "../data/products";
import { colors } from "../theme/colors";

const savedOrderIds = ["P030", "P071"];

export default function OrderAgainScreen({
  addToCart,
  getQuantity,
  openProduct,
  removeFromCart
}) {
  const savedProducts = savedOrderIds.map((id) => products.find((item) => item.id === id)).filter(Boolean);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Order again</Text>
        <Text style={styles.subtitle}>Two items from your previous quick order are ready.</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Last ordered</Text>
          <Text style={styles.summaryMeta}>Butter 500g and Coca Cola 1L</Text>
        </View>
        <View style={styles.productGrid}>
          {savedProducts.map((product, index) => (
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
      </ScrollView>
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
    paddingBottom: 108
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 12
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 6
  },
  summary: {
    backgroundColor: "#ffffff",
    borderColor: "#d8eef5",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 18,
    padding: 14
  },
  summaryTitle: {
    color: colors.amazonBlue,
    fontSize: 15,
    fontWeight: "900"
  },
  summaryMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 18
  }
});
