import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function GooglePayScreen({ amount, flow = "recharge", onSuccess, onCancel }) {
  const [status, setStatus] = useState("loading"); // "loading", "ready", "processing", "success"

  useEffect(() => {
    // Simulate initial handoff check
    const timer = setTimeout(() => {
      setStatus("ready");
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handlePayment = () => {
    setStatus("processing");
    // Simulate transaction processing
    setTimeout(() => {
      setStatus("success");
      // Return back to app with funds added
      setTimeout(() => {
        onSuccess(amount);
      }, 1500);
    }, 2000);
  };

  // Determine text parameters based on flow
  const merchantName = flow === "onboarding" ? "Amazon Now Setup" : (flow === "checkout" ? "Amazon Now" : "Amazon Now Demo");
  const merchantUpi = flow === "onboarding" ? "deposit.amazonnow@upi" : "amazonnow@upi";
  const amountLabel = flow === "onboarding" ? "Verify Emergency Deposit Setup" : (flow === "checkout" ? "Payment for Amazon Now Order" : "Add Funds to Amazon Wallet");
  const successSub = flow === "onboarding" ? `₹${amount} emergency deposit setup successful` : (flow === "checkout" ? `₹${amount} paid successfully to Amazon Now` : `₹${amount} added to Amazon Wallet`);

  return (
    <View style={styles.screen}>
      {/* GPay Header */}
      <View style={styles.header}>
        <Pressable onPress={onCancel} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#5f6368" />
        </Pressable>
        <Text style={styles.gpayLogo}>Google Pay</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        {status === "loading" && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#1a73e8" />
            <Text style={styles.loaderText}>Connecting to Google Pay...</Text>
          </View>
        )}

        {status === "ready" && (
          <View style={styles.paymentCard}>
            <View style={styles.merchantRow}>
              <View style={styles.merchantLogo}>
                <Ionicons name="cart" size={24} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.merchantName}>{merchantName}</Text>
                <Text style={styles.merchantUpi}>{merchantUpi}</Text>
              </View>
            </View>

            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>{amountLabel}</Text>
              <Text style={styles.amountText}>₹{amount}</Text>
            </View>

            <View style={styles.paymentMethod}>
              <Ionicons name="card" size={22} color="#1a73e8" style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.methodTitle}>HDFC Bank Debit Card</Text>
                <Text style={styles.methodSubtitle}>•••• 4029</Text>
              </View>
            </View>

            <Pressable onPress={handlePayment} style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay ₹{amount}</Text>
            </Pressable>
          </View>
        )}

        {status === "processing" && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#1a73e8" />
            <Text style={styles.loaderText}>Securing transaction with bank...</Text>
            <Text style={styles.secureText}>Do not close the page or press back</Text>
          </View>
        )}

        {status === "success" && (
          <View style={styles.centerContainer}>
            <View style={styles.successRing}>
              <Ionicons name="checkmark-circle" size={80} color="#188038" />
            </View>
            <Text style={styles.successTextTitle}>Payment Successful</Text>
            <Text style={styles.successTextSub}>{successSub}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={16} color="#5f6368" style={{ marginRight: 6 }} />
        <Text style={styles.footerText}>Google Pay Protected Sandbox</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  header: {
    alignItems: "center",
    borderBottomColor: "#e8eaed",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 56,
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  backBtn: {
    padding: 4
  },
  gpayLogo: {
    color: "#5f6368",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.3
  },
  body: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  loaderText: {
    color: "#3c4043",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center"
  },
  secureText: {
    color: "#5f6368",
    fontSize: 12,
    marginTop: 8
  },
  paymentCard: {
    backgroundColor: "#f8f9fa",
    borderColor: "#dadce0",
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    width: "100%"
  },
  merchantRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 20
  },
  merchantLogo: {
    alignItems: "center",
    backgroundColor: "#1a73e8",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  merchantName: {
    color: "#202124",
    fontSize: 16,
    fontWeight: "700"
  },
  merchantUpi: {
    color: "#5f6368",
    fontSize: 13
  },
  amountBox: {
    alignItems: "center",
    borderBottomColor: "#dadce0",
    borderBottomWidth: 1,
    borderTopColor: "#dadce0",
    borderTopWidth: 1,
    paddingVertical: 18,
    marginVertical: 10
  },
  amountLabel: {
    color: "#5f6368",
    fontSize: 13,
    fontWeight: "700"
  },
  amountText: {
    color: "#202124",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 4
  },
  paymentMethod: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 18
  },
  methodTitle: {
    color: "#202124",
    fontSize: 14,
    fontWeight: "700"
  },
  methodSubtitle: {
    color: "#5f6368",
    fontSize: 12
  },
  payButton: {
    alignItems: "center",
    backgroundColor: "#1a73e8",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    shadowColor: "#1a73e8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "100%"
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  successRing: {
    marginBottom: 16
  },
  successTextTitle: {
    color: "#137333",
    fontSize: 22,
    fontWeight: "700"
  },
  successTextSub: {
    color: "#5f6368",
    fontSize: 14,
    marginTop: 6
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    justifyContent: "center"
  },
  footerText: {
    color: "#5f6368",
    fontSize: 12,
    fontWeight: "700"
  }
});
