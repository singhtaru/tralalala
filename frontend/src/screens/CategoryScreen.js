import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ProductCard from "../components/catalog/ProductCard";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { categorySections, products as localProducts } from "../data/products";
import { colors } from "../theme/colors";

export default function CategoryScreen({
  addToCart,
  category,
  getQuantity,
  goBack,
  openProduct,
  removeFromCart,
  products = localProducts
}) {
  const sideCategories = categorySections.flatMap((section) => section.tiles).slice(0, 9);
  const [activeCategory, setActiveCategory] = useState(category || sideCategories[0]);

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    }
  }, [category]);

  const shownProducts = useMemo(() => {
    return products.filter((product) => product.category === activeCategory?.id);
  }, [activeCategory]);

  const title = activeCategory?.title || "Categories";

  return (
    <View style={styles.screen}>
      <ScreenTopBar title={title} subtitle="Delivering to Home in 10-15 mins" goBack={goBack} />
      <View style={styles.body}>
        <View style={styles.sideRailFrame}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.sideRail}
            contentContainerStyle={styles.sideRailContent}
          >
            {sideCategories.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setActiveCategory(item)}
                style={[styles.sideItem, item.id === activeCategory?.id && styles.sideItemActive]}
              >
                <Image source={{ uri: item.image }} style={styles.sideImage} />
                <Text numberOfLines={3} style={[styles.sideText, item.id === activeCategory?.id && styles.sideTextActive]}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View style={styles.productColumn}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.productScroll}
            contentContainerStyle={styles.productPane}
          >
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
                  quantity={getQuantity(product.id)}
                  onDecrement={() => removeFromCart(product)}
                  onIncrement={() => addToCart(product)}
                  onPress={() => openProduct(product)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  body: {
    flex: 1,
    flexDirection: "row"
  },
  sideRailFrame: {
    backgroundColor: colors.rail,
    borderRightColor: colors.stroke,
    borderRightWidth: 1,
    flexGrow: 0,
    flexShrink: 0,
    width: 104
  },
  sideRail: {
    flex: 1,
    width: "100%"
  },
  sideRailContent: {
    paddingBottom: 84,
    paddingTop: 10
  },
  sideItem: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomColor: colors.stroke,
    borderBottomWidth: 1,
    borderLeftColor: "transparent",
    borderLeftWidth: 4,
    minHeight: 116,
    paddingHorizontal: 7,
    paddingVertical: 12
  },
  sideItemActive: {
    backgroundColor: "#eefbea",
    borderLeftColor: colors.green
  },
  sideImage: {
    borderRadius: 30,
    height: 62,
    width: 62
  },
  sideText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 14,
    marginTop: 7,
    textAlign: "center"
  },
  sideTextActive: {
    color: colors.ink
  },
  productColumn: {
    backgroundColor: "#f4fde9",
    flex: 1,
    minWidth: 0
  },
  productScroll: {
    flex: 1,
    width: "100%"
  },
  productPane: {
    flexGrow: 1,
    width: "100%"
  },
  hero: {
    backgroundColor: "#f0fbdc",
    padding: 14
  },
  heroTitle: {
    color: "#090b0e",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 26
  },
  heroSub: {
    color: "#20242a",
    fontSize: 13,
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
