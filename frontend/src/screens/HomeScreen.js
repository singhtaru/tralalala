import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import CategoryGrid from "../components/catalog/CategoryGrid";
import ProductShelf from "../components/catalog/ProductShelf";
import HomeHeader from "../components/home/HomeHeader";
import PromoBanner from "../components/home/PromoBanner";
import QuickActions from "../components/home/QuickActions";
import SearchHeader from "../components/home/SearchHeader";
import { categorySections, products, topTabs } from "../data/products";

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
  setScreen
}) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
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
        <QuickActions setScreen={setScreen} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  content: {
    paddingBottom: 108
  }
});
