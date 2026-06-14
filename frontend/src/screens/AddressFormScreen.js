import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export default function AddressFormScreen({
  addressToEdit,
  focusInput,
  updateKeyboardValue,
  hideKeyboard,
  onSave,
  goBack
}) {
  const isEditing = !!addressToEdit;
  const [formData, setFormData] = useState({
    name: addressToEdit?.name || "",
    phone: addressToEdit?.phone || "",
    flat: addressToEdit?.flat || "",
    street: addressToEdit?.street || "",
    area: addressToEdit?.area || "",
    city: addressToEdit?.city || "",
    state: addressToEdit?.state || "",
    pin: addressToEdit?.pin || ""
  });

  const [activeField, setActiveField] = useState(null);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const triggerFocus = (field, placeholder, isNumeric = false) => {
    setActiveField(field);
    focusInput({
      type: isNumeric ? "numeric" : "text",
      value: formDataRef.current[field],
      placeholder: placeholder,
      onChangeText: (text) => {
        setFormData((prev) => {
          const next = { ...prev, [field]: text };
          formDataRef.current = next;
          return next;
        });
        updateKeyboardValue(text);
      },
      onSubmit: () => {
        hideKeyboard();
        setActiveField(null);
      }
    });
  };

  useEffect(() => {
    return () => hideKeyboard();
  }, []);

  const handleTextChange = (field, text) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: text };
      formDataRef.current = next;
      return next;
    });
    updateKeyboardValue(text);
  };

  const isFormValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.flat.trim() &&
    formData.street.trim() &&
    formData.area.trim() &&
    formData.city.trim() &&
    formData.state.trim() &&
    formData.pin.trim();

  const handleSave = () => {
    if (!isFormValid) return;
    onSave({
      id: addressToEdit?.id || "addr_" + Date.now(),
      ...formData,
      isDefault: addressToEdit?.isDefault || false
    });
  };

  return (
    <View style={styles.screen}>
      {/* iOS Top Bar */}
      <View style={styles.navBar}>
        <Pressable onPress={goBack} style={styles.navBack}>
          <Ionicons name="chevron-back" size={24} color="#007aff" />
          <Text style={styles.navBackText}>Cancel</Text>
        </Pressable>
        <Text style={styles.navTitle}>{isEditing ? "Edit Address" : "Add Address"}</Text>
        <View style={styles.navPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sectionHeader}>CONTACT DETAILS</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) => handleTextChange("name", text)}
              onFocus={() => triggerFocus("name", "Enter full name")}
              showSoftInputOnFocus={false}
              style={[styles.input, activeField === "name" && styles.inputActive]}
            />
          </View>
          <View style={[styles.inputRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.inputLabel}>Mobile No</Text>
            <TextInput
              value={formData.phone}
              onChangeText={(text) => handleTextChange("phone", text)}
              onFocus={() => triggerFocus("phone", "Enter mobile number", true)}
              showSoftInputOnFocus={false}
              style={[styles.input, activeField === "phone" && styles.inputActive]}
            />
          </View>
        </View>

        <Text style={styles.sectionHeader}>ADDRESS DETAILS</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Flat / House</Text>
            <TextInput
              value={formData.flat}
              onChangeText={(text) => handleTextChange("flat", text)}
              onFocus={() => triggerFocus("flat", "Flat/House number")}
              showSoftInputOnFocus={false}
              style={[styles.input, activeField === "flat" && styles.inputActive]}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Street / Road</Text>
            <TextInput
              value={formData.street}
              onChangeText={(text) => handleTextChange("street", text)}
              onFocus={() => triggerFocus("street", "Street address")}
              showSoftInputOnFocus={false}
              style={[styles.input, activeField === "street" && styles.inputActive]}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Area / Sector</Text>
            <TextInput
              value={formData.area}
              onChangeText={(text) => handleTextChange("area", text)}
              onFocus={() => triggerFocus("area", "Area or Sector")}
              showSoftInputOnFocus={false}
              style={[styles.input, activeField === "area" && styles.inputActive]}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              value={formData.city}
              onChangeText={(text) => handleTextChange("city", text)}
              onFocus={() => triggerFocus("city", "City")}
              showSoftInputOnFocus={false}
              style={[styles.input, activeField === "city" && styles.inputActive]}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>State</Text>
            <TextInput
              value={formData.state}
              onChangeText={(text) => handleTextChange("state", text)}
              onFocus={() => triggerFocus("state", "State")}
              showSoftInputOnFocus={false}
              style={[styles.input, activeField === "state" && styles.inputActive]}
            />
          </View>
          <View style={[styles.inputRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.inputLabel}>PIN Code</Text>
            <TextInput
              value={formData.pin}
              onChangeText={(text) => handleTextChange("pin", text)}
              onFocus={() => triggerFocus("pin", "PIN Code", true)}
              showSoftInputOnFocus={false}
              style={[styles.input, activeField === "pin" && styles.inputActive]}
            />
          </View>
        </View>

        <Pressable
          disabled={!isFormValid}
          onPress={handleSave}
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Save Address</Text>
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
    paddingHorizontal: 8
  },
  navBack: {
    alignItems: "center",
    flexDirection: "row"
  },
  navBackText: {
    color: "#007aff",
    fontSize: 16
  },
  navTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700"
  },
  navPlaceholder: {
    width: 60
  },
  content: {
    padding: 16,
    paddingBottom: 120
  },
  sectionHeader: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    marginLeft: 6
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden"
  },
  inputRow: {
    alignItems: "center",
    borderBottomColor: "#f3f4f6",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 44,
    paddingHorizontal: 12
  },
  inputLabel: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    width: 100
  },
  input: {
    color: "#374151",
    flex: 1,
    fontSize: 14,
    height: "100%",
    outlineStyle: "none"
  },
  inputActive: {
    color: "#007aff",
    fontWeight: "600"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ff9900",
    borderRadius: 6,
    height: 48,
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1
  },
  buttonDisabled: {
    backgroundColor: "#f3d078",
    opacity: 0.8
  },
  buttonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700"
  }
});
