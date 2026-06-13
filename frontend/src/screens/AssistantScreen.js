import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import ProductCard from "../components/catalog/ProductCard";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { products } from "../data/products";
import { detectIntent } from "../data/intentEngine";
import { colors } from "../theme/colors";

const suggestions = [
  "I have a party tonight",
  "I need a quick breakfast",
  "Show me snacks and drinks"
];

export default function AssistantScreen({
  addToCart,
  addGeneratedCart,
  getQuantity,
  goBack,
  openProduct,
  query,
  removeFromCart,
  setQuery
}) {
  const [submittedQuery, setSubmittedQuery] = useState(query);
  const intent = useMemo(() => detectIntent(submittedQuery), [submittedQuery]);

  const results = useMemo(() => {
    if (intent) return intent.products;
    const text = submittedQuery.toLowerCase();

    if (text.includes("party") || text.includes("guest")) {
      return products.filter((item) =>
        ["chips", "chocolate", "drinks", "icecream"].includes(item.category)
      );
    }

    if (text.includes("breakfast")) {
      return products.filter((item) =>
        ["dairy", "bakery", "cereal", "spreads", "fruits"].includes(item.category)
      );
    }

    if (!text.trim()) {
      return [];
    }

    return products.filter((item) =>
      `${item.name} ${item.category} ${item.tag}`.toLowerCase().includes(text)
    );
  }, [intent, submittedQuery]);

  const submit = (text = query) => {
    setQuery(text);
    setSubmittedQuery(text);
  };

  return (
    <View style={styles.screen}>
      <ScreenTopBar title="Amazon Now Assistant" subtitle="Tell us what you need" goBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.assistantHero}>
          <View style={styles.starCircle}>
            <Ionicons name="sparkles" size={30} color={colors.amazonOrange} />
          </View>
          <Text style={styles.heroTitle}>How can I help?</Text>
          <Text style={styles.heroText}>
            Type a situation and the assistant will show matching products.
          </Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            autoCorrect
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => submit()}
            placeholder="Example: I have a party"
            returnKeyType="search"
            textContentType="none"
            style={styles.input}
          />
          <Pressable onPress={() => submit()} style={styles.sendButton}>
            <Ionicons name="arrow-forward" size={22} color="#ffffff" />
          </Pressable>
        </View>

        <View style={styles.suggestionList}>
          {suggestions.map((suggestion) => (
            <Pressable key={suggestion} onPress={() => submit(suggestion)} style={styles.suggestion}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </Pressable>
          ))}
        </View>

        {submittedQuery ? (
          intent ? (
            <View style={styles.intentCard}>
              <Text style={styles.intentBadge}>
                {["injury", "fever", "baby", "power"].includes(intent.id) ? "EMERGENCY DETECTED" : "INTENT DETECTED"}
              </Text>
              <Text style={styles.intentTitle}>{intent.message}</Text>
              <Text style={styles.intentText}>I generated a {results.length}-item cart. Accept it or modify the items below.</Text>
              <Pressable
                onPress={() => addGeneratedCart(results, ["injury", "fever", "baby", "power"].includes(intent.id))}
                style={styles.acceptButton}
              >
                <Text style={styles.acceptText}>Accept generated cart</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.resultTitle}>
              {results.length ? `Suggestions for "${submittedQuery}"` : "No matching products yet"}
            </Text>
          )
        ) : null}

        <View style={styles.productGrid}>
          {results.slice(0, 8).map((product, index) => (
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
    backgroundColor: "#ffffff",
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 106
  },
  assistantHero: {
    alignItems: "center",
    backgroundColor: "#131921",
    borderRadius: 8,
    padding: 20
  },
  starCircle: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 12
  },
  heroText: {
    color: "#d4d9e0",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 5,
    textAlign: "center"
  },
  inputRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 16
  },
  input: {
    backgroundColor: colors.search,
    borderRadius: 24,
    color: colors.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 13
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.amazonBlue,
    borderRadius: 23,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  suggestionList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  suggestion: {
    backgroundColor: "#fff4df",
    borderColor: "#ffd183",
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  suggestionText: {
    color: "#5f430d",
    fontSize: 12,
    fontWeight: "800"
  },
  resultTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 20
  },
  intentCard: {
    backgroundColor: "#eef8ff",
    borderColor: "#c9e6f7",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 18,
    padding: 14
  },
  intentBadge: { color: "#b42318", fontSize: 10, fontWeight: "900" },
  intentTitle: { color: colors.ink, fontSize: 18, fontWeight: "900", marginTop: 5 },
  intentText: { color: colors.muted, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 4 },
  acceptButton: { alignItems: "center", backgroundColor: colors.amazonOrange, borderRadius: 7, marginTop: 12, padding: 11 },
  acceptText: { color: colors.amazonBlue, fontSize: 13, fontWeight: "900" },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  }
});
