import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ProductImage from "../components/catalog/ProductImage";
import ProductCard from "../components/catalog/ProductCard";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { products } from "../data/products";
import { colors } from "../theme/colors";

export default function ProductDetailScreen({
  addToCart,
  getQuantity,
  goBack,
  product,
  removeFromCart,
  setSelectedProduct
}) {
  const [alternative, setAlternative] = useState("Best Seller");
  const similar = useMemo(() => {
    const candidates = products.filter((item) => item.id !== product.id && item.category === product.category);
    const sorted = [...candidates].sort((a, b) => {
      if (alternative === "Lower Cost") return a.price - b.price;
      if (alternative === "Faster Delivery") return a.deliveryMins - b.deliveryMins;
      if (alternative === "Premium Quality") return b.price - a.price;
      if (alternative === "Higher Protein") {
        const isProteinRich = (x) => ["dairy", "meat", "health"].includes(x.category);
        if (isProteinRich(a) && !isProteinRich(b)) return -1;
        if (!isProteinRich(a) && isProteinRich(b)) return 1;
      }
      return b.rating - a.rating;
    });
    return sorted.slice(0, 6);
  }, [alternative, product]);

  return (
    <View style={styles.screen}>
      <ScreenTopBar title="Product Details" goBack={goBack} rightLabel="share" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <ProductImage product={product} style={styles.image} />
        </View>
        <Text style={styles.quantity}>{product.quantity}</Text>
        <Text style={styles.name}>{product.name}</Text>
        {product.brand ? (
          <Text style={styles.brandText}>Brand: {product.brand}</Text>
        ) : null}
        <Text style={styles.meta}>⭐ {product.rating}  |  {product.deliveryMins} mins</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.mrp ? <Text style={styles.mrp}>MRP ₹{product.mrp}</Text> : null}
        </View>
        <View style={styles.reasonBox}>
          <Text style={styles.reasonTitle}>Why this is recommended</Text>
          <Text style={styles.reasonText}>{product.reason}</Text>
        </View>
        {getQuantity(product.id) > 0 ? (
          <View style={styles.detailStepper}>
            <Pressable onPress={() => removeFromCart(product)} style={styles.stepButton}>
              <Text style={styles.stepText}>-</Text>
            </Pressable>
            <Text style={styles.stepCount}>{getQuantity(product.id)}</Text>
            <Pressable onPress={() => addToCart(product)} style={styles.stepButton}>
              <Text style={styles.stepText}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => addToCart(product)} style={styles.addButton}>
            <Text style={styles.addText}>Add to Cart</Text>
          </Pressable>
        )}
        <Text style={styles.sectionTitle}>Smart alternatives</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {["Lower Cost", "Higher Protein", "Faster Delivery", "Premium Quality", "Best Seller"].map((filter) => (
            <Pressable key={filter} onPress={() => setAlternative(filter)} style={[styles.filter, alternative === filter && styles.filterActive]}>
              <Text style={[styles.filterText, alternative === filter && styles.filterTextActive]}>{filter}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.alternativeReason}>Showing {alternative.toLowerCase()} alternatives selected by Amazon Now AI.</Text>
        <View style={styles.productGrid}>
          {similar.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              quantity={getQuantity(item.id)}
              onDecrement={() => removeFromCart(item)}
              onIncrement={() => addToCart(item)}
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
  brandText: {
    color: "#67707c",
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 18,
    marginTop: 4
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
  detailStepper: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.green,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 18,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  stepButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 44
  },
  stepText: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900"
  },
  stepCount: {
    color: "#ffffff",
    fontSize: 18,
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
  filters: { gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  filter: { borderColor: colors.stroke, borderRadius: 18, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  filterActive: { backgroundColor: colors.amazonBlue, borderColor: colors.amazonBlue },
  filterText: { color: colors.muted, fontSize: 11, fontWeight: "900" },
  filterTextActive: { color: "#ffffff" },
  alternativeReason: { color: "#007185", fontSize: 11, fontWeight: "800", marginBottom: 12, marginHorizontal: 16 },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16
  }
});
