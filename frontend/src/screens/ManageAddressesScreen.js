import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function ManageAddressesScreen({
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  goBack
}) {
  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.navBar}>
        <Pressable onPress={goBack} style={styles.navBack}>
          <Ionicons name="chevron-back" size={24} color={colors.ink} />
        </Pressable>
        <Text style={styles.navTitle}>Saved Addresses</Text>
        <Pressable onPress={onAddAddress} style={styles.navAdd}>
          <Ionicons name="add" size={24} color="#007aff" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {addresses.length === 0 ? (
          <View style={styles.emptyView}>
            <MaterialCommunityIcons name="map-marker-off-outline" size={60} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No Addresses Saved</Text>
            <Text style={styles.emptyText}>Add your delivery addresses to begin quick checkout.</Text>
          </View>
        ) : (
          addresses.map((address) => {
            const isSelected = selectedAddress?.id === address.id;
            return (
              <Pressable
                key={address.id}
                onPress={() => onSelectAddress(address)}
                style={[styles.addressCard, isSelected && styles.addressCardActive]}
              >
                <View style={styles.addressHeader}>
                  <View style={styles.nameRow}>
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={20}
                      color={isSelected ? "#ff9900" : "#9ca3af"}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.addressName}>{address.name}</Text>
                  </View>
                  {address.isDefault || isSelected ? (
                    <Text style={styles.defaultBadge}>Active</Text>
                  ) : null}
                </View>

                <Text style={styles.phoneText}>Mobile: {address.phone}</Text>
                <Text style={styles.addressDetails}>
                  {address.flat}, {address.street},{"\n"}
                  {address.area}, {address.city},{"\n"}
                  {address.state} - {address.pin}
                </Text>

                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => onEditAddress(address)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="create-outline" size={16} color="#007aff" />
                    <Text style={[styles.actionButtonText, { color: "#007aff" }]}>Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onDeleteAddress(address.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="trash-outline" size={16} color="#dc2626" />
                    <Text style={[styles.actionButtonText, { color: "#dc2626" }]}>Delete</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })
        )}

        <Pressable onPress={onAddAddress} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={20} color="#111827" />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f3f4f6",
    flex: 1
  },
  navBar: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  navBack: {
    padding: 4
  },
  navTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700"
  },
  navAdd: {
    padding: 4
  },
  content: {
    padding: 16,
    paddingBottom: 100
  },
  emptyView: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40
  },
  emptyTitle: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center"
  },
  addressCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4
  },
  addressCardActive: {
    borderColor: "#ff9900",
    borderWidth: 1.5
  },
  addressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  nameRow: {
    alignItems: "center",
    flexDirection: "row"
  },
  addressName: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700"
  },
  defaultBadge: {
    backgroundColor: "#fff7e6",
    borderColor: "#ff9900",
    borderWidth: 0.5,
    borderRadius: 4,
    color: "#ff9900",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  phoneText: {
    color: "#4b5563",
    fontSize: 13,
    marginBottom: 4
  },
  addressDetails: {
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 18
  },
  actionRow: {
    borderTopColor: "#f3f4f6",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    paddingTop: 12
  },
  actionButton: {
    alignItems: "center",
    flexDirection: "row"
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    height: 48,
    justifyContent: "center",
    marginTop: 8
  },
  addButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6
  }
});
