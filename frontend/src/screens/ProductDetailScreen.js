import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ProductCard from "../components/catalog/ProductCard";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { products } from "../data/products";
import { colors } from "../theme/colors";

export default function ProductDetailScreen({ addToCart, goBack, product, setSelectedProduct }) {
  const similar = products.filter((item) => item.id !== product.id).slice(0, 6);

  return (
    <View style={styles.screen}>
      <ScreenTopBar title="Product Details" goBack={goBack} rightLabel="share" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>
        <Text style={styles.quantity}>{product.quantity}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>{product.rating} star | {product.deliveryMins} mins | {product.unit}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>INR {product.price}</Text>
          {product.mrp ? <Text style={styles.mrp}>MRP INR {product.mrp}</Text> : null}
        </View>
        <View style={styles.reasonBox}>
          <Text style={styles.reasonTitle}>Why this is recommended</Text>
          <Text style={styles.reasonText}>{product.reason}</Text>
        </View>
        <Pressable onPress={() => addToCart(product)} style={styles.addButton}>
          <Text style={styles.addText}>Add to Cart</Text>
        </Pressable>
        <Text style={styles.sectionTitle}>Similar products</Text>
        <View style={styles.productGrid}>
          {similar.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAdd={() => addToCart(item)}
              onPress={() => setSelectedProduct(item)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  content: {
    paddingBottom: 106
  },
  imageWrap: {
    backgroundColor: colors.softMint,
    borderRadius: 8,
    height: 310,
    marginHorizontal: 18,
    marginTop: 16,
    overflow: "hidden"
  },
  image: {
    height: "100%",
    width: "100%"
  },
  quantity: {
    color: "#59616d",
    fontSize: 14,
    fontWeight: "900",
    marginHorizontal: 18,
    marginTop: 18
  },
  name: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 34,
    marginHorizontal: 18,
    marginTop: 5
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800",
    marginHorizontal: 18,
    marginTop: 8
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 18,
    marginTop: 12
  },
  price: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900"
  },
  mrp: {
    color: "#7b8490",
    fontSize: 13,
    fontWeight: "800",
    textDecorationLine: "line-through"
  },
  reasonBox: {
    backgroundColor: "#eef8ff",
    borderRadius: 8,
    margin: 18,
    padding: 14
  },
  reasonTitle: {
    color: "#075985",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5
  },
  reasonText: {
    color: "#315064",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  },
  addButton: {
    alignItems: "center",
    backgroundColor: colors.amazonOrange,
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 18,
    paddingVertical: 15
  },
  addText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900"
  },
  sectionTitle: {
    color: "#242931",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 12,
    marginHorizontal: 16
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16
  }
});
