import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function CategoryGrid({ sections, openCategory }) {
  return (
    <>
      {sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.grid}>
            {section.tiles.map((tile) => (
              <Pressable key={tile.id} onPress={() => openCategory(tile)} style={styles.tile}>
                <View style={styles.imageBox}>
                  <Image source={{ uri: tile.image }} style={styles.image} />
                </View>
                <Text numberOfLines={2} style={styles.title}>{tile.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 8
  },
  sectionTitle: {
    color: "#242931",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 12
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  tile: {
    alignItems: "center",
    marginBottom: 20,
    width: "23%"
  },
  imageBox: {
    backgroundColor: colors.softMint,
    borderRadius: 8,
    height: 74,
    overflow: "hidden",
    width: "100%"
  },
  image: {
    height: "100%",
    width: "100%"
  },
  title: {
    color: "#30343b",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17,
    marginTop: 8,
    minHeight: 35,
    textAlign: "center"
  }
});
