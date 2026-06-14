import React, { useEffect, useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function IosNotification({
  visible,
  title = "Amazon Now",
  body = "Your verification code is: 123456",
  onDismiss,
  onPress
}) {
  const slideAnim = useRef(new Animated.Value(-120)).current; // starts offscreen above

  useEffect(() => {
    if (visible) {
      // Slide down
      Animated.spring(slideAnim, {
        toValue: 10, // 10px from top inside the device frame
        tension: 40,
        friction: 8,
        useNativeDriver: true
      }).start();

      // Auto dismiss after 6 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(slideAnim, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  const handlePress = () => {
    if (onPress) onPress();
    handleClose();
  };

  if (!visible && slideAnim._value === -120) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <Pressable onPress={handlePress} style={styles.notificationContent}>
        {/* Top bar of the notification banner */}
        <View style={styles.header}>
          <View style={styles.appIconContainer}>
            <Image source={require("../../../assets/intro/now.png")} style={styles.appIcon} />
          </View>
          <Text style={styles.appName}>MESSAGES</Text>
          <Text style={styles.timeText}>now</Text>
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close-circle" size={16} color="#9ca3af" />
          </Pressable>
        </View>

        {/* Text body */}
        <View style={styles.body}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.bodyText}>{body}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    left: 10,
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1000,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5
  },
  notificationContent: {
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 18,
    borderColor: "#e5e7eb",
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 6
  },
  appIconContainer: {
    backgroundColor: "#10b981",
    borderRadius: 4,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    width: 18
  },
  appIcon: {
    height: 12,
    resizeMode: "contain",
    width: 12
  },
  appName: {
    color: "#6b7280",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6
  },
  timeText: {
    color: "#6b7280",
    fontSize: 9,
    fontWeight: "700",
    marginLeft: 6
  },
  closeBtn: {
    marginLeft: "auto",
    padding: 2
  },
  body: {
    paddingLeft: 2
  },
  titleText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900"
  },
  bodyText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 2
  }
});
