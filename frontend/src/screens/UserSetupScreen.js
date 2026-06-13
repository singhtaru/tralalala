import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export default function UserSetupScreen({
  focusInput,
  updateKeyboardValue,
  hideKeyboard,
  onComplete
}) {
  const [formData, setFormData] = useState({
    name: "Shivi",
    phone: "62993 36649",
    flat: "Flat 402, Block C",
    street: "Sector 62",
    area: "Siddharth Vihar",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    pin: "201009"
  });

  const [deposit, setDeposit] = useState(1000);
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

  const handleContinue = () => {
    if (!isFormValid) return;
    onComplete({
      customer: {
        name: formData.name,
        phone: formData.phone
      },
      address: {
        id: "addr_default",
        name: formData.name,
        phone: formData.phone,
        flat: formData.flat,
        street: formData.street,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        pin: formData.pin,
        isDefault: true
      },
      deposit: deposit
    });
  };

  return (
    <View style={styles.screen}>
      {/* iOS Top Bar */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Set up Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.welcomeTitle}>Welcome to Amazon Now</Text>
        <Text style={styles.welcomeSub}>Please set up your delivery profile and emergency deposit to begin immediate ordering.</Text>

        {/* Section 1: Personal Info */}
        <Text style={styles.sectionHeader}>PERSONAL DETAILS</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) => handleTextChange("name", text)}
              onFocus={() => triggerFocus("name", "Enter your name")}
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

        {/* Section 2: Address Info */}
        <Text style={styles.sectionHeader}>DELIVERY ADDRESS</Text>
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

        {/* Section 3: Emergency Deposit Setup */}
        <Text style={styles.sectionHeader}>EMERGENCY DEPOSIT WALLET</Text>
        <View style={styles.card}>
          <Text style={styles.depositExplanation}>
            Choose an emergency reserve deposit tier. This deposit is locked separately from your Amazon Wallet and will ONLY be tapped automatically during critical checkout emergencies if your standard balance runs dry.
          </Text>

          <View style={styles.depositOptions}>
            {[500, 1000, 2000].map((amount) => (
              <Pressable
                key={amount}
                onPress={() => setDeposit(amount)}
                style={[
                  styles.depositPill,
                  deposit === amount && styles.depositPillActive
                ]}
              >
                <Text
                  style={[
                    styles.depositPillText,
                    deposit === amount && styles.depositPillTextActive
                  ]}
                >
                  ₹{amount}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Action button */}
        <Pressable
          disabled={!isFormValid}
          onPress={handleContinue}
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Continue to Shopping</Text>
          <Ionicons name="chevron-forward" size={16} color="#111827" />
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
    height: 48,
    justifyContent: "center"
  },
  navTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700"
  },
  content: {
    padding: 16,
    paddingBottom: 120
  },
  welcomeTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8
  },
  welcomeSub: {
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 20
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
  depositExplanation: {
    color: "#4b5563",
    fontSize: 12,
    lineHeight: 17,
    padding: 12
  },
  depositOptions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 14
  },
  depositPill: {
    alignItems: "center",
    borderColor: "#d1d5db",
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10
  },
  depositPillActive: {
    backgroundColor: "#fff7e6",
    borderColor: "#ff9900"
  },
  depositPillText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "700"
  },
  depositPillTextActive: {
    color: "#ff9900"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ff9900",
    borderRadius: 6,
    flexDirection: "row",
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
    fontWeight: "700",
    marginRight: 4
  }
});
