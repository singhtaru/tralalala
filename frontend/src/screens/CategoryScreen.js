import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ProductCard from "../components/catalog/ProductCard";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { categorySections, products } from "../data/products";
import { colors } from "../theme/colors";

export default function CategoryScreen({ addToCart, category, goBack, openProduct }) {
  const sideCategories = categorySections.flatMap((section) => section.tiles).slice(0, 9);
  const [activeCategory, setActiveCategory] = useState(category || sideCategories[0]);

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    }
  }, [category]);

  const shownProducts = useMemo(() => {
    const categoryProducts = products.filter((product) => product.category === activeCategory?.id);
    const recommendations = products.filter(
      (product) => product.category !== activeCategory?.id
    );
    return [...categoryProducts, ...recommendations].slice(0, 10);
  }, [activeCategory]);

  const title = activeCategory?.title || "Categories";

  return (
    <View style={styles.screen}>
      <ScreenTopBar title={title} subtitle="Delivering to Home" goBack={goBack} rightLabel="share" />
      <View style={styles.filterRow}>
        {["Filters", "Sort", "Type", "Price"].map((item) => (
          <Text key={item} style={styles.filterChip}>{item}</Text>
        ))}
      </View>
      <View style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.sideRail} contentContainerStyle={styles.sideRailContent}>
          {sideCategories.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setActiveCategory(item)}
              style={[styles.sideItem, item.id === activeCategory?.id && styles.sideItemActive]}
            >
              <Image source={{ uri: item.image }} style={styles.sideImage} />
              <Text numberOfLines={2} style={[styles.sideText, item.id === activeCategory?.id && styles.sideTextActive]}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productPane}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSub}>Freshness checked and delivered fast</Text>
          </View>
          <View style={styles.productGrid}>
            {shownProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                recommended={index === 0}
                onAdd={() => addToCart(product)}
                onPress={() => openProduct(product)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  filterRow: {
    backgroundColor: "#ffffff",
    borderBottomColor: colors.stroke,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 104,
    paddingVertical: 12
  },
  filterChip: {
    color: "#2b2f36",
    fontSize: 14,
    fontWeight: "900"
  },
  body: {
    flex: 1,
    flexDirection: "row"
  },
  sideRail: {
    backgroundColor: colors.rail,
    borderRightColor: colors.stroke,
    borderRightWidth: 1,
    width: 92
  },
  sideRailContent: {
    paddingBottom: 84,
    paddingTop: 10
  },
  sideItem: {
    alignItems: "center",
    borderLeftColor: "transparent",
    borderLeftWidth: 4,
    paddingBottom: 14,
    paddingHorizontal: 7
  },
  sideItemActive: {
    borderLeftColor: colors.green
  },
  sideImage: {
    borderRadius: 30,
    height: 58,
    width: 58
  },
  sideText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 15,
    marginTop: 7,
    textAlign: "center"
  },
  sideTextActive: {
    color: colors.ink
  },
  productPane: {
    backgroundColor: "#f4fde9",
    flex: 1
  },
  hero: {
    backgroundColor: "#f0fbdc",
    padding: 14
  },
  heroTitle: {
    color: "#090b0e",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 30
  },
  heroSub: {
    color: "#20242a",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 12
  }
});
