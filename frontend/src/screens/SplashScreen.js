import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Video, ResizeMode } from "expo-av";

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const [hasFinished, setHasFinished] = useState(false);

  // Transition helper with fade out
  const triggerTransition = () => {
    if (hasFinished) return;
    setHasFinished(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      if (onFinish) onFinish();
    });
  };

  useEffect(() => {
    // Defensive safety timer: transition automatically if video fails to play or triggers after 7 seconds
    const safetyTimer = setTimeout(() => {
      triggerTransition();
    }, 7000);

    return () => clearTimeout(safetyTimer);
  }, []);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      triggerTransition();
    }
  };

  return (
    <Animated.View style={[styles.splash, { opacity: fadeAnim }]}>
      <Video
        ref={videoRef}
        source={require("../../assets/intro/amazon-now-logo-reveal.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted={true} // Crucial for desktop/web browser autoplay support
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splash: {
    backgroundColor: "#131921",
    flex: 1,
    height: "100%",
    width: "100%"
  }
});
