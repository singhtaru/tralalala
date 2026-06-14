import React, { useEffect, useMemo, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import ProductCard from "../components/catalog/ProductCard";
import { products } from "../data/products";
import { colors } from "../theme/colors";

const trendingIds = ["P071", "P062", "P072", "P030", "P079", "P063"];
const wishlistIds = ["P041", "P082", "P069", "P083"];

export default function SearchScreen({
  addToCart,
  getQuantity,
  goBack,
  openProduct,
  query,
  recentSearches,
  removeFromCart,
  setQuery,
  setRecentSearches,
  focusInput,
  hideKeyboard
}) {
  const normalizedQuery = query.trim().toLowerCase();
  
  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }
    return products.filter((product) => {
      // Fix bug: use product.category instead of product.categoryName
      const haystack = `${product.name} ${product.category} ${product.tag || ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const trending = trendingIds.map((id) => products.find((item) => item.id === id)).filter(Boolean);
  const wishlist = wishlistIds.map((id) => products.find((item) => item.id === id)).filter(Boolean);

  const queryRef = useRef(query);
  queryRef.current = query;

  const triggerFocus = () => {
    focusInput({
      type: "text",
      value: queryRef.current,
      placeholder: "Search for atta, dal, coke and...",
      onChangeText: (text) => {
        setQuery(text);
        queryRef.current = text;
      },
      onSubmit: () => {
        const text = queryRef.current.trim();
        if (text) {
          setRecentSearches((items) => [text, ...items.filter((item) => item !== text)].slice(0, 6));
        }
        hideKeyboard();
      }
    });
  };

  useEffect(() => {
    triggerFocus();
    return () => hideKeyboard();
  }, [query]); // Re-register on changes to keep the submit closure value synced

  const chooseSearch = (text) => {
    setQuery(text);
    queryRef.current = text;
    setRecentSearches((items) => [text, ...items.filter((item) => item !== text)].slice(0, 6));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.searchTop}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.ink} />
        </Pressable>
        <TextInput
          autoFocus
          autoCorrect
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            queryRef.current = text;
          }}
          onFocus={triggerFocus}
          placeholder="Search for atta, dal, coke and..."
          returnKeyType="search"
          textContentType="none"
          showSoftInputOnFocus={false} // Prevents native soft keyboard
          style={styles.searchInput}
        />
        <Ionicons name="mic" size={23} color={colors.ink} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {!normalizedQuery ? (
          <>
            <View style={styles.headingRow}>
              <Text style={styles.title}>Recent searches</Text>
              <Pressable onPress={() => setRecentSearches([])}>
                <Text style={styles.clear}>clear</Text>
              </Pressable>
            </View>
            <View style={styles.chips}>
              {recentSearches.map((item) => (
                <Pressable key={item} onPress={() => chooseSearch(item)} style={styles.recentChip}>
                  <Ionicons name="time-outline" size={16} color={colors.amazonOrange} />
                  <Text style={styles.recentText}>{item}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.title}>Trending in your city</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
              {trending.map((item) => (
                <Pressable key={item.id} onPress={() => chooseSearch(item.name)} style={styles.trendingItem}>
                  <Image source={{ uri: item.image }} style={styles.trendingImage} />
                  <Text numberOfLines={2} style={styles.trendingText}>{item.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Text style={styles.title}>Your wishlist</Text>
            <View style={styles.productGrid}>
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={getQuantity(product.id)}
                  onDecrement={() => removeFromCart(product)}
                  onIncrement={() => addToCart(product)}
                  onPress={() => openProduct(product)}
                />
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>{results.length ? `Results for "${query}"` : "No products found"}</Text>
            <View style={styles.productGrid}>
              {results.map((product, index) => (
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
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#fffdf2",
    flex: 1
  },
  searchTop: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 28,
    flexDirection: "row",
    gap: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 18
  },
  backButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 28
  },
  searchInput: {
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: 6,
    outlineStyle: "none"
  },
  content: {
    paddingBottom: 40
  },
  headingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  title: {
    color: "#2b2f36",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
    marginTop: 18,
    paddingHorizontal: 16
  },
  clear: {
    color: colors.green,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 18
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16
  },
  recentChip: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors.stroke,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  recentText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800"
  },
  trendingRow: {
    gap: 14,
    paddingHorizontal: 16
  },
  trendingItem: {
    alignItems: "center",
    width: 96
  },
  trendingImage: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    height: 82,
    width: 82
  },
  trendingText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 8,
    textAlign: "center"
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16
  }
});
