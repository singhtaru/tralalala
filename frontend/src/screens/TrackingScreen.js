import React, { useEffect, useRef, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Animated, ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

const steps = [
  { label: "Order Placed", sub: "Order received by the store" },
  { label: "Preparing Order", sub: "Store is packing your items" },
  { label: "Finding Delivery Partner", sub: "Assigning nearest driver..." },
  { label: "Driver Assigned", sub: "Rahul Kumar is assigned to your delivery" },
  { label: "Driver En Route", sub: "Rider is heading to your location" },
  { label: "Approaching Destination", sub: "Rider is less than 1 minute away" },
  { label: "Delivered", sub: "Delivered! Thank you for using Amazon Now" }
];

export default function TrackingScreen({
  cart,
  goBack,
  paymentMethod,
  setPaymentMethod,
  total,
  selectedAddress,
  triggerGlobalNotification
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Position coordinates for the rider:
  // Starts at store/pickup (x=290, y=86) and ends at home (x=64, y=152)
  const riderX = useRef(new Animated.Value(290)).current;
  const riderY = useRef(new Animated.Value(86)).current;

  const stepsCoords = [
    { x: 290, y: 86 },   // Placed (at store)
    { x: 290, y: 86 },   // Preparing (at store)
    { x: 290, y: 86 },   // Finding Partner (at store)
    { x: 290, y: 86 },   // Driver Assigned (at store)
    { x: 190, y: 115 },  // En Route (mid-way)
    { x: 110, y: 138 },  // Approaching (near home)
    { x: 64, y: 152 }    // Delivered (at home)
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Show rating popup when delivery is complete
  useEffect(() => {
    if (currentStep === steps.length - 1 && !ratingSubmitted) {
      const timer = setTimeout(() => {
        setShowRatingModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleSubmitRating = () => {
    setRatingSubmitted(true);
    setTimeout(() => {
      setShowRatingModal(false);
    }, 1500);
  };

  const handleSkipRating = () => {
    setShowRatingModal(false);
    setRatingSubmitted(true);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(riderX, {
        toValue: stepsCoords[currentStep].x,
        duration: currentStep === 0 ? 0 : 2500,
        useNativeDriver: true
      }),
      Animated.timing(riderY, {
        toValue: stepsCoords[currentStep].y,
        duration: currentStep === 0 ? 0 : 2500,
        useNativeDriver: true
      })
    ]).start();

    if (!triggerGlobalNotification) {
      return;
    }

    const notifications = [
      `Order total ₹${total} received. Locating store...`,
      "Store is preparing your order. Items are being packed.",
      "Finding delivery partner for immediate dispatch...",
      "Driver Assigned! Rahul Kumar is on his way to store.",
      "Rider Picked Up! Rahul Kumar is heading to your location.",
      "Rider Approaching! Rahul Kumar is less than 1 minute away.",
      "Delivered! Enjoy your 10-minute essentials."
    ];

    triggerGlobalNotification("Amazon Now", notifications[currentStep]);
  }, [currentStep]);

  const progressPct = (currentStep / (steps.length - 1)) * 100;

  return (
    <View style={styles.screen}>
      {/* Green Header */}
      <View style={styles.greenHeader}>
        <View style={styles.headerTop}>
          <Pressable onPress={goBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </Pressable>
          <Image source={require("../../assets/intro/amazon-now-transparent.png")} resizeMode="contain" style={styles.logo} />
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.statusTitle}>
          {steps[currentStep].label}
        </Text>
        <View style={styles.etaPill}>
          <Text style={styles.etaText}>
            {currentStep === 6 ? "Arrived" : `Arriving in ${Math.max(1, 10 - currentStep * 2)} mins`}
          </Text>
          <Ionicons name="refresh" size={15} color="#ffffff" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Progress Tracker list */}
        <View style={styles.trackerCard}>
          <Text style={styles.cardHeaderTitle}>Delivery Status</Text>
          <View style={styles.progressTimeline}>
            <View style={styles.timelineBar}>
              <View style={[styles.timelineFill, { height: `${progressPct}%` }]} />
            </View>
            <View style={styles.timelinePoints}>
              {steps.map((step, idx) => {
                const isActive = currentStep >= idx;
                return (
                  <View key={idx} style={styles.timelineItem}>
                    <View style={[styles.circleDot, isActive && styles.circleDotActive]}>
                      {currentStep === idx && <View style={styles.activeDotInner} />}
                    </View>
                    <View style={styles.stepTexts}>
                      <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                        {step.label}
                      </Text>
                      <Text style={styles.stepSub}>{step.sub}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Live Map with Animated Rider */}
        <View style={styles.map}>
          {/* Route path lines */}
          <View style={styles.routeLineOne} />
          <View style={styles.routeLineTwo} />
          
          {/* Destination: Home */}
          <View style={styles.homePin}>
            <Ionicons name="home" size={15} color="#ffffff" />
          </View>
          
          {/* Pickup: Store */}
          <View style={styles.storePin}>
            <Ionicons name="storefront" size={14} color="#ffffff" />
          </View>

          {/* Animated Rider Marker */}
          <Animated.View
            style={[
              styles.driverPin,
              {
                transform: [
                  { translateX: riderX },
                  { translateY: riderY }
                ]
              }
            ]}
          >
            <MaterialCommunityIcons name="motorbike" size={20} color="#ffffff" />
          </Animated.View>

          {/* Search Pulse (only while preparing/finding driver) */}
          {currentStep < 3 && (
            <View style={styles.searchPulse}>
              <Ionicons name="radio-outline" size={24} color="#ffffff" />
            </View>
          )}

          <Text style={styles.mapLabel}>
            {currentStep === 6 ? "Delivered" : (currentStep >= 4 ? "Live Tracking" : "Store Preparing")}
          </Text>
        </View>

        {/* Delivery Address Summary */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Delivery Destination</Text>
          {selectedAddress ? (
            <Text style={styles.addressText}>
              {selectedAddress.name} — {selectedAddress.phone}{"\n"}
              {selectedAddress.flat}, {selectedAddress.street}, {selectedAddress.area},{"\n"}
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pin}
            </Text>
          ) : (
            <Text style={styles.addressText}>Standard Delivery Location</Text>
          )}
        </View>

        {/* Driver Profile Section */}
        {currentStep < 3 ? (
          <View style={styles.assigningCard}>
            <ActivityIndicator size="small" color="#1f9d47" style={{ marginRight: 8 }} />
            <View style={styles.partnerCopy}>
              <Text style={styles.partnerName}>Finding Delivery Partner...</Text>
              <Text style={styles.partnerSub}>Locating nearest rider for instant dispatch.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.partnerCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>R</Text>
            </View>
            <View style={styles.partnerCopy}>
              <Text style={styles.partnerName}>Rahul Kumar</Text>
              <Text style={styles.partnerSub}>2,200+ five-star deliveries • Bike</Text>
            </View>
            <Ionicons name="call" size={21} color="#00a8e1" />
          </View>
        )}

        {/* Order Bill Summary */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Order details</Text>
          <Text style={styles.paymentLine}>Payment method: {paymentMethod}</Text>
          {cart.map((item) => (
            <Text key={item.id} numberOfLines={1} style={styles.orderLine}>
              {item.qty} x {item.name}
            </Text>
          ))}
          <Text style={styles.totalLine}>Bill total ₹{total}</Text>
        </View>
      </ScrollView>

      {/* Driver Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="fade"
        onRequestClose={handleSkipRating}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {!ratingSubmitted ? (
              <>
                <View style={styles.modalIconContainer}>
                  <Ionicons name="star" size={36} color="#ff9900" />
                </View>
                <Text style={styles.modalTitle}>Rate Your Driver</Text>
                <Text style={styles.modalMessage}>How was your delivery experience?</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable key={star} onPress={() => setSelectedRating(star)} style={styles.starButton}>
                      <Ionicons
                        name={selectedRating >= star ? "star" : "star-outline"}
                        size={36}
                        color={selectedRating >= star ? "#ff9900" : "#d1d5db"}
                      />
                    </Pressable>
                  ))}
                </View>
                <Pressable
                  onPress={handleSubmitRating}
                  disabled={selectedRating === 0}
                  style={[styles.submitRatingBtn, selectedRating === 0 && styles.submitRatingBtnDisabled]}
                >
                  <Text style={styles.submitRatingText}>Submit Rating</Text>
                </Pressable>
                <Pressable onPress={handleSkipRating} style={styles.skipBtn}>
                  <Text style={styles.skipBtnText}>Skip</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.modalIconContainer}>
                  <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
                </View>
                <Text style={styles.modalTitle}>Thank you for your feedback!</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  backButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 32
  },
  headerSpacer: {
    width: 32
  },
  logo: {
    height: 38,
    width: 178
  },
  statusTitle: {
    color: "#ffffff",
    fontSize: 22,
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
    paddingBottom: 100
  },
  trackerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    margin: 14,
    padding: 16
  },
  cardHeaderTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 16
  },
  progressTimeline: {
    flexDirection: "row",
    width: "100%"
  },
  timelineBar: {
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    left: 20,
    position: "absolute",
    top: 10,
    bottom: 24,
    width: 4
  },
  timelineFill: {
    backgroundColor: colors.green,
    borderRadius: 2,
    width: "100%"
  },
  timelinePoints: {
    gap: 16,
    width: "100%"
  },
  timelineItem: {
    flexDirection: "row",
    width: "100%"
  },
  circleDot: {
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    marginRight: 16,
    width: 24,
    zIndex: 2
  },
  circleDotActive: {
    backgroundColor: colors.green
  },
  activeDotInner: {
    backgroundColor: "#ffffff",
    borderRadius: 4,
    height: 8,
    width: 8
  },
  stepTexts: {
    flex: 1
  },
  stepLabel: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "800"
  },
  stepLabelActive: {
    color: colors.ink
  },
  stepSub: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2
  },
  map: {
    backgroundColor: "#dfe7ee",
    height: 240,
    marginHorizontal: 14,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative"
  },
  routeLineOne: {
    borderColor: "#1a73e8",
    borderStyle: "dashed",
    borderWidth: 2,
    height: 0,
    left: 64,
    position: "absolute",
    top: 145,
    transform: [{ rotate: "-25deg" }],
    width: 180
  },
  routeLineTwo: {
    borderColor: "#1a73e8",
    borderStyle: "dashed",
    borderWidth: 2,
    height: 0,
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
    left: 48,
    position: "absolute",
    top: 134,
    width: 36,
    zIndex: 10
  },
  storePin: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    right: 48,
    position: "absolute",
    top: 68,
    width: 36,
    zIndex: 10
  },
  driverPin: {
    alignItems: "center",
    backgroundColor: "#c52222",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    width: 36,
    zIndex: 20
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
    right: 32,
    top: 52,
    width: 68
  },
  mapLabel: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    bottom: 12,
    color: colors.ink,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: "absolute",
    right: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  partnerCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 14,
    marginTop: 14,
    padding: 14
  },
  assigningCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 14,
    marginTop: 14,
    padding: 14
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
    fontSize: 15,
    fontWeight: "900"
  },
  partnerSub: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    margin: 14,
    padding: 14
  },
  detailsTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 8
  },
  addressText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18
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
  paymentLine: {
    color: colors.amazonBlue,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30
  },
  modalCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 28,
    width: "100%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12
  },
  modalIconContainer: {
    alignItems: "center",
    backgroundColor: "#fff7e6",
    borderRadius: 40,
    height: 72,
    justifyContent: "center",
    marginBottom: 16,
    width: 72
  },
  modalTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center"
  },
  modalMessage: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center"
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24
  },
  starButton: {
    padding: 4
  },
  submitRatingBtn: {
    alignItems: "center",
    backgroundColor: "#ff9900",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: "100%"
  },
  submitRatingBtnDisabled: {
    backgroundColor: "#f3d078",
    opacity: 0.7
  },
  submitRatingText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800"
  },
  skipBtn: {
    marginTop: 14,
    padding: 8
  },
  skipBtnText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "600"
  }
});
