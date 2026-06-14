import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

const categoryColors = {
  fruits: "#edf7ee",
  atta: "#fef6e9",
  oil: "#fbf6f0",
  dairy: "#e8f4fd",
  bakery: "#fcf0e8",
  cereal: "#f5eefa",
  meat: "#fdeced",
  kitchen: "#f1f3f5",
  chips: "#fefde8",
  chocolate: "#f5ecea",
  drinks: "#e3f9fc",
  tea: "#f5faed",
  instant: "#fdf0f4",
  health: "#edf7f6",
  icecream: "#fef8e7"
};

export default function CategoryGrid({ sections, openCategory }) {
  return (
    <>
      {sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.grid}>
            {section.tiles.map((tile) => {
              const bgColor = categoryColors[tile.id] || "#f3f4f6";
              return (
                <Pressable
                  key={tile.id}
                  onPress={() => openCategory(tile)}
                  style={[styles.tile, { backgroundColor: bgColor }]}
                >
                  <View style={styles.textContainer}>
                    <Text numberOfLines={2} style={styles.tileTitle}>
                      {tile.title}
                    </Text>
                  </View>
                  <Image source={{ uri: tile.image }} style={styles.tileImage} />
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 10
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
    marginBottom: 12
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-start"
  },
  tile: {
    borderRadius: 12,
    flexDirection: "column",
    height: 105,
    justifyContent: "space-between",
    marginBottom: 8,
    overflow: "hidden",
    padding: 10,
    position: "relative",
    width: "31.5%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderColor: "rgba(0,0,0,0.04)",
    borderWidth: 0.5
  },
  textContainer: {
    alignSelf: "stretch"
  },
  tileTitle: {
    color: "#1f2937",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 16
  },
  tileImage: {
    bottom: -4,
    height: 54,
    position: "absolute",
    right: -4,
    width: 54,
    borderRadius: 8
  }
});
