import React, { useMemo, useState, useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CategoryGrid from "../components/catalog/CategoryGrid";
import ProductShelf from "../components/catalog/ProductShelf";
import HomeHeader from "../components/home/HomeHeader";
import PromoBanner from "../components/home/PromoBanner";
import QuickActions from "../components/home/QuickActions";
import SearchHeader from "../components/home/SearchHeader";
import { categorySections, products, topTabs } from "../data/products";
import { colors } from "../theme/colors";

const pastOrdersMock = [
  {
    id: "ord_1",
    date: "Delivered yesterday",
    price: 340,
    itemsText: "Butter 500g, Pepsi 1L",
    itemIds: ["P030", "P072"]
  },
  {
    id: "ord_2",
    date: "Delivered 3 days ago",
    price: 158,
    itemsText: "Brown Bread, Amul Milk 1L, Kurkure",
    itemIds: ["P026", "P025", "P064"]
  }
];

const voiceExamples = [
  "I cut my finger",
  "Order butter",
  "Unexpected guests arrived",
  "I need a quick breakfast"
];

export default function HomeScreen({
  activeTab,
  addToCart,
  cartCount,
  customer,
  getQuantity,
  openCategory,
  openProduct,
  removeFromCart,
  searchQuery,
  setActiveTab,
  setSearchQuery,
  setScreen,
  onReorderPastItems
}) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  
  // Active voice suggestion index rotater
  const [voiceExampleIndex, setVoiceExampleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVoiceExampleIndex((prev) => (prev + 1) % voiceExamples.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const visibleProducts = useMemo(() => {
    const activeTabConfig = topTabs.find((tab) => tab.id === activeTab);
    const tabFiltered = activeTab === "all"
      ? products
      : products.filter((product) => activeTabConfig?.categories.includes(product.category));

    if (!normalizedQuery) {
      return tabFiltered;
    }

    return products.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.tag}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeTab, normalizedQuery]);

  const featured = useMemo(() => visibleProducts.slice(0, 8), [visibleProducts]);
  const dealProducts = useMemo(() => visibleProducts.slice(8, 14), [visibleProducts]);
  const fullCatalog = useMemo(() => visibleProducts.slice(0, 84), [visibleProducts]);
  const showCategories = activeTab === "all" && !normalizedQuery;
  const shelfTitle = normalizedQuery
    ? `Search results for "${searchQuery}"`
    : activeTab === "all"
      ? "Fresh seasonal fruits"
      : `${activeTab[0].toUpperCase()}${activeTab.slice(1)} picks`;

  const handleQuickAction = (id) => {
    if (id === "snacks") {
      setActiveTab("snacks");
    } else if (id === "grocery") {
      setActiveTab("grocery");
    } else if (id === "baby" || id === "firstaid") {
      setScreen("emergency");
    } else {
      setScreen(id);
    }
  };

  const handleReorder = (itemIds) => {
    const itemsToOrder = itemIds.map(id => products.find(p => p.id === id)).filter(Boolean);
    if (onReorderPastItems) {
      onReorderPastItems(itemsToOrder);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader cartCount={cartCount} customer={customer} setScreen={setScreen} />
        <SearchHeader
          activeTab={activeTab}
          query={searchQuery}
          setActiveTab={setActiveTab}
          setQuery={setSearchQuery}
          setScreen={setScreen}
        />
        <PromoBanner onPress={() => openCategory(categorySections[0].tiles[0])} />
        
        {/* Quick Actions Component */}
        <QuickActions onAction={handleQuickAction} />

        {/* Previous Orders Shelf */}
        <View style={styles.pastSection}>
          <Text style={styles.sectionTitle}>Buy It Again</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pastRow}>
            {pastOrdersMock.map((order) => (
              <View key={order.id} style={styles.pastCard}>
                <View style={styles.pastCardHeader}>
                  <Ionicons name="time-outline" size={14} color={colors.muted} />
                  <Text style={styles.pastDate}>{order.date}</Text>
                </View>
                <Text numberOfLines={2} style={styles.pastItems}>{order.itemsText}</Text>
                <View style={styles.pastFooter}>
                  <Text style={styles.pastPrice}>₹{order.price}</Text>
                  <Pressable onPress={() => handleReorder(order.itemIds)} style={styles.reorderBtn}>
                    <Text style={styles.reorderText}>Reorder</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {showCategories ? <CategoryGrid sections={categorySections} openCategory={openCategory} /> : null}
        
        <ProductShelf
          title={shelfTitle}
          actionLabel="See all"
          products={featured}
          addToCart={addToCart}
          getQuantity={getQuantity}
          openProduct={openProduct}
          removeFromCart={removeFromCart}
        />
        {dealProducts.length ? (
          <ProductShelf
            horizontal
            title="Popular in minutes"
            actionLabel="Deals"
            products={dealProducts}
            addToCart={addToCart}
            getQuantity={getQuantity}
            openProduct={openProduct}
            removeFromCart={removeFromCart}
          />
        ) : null}
        <ProductShelf
          horizontal
          title="Full Amazon Now catalog"
          actionLabel={`${fullCatalog.length} items`}
          products={fullCatalog}
          addToCart={addToCart}
          getQuantity={getQuantity}
          openProduct={openProduct}
          removeFromCart={removeFromCart}
        />
      </ScrollView>

      {/* Floating Alexa-style Voice Button Container */}
      <View style={styles.alexaContainer}>
        {/* Voice Prompt Tooltip */}
        <View style={styles.alexaTooltip}>
          <View style={styles.alexaTooltipPointer} />
          <Text style={styles.alexaTooltipLabel}>Try speaking</Text>
          <Text style={styles.alexaTooltipText}>"{voiceExamples[voiceExampleIndex]}"</Text>
        </View>

        {/* Floating Alexa Ring Button */}
        <Pressable onPress={() => setScreen("assistant")} style={styles.alexaFloat}>
          <View style={styles.alexaRingOuter}>
            <View style={styles.alexaRingInner}>
              <Ionicons name="mic" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1,
    position: "relative"
  },
  content: {
    paddingBottom: 128
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 10,
    marginHorizontal: 16
  },
  pastSection: {
    marginTop: 18,
    marginBottom: 6
  },
  pastRow: {
    gap: 12,
    paddingHorizontal: 16
  },
  pastCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    width: 200
  },
  pastCardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginBottom: 6
  },
  pastDate: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  },
  pastItems: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800",
    height: 36,
    lineHeight: 18
  },
  pastFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8
  },
  pastPrice: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900"
  },
  reorderBtn: {
    borderColor: "#ff9900",
    borderRadius: 4,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  reorderText: {
    color: "#ff9900",
    fontSize: 12,
    fontWeight: "900"
  },
  alexaContainer: {
    alignItems: "center",
    bottom: 90,
    position: "absolute",
    right: 20,
    zIndex: 100
  },
  alexaTooltip: {
    backgroundColor: "rgba(19, 25, 33, 0.95)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "absolute",
    bottom: 74,
    right: 0,
    width: 170,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6
  },
  alexaTooltipPointer: {
    backgroundColor: "rgba(19, 25, 33, 0.95)",
    height: 10,
    width: 10,
    position: "absolute",
    bottom: -5,
    right: 24,
    transform: [{ rotate: "45deg" }]
  },
  alexaTooltipLabel: {
    color: "#00a8e1",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  alexaTooltipText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2
  },
  alexaFloat: {
    shadowColor: "#00a8e1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10
  },
  alexaRingOuter: {
    alignItems: "center",
    backgroundColor: "#00a8e1",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60
  },
  alexaRingInner: {
    alignItems: "center",
    backgroundColor: "#131921",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    width: 52
  }
});
