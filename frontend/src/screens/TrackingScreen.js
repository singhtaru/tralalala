import React, { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function TrackingScreen({ cart, goBack, paymentMethod, setPaymentMethod, total }) {
  const [showPaymentSheet, setShowPaymentSheet] = useState(true);
  const [driverAssigned, setDriverAssigned] = useState(false);
  const eta = 9;
  const [secondsLeft, setSecondsLeft] = useState(eta * 60);

  useEffect(() => {
    const timer = setTimeout(() => setDriverAssigned(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (paymentMethod !== "Pay Later") return undefined;
    const timer = setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [paymentMethod]);

  return (
    <View style={styles.screen}>
      <View style={styles.greenHeader}>
        <View style={styles.headerTop}>
          <Pressable onPress={goBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </Pressable>
          <Image source={require("../../assets/intro/amazon-now-transparent.png")} style={styles.logo} />
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.statusTitle}>
          {driverAssigned ? "Order is on the way" : "Assigning your delivery partner"}
        </Text>
        <View style={styles.etaPill}>
          <Text style={styles.etaText}>
            {driverAssigned ? `Arriving in ${eta} mins` : "Finding the nearest available driver"}
          </Text>
          <Ionicons name="refresh" size={15} color="#ffffff" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.couponRow}>
          <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={colors.green} />
          <Text style={styles.couponText}>Get a coupon if we do not reach you in time</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </View>

        <View style={styles.map}>
          <View style={styles.routeLineOne} />
          <View style={styles.routeLineTwo} />
          <View style={styles.homePin}>
            <Ionicons name="home" size={15} color="#ffffff" />
          </View>
          {driverAssigned ? (
            <View style={styles.driverPin}>
              <MaterialCommunityIcons name="motorbike" size={24} color="#ffffff" />
            </View>
          ) : (
            <View style={styles.searchPulse}>
              <Ionicons name="radio-outline" size={24} color="#ffffff" />
            </View>
          )}
          <Text style={styles.mapLabel}>{driverAssigned ? "Live tracking" : "Searching nearby"}</Text>
        </View>

        {driverAssigned ? <View style={styles.partnerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>
          <View style={styles.partnerCopy}>
            <Text style={styles.partnerName}>Rahul Kumar</Text>
            <Text style={styles.partnerSub}>2200+ five-star deliveries</Text>
          </View>
          <Ionicons name="call" size={21} color="#e34d64" />
        </View> : (
          <View style={styles.assigningCard}>
            <View style={styles.assigningIcon}>
              <MaterialCommunityIcons name="motorbike" size={26} color={colors.green} />
            </View>
            <View style={styles.partnerCopy}>
              <Text style={styles.partnerName}>Waiting for driver assignment</Text>
              <Text style={styles.partnerSub}>We are matching your order with the closest partner.</Text>
            </View>
          </View>
        )}

        {driverAssigned ? <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Thank Rahul by leaving a tip</Text>
          <Text style={styles.tipSub}>100% of the tip will go to your delivery partner.</Text>
          <View style={styles.tipRow}>
            {["INR 20", "INR 30", "INR 50", "Other"].map((tip) => (
              <Text key={tip} style={styles.tipPill}>{tip}</Text>
            ))}
          </View>
        </View> : null}

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Order details</Text>
          <Text style={styles.paymentLine}>Payment: {paymentMethod}</Text>
          {paymentMethod === "Pay Later" ? <Text style={styles.payLater}>Pay Later countdown: {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}</Text> : null}
          {cart.map((item) => (
            <Text key={item.id} numberOfLines={1} style={styles.orderLine}>
              {item.qty} x {item.name}
            </Text>
          ))}
          <Text style={styles.totalLine}>Bill total INR {total}</Text>
        </View>
      </ScrollView>

      {showPaymentSheet ? (
        <View style={styles.paymentSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Choose payment source</Text>
          <Pressable
            onPress={() => {
              setPaymentMethod("Amazon Wallet");
              setShowPaymentSheet(false);
            }}
            style={styles.sheetOption}
          >
            <MaterialCommunityIcons name="wallet-outline" size={25} color={colors.amazonBlue} />
            <View style={styles.sheetCopy}>
              <Text style={styles.sheetOptionTitle}>Deduct from Amazon Wallet</Text>
              <Text style={styles.sheetOptionSub}>Synced balance INR 1,250</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setPaymentMethod("Emergency Deposit");
              setShowPaymentSheet(false);
            }}
            style={styles.sheetOption}
          >
            <Ionicons name="shield-checkmark-outline" size={25} color={colors.green} />
            <View style={styles.sheetCopy}>
              <Text style={styles.sheetOptionTitle}>Use Emergency Deposit</Text>
              <Text style={styles.sheetOptionSub}>Protected emergency purchase balance</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setPaymentMethod("Pay Later");
              setShowPaymentSheet(false);
            }}
            style={styles.sheetOption}
          >
            <MaterialCommunityIcons name="clock-outline" size={25} color={colors.amazonBlue} />
            <View style={styles.sheetCopy}>
              <Text style={styles.sheetOptionTitle}>Pay Later</Text>
              <Text style={styles.sheetOptionSub}>Pay before arrival or upon delivery</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setShowPaymentSheet(false)}
            style={styles.sheetOption}
          >
            <Ionicons name="card-outline" size={25} color={colors.amazonBlue} />
            <View style={styles.sheetCopy}>
              <Text style={styles.sheetOptionTitle}>Pay using other source</Text>
              <Text style={styles.sheetOptionSub}>{paymentMethod}, UPI, card or cash</Text>
            </View>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f4f6f8",
    flex: 1
  },
  greenHeader: {
    backgroundColor: "#1f9d47",
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 18
  },
  headerTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerSpacer: {
    width: 32
  },
  backButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 32
  },
  logo: {
    height: 38,
    resizeMode: "contain",
    width: 178
  },
  statusTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 12,
    textAlign: "center"
  },
  etaPill: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  etaText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800"
  },
  content: {
    paddingBottom: 238
  },
  couponRow: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    gap: 10,
    padding: 12
  },
  couponText: {
    color: colors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: "800"
  },
  map: {
    backgroundColor: "#dfe7ee",
    height: 265,
    overflow: "hidden"
  },
  routeLineOne: {
    backgroundColor: "#2376d3",
    height: 5,
    left: 64,
    position: "absolute",
    top: 145,
    transform: [{ rotate: "-25deg" }],
    width: 180
  },
  routeLineTwo: {
    backgroundColor: "#2376d3",
    height: 5,
    left: 190,
    position: "absolute",
    top: 110,
    transform: [{ rotate: "18deg" }],
    width: 130
  },
  homePin: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    left: 64,
    position: "absolute",
    top: 152,
    width: 36
  },
  driverPin: {
    alignItems: "center",
    backgroundColor: "#c52222",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: 58,
    top: 86,
    width: 40
  },
  searchPulse: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderColor: "rgba(31,157,71,0.24)",
    borderRadius: 34,
    borderWidth: 10,
    height: 68,
    justifyContent: "center",
    position: "absolute",
    right: 54,
    top: 76,
    width: 68
  },
  mapLabel: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    bottom: 16,
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "absolute",
    right: 14
  },
  partnerCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    margin: 14,
    padding: 14
  },
  assigningCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    margin: 14,
    padding: 14
  },
  assigningIcon: {
    alignItems: "center",
    backgroundColor: "#e8f8ed",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#ffe1e7",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  avatarText: {
    color: "#d92748",
    fontSize: 22,
    fontWeight: "900"
  },
  partnerCopy: {
    flex: 1
  },
  partnerName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  partnerSub: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  tipCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 14,
    padding: 14
  },
  tipTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  tipSub: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4
  },
  tipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12
  },
  tipPill: {
    backgroundColor: "#fff7e5",
    borderRadius: 14,
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    margin: 14,
    padding: 14
  },
  detailsTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8
  },
  orderLine: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 5
  },
  totalLine: {
    color: colors.green,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 8
  },
  paymentLine: { color: colors.amazonBlue, fontSize: 13, fontWeight: "900", marginBottom: 6 },
  payLater: { backgroundColor: "#fff4df", borderRadius: 6, color: "#7a4d00", fontSize: 12, fontWeight: "900", marginBottom: 9, overflow: "hidden", padding: 8 },
  paymentSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    bottom: 0,
    left: 0,
    padding: 16,
    position: "absolute",
    right: 0,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 18
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: "#d1d5db",
    borderRadius: 3,
    height: 5,
    marginBottom: 14,
    width: 46
  },
  sheetTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12
  },
  sheetOption: {
    alignItems: "center",
    borderColor: colors.stroke,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    padding: 13
  },
  sheetCopy: {
    flex: 1
  },
  sheetOptionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  sheetOptionSub: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  }
});
