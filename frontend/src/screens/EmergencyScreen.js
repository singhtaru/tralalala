import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ProductCard from "../components/catalog/ProductCard";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { emergencyCategories } from "../data/intentEngine";
import { products as localProducts } from "../data/products";
import { colors } from "../theme/colors";

export default function EmergencyScreen({
  addGeneratedCart,
  getQuantity,
  goBack,
  openProduct,
  removeFromCart,
  addToCart,
  products = localProducts
}) {
  const [selected, setSelected] = useState(emergencyCategories[0]);
  const resolvedProducts = selected.products.map(item => products.find(p => p.id === item.id) || item);
  return (
    <View style={styles.screen}>
      <ScreenTopBar title="Emergency Mode" subtitle="Recommended delivery in 10-15 mins" goBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.alert}>
          <Ionicons name="flash" size={25} color="#ffffff" />
          <View style={styles.alertCopy}>
            <Text style={styles.alertTitle}>One tap creates your emergency cart</Text>
            <Text style={styles.alertText}>Your emergency deposit can cover a low wallet balance.</Text>
          </View>
        </View>
        <View style={styles.categories}>
          {emergencyCategories.map((category) => {
            const Icon = category.library === "material" ? MaterialCommunityIcons : Ionicons;
            return (
              <Pressable key={category.id} onPress={() => setSelected(category)} style={[styles.category, selected.id === category.id && styles.categorySelected]}>
                <Icon name={category.icon} size={24} color={selected.id === category.id ? "#ffffff" : "#b42318"} />
                <Text style={[styles.categoryText, selected.id === category.id && styles.categoryTextSelected]}>{category.title}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.detected}>
          <Text style={styles.detectedBadge}>EMERGENCY CART</Text>
          <Text style={styles.detectedTitle}>{selected.message}</Text>
          <Text style={styles.detectedSub}>{resolvedProducts.length} essentials selected by Amazon Now AI</Text>
        </View>
        <View style={styles.grid}>
          {resolvedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} recommended={index === 0} quantity={getQuantity(product.id)} onDecrement={() => removeFromCart(product)} onIncrement={() => addToCart(product)} onPress={() => openProduct(product)} />
          ))}
        </View>
        <Pressable onPress={() => addGeneratedCart(resolvedProducts, true)} style={styles.addCart}>
          <Text style={styles.addCartText}>Add emergency cart</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#fffafa", flex: 1 },
  content: { padding: 16, paddingBottom: 120 },
  alert: { alignItems: "center", backgroundColor: "#b42318", borderRadius: 8, flexDirection: "row", gap: 12, padding: 15 },
  alertCopy: { flex: 1 },
  alertTitle: { color: "#ffffff", fontSize: 16, fontWeight: "900" },
  alertText: { color: "#ffe4e1", fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 3 },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  category: { alignItems: "center", backgroundColor: "#ffffff", borderColor: "#f2c4c0", borderRadius: 8, borderWidth: 1, flexDirection: "row", gap: 7, paddingHorizontal: 10, paddingVertical: 10 },
  categorySelected: { backgroundColor: "#b42318" },
  categoryText: { color: "#7a271a", fontSize: 12, fontWeight: "900" },
  categoryTextSelected: { color: "#ffffff" },
  detected: { backgroundColor: "#ffffff", borderColor: "#f2d1ce", borderRadius: 8, borderWidth: 1, marginVertical: 16, padding: 14 },
  detectedBadge: { color: "#b42318", fontSize: 10, fontWeight: "900" },
  detectedTitle: { color: colors.ink, fontSize: 20, fontWeight: "900", marginTop: 5 },
  detectedSub: { color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  addCart: { alignItems: "center", backgroundColor: "#b42318", borderRadius: 8, flexDirection: "row", justifyContent: "center", gap: 8, padding: 15 },
  addCartText: { color: "#ffffff", fontSize: 15, fontWeight: "900" }
});
