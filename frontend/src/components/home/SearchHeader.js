import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../theme/colors";
import { topTabs } from "../../data/products";

export default function SearchHeader({
  activeTab,
  query,
  setActiveTab,
  setQuery,
  setScreen
}) {
  return (
    <View style={styles.searchSticky}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={23} color="#121820" style={styles.leadingIcon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onFocus={() => setScreen("search")}
          placeholder="Search for atta, dal, coke and..."
          placeholderTextColor={colors.ink}
          style={styles.searchInput}
          returnKeyType="search"
        />
        <Pressable onPress={() => setScreen("assistant")} style={styles.assistButton}>
          <Ionicons name="sparkles" size={20} color={colors.amazonOrange} />
        </Pressable>
        <Pressable style={styles.micButton}>
          <Ionicons name="mic" size={22} color="#121820" />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
        {topTabs.map((tab) => (
          <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)} style={styles.tabItem}>
            <MaterialCommunityIcons
              name={tab.icon}
              size={22}
              color={activeTab === tab.id ? colors.amazonOrange : "#20242a"}
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
            {activeTab === tab.id ? <View style={styles.tabUnderline} /> : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchSticky: {
    backgroundColor: "#ffffff",
    borderBottomColor: colors.stroke,
    borderBottomWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 10
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: colors.search,
    borderRadius: 25,
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: 14
  },
  leadingIcon: {
    marginRight: 8
  },
  searchInput: {
    color: "#101418",
    flex: 1,
    fontSize: 17,
    fontWeight: "700"
  },
  micButton: {
    alignItems: "center",
    borderLeftColor: "#d9e1e3",
    borderLeftWidth: 1,
    height: 34,
    justifyContent: "center",
    paddingLeft: 14
  },
  assistButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    paddingHorizontal: 8
  },
  tabRow: {
    gap: 12,
    paddingTop: 12
  },
  tabItem: {
    alignItems: "center",
    minHeight: 52,
    minWidth: 58
  },
  tabText: {
    color: "#272c33",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5
  },
  tabTextActive: {
    color: "#111827"
  },
  tabUnderline: {
    backgroundColor: "#111827",
    borderRadius: 2,
    bottom: 0,
    height: 4,
    position: "absolute",
    width: 42
  }
});
