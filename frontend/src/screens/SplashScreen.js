import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, useWindowDimensions, Platform } from "react-native";
import { Video, ResizeMode } from "expo-av";

// Source-of-truth file: TITLE_Amazon_NOW_Logo_Reveal.mp4 (720 x 1280, 9:16 portrait).
// A lowercase copy is kept alongside for case-insensitive file systems.
const INTRO_VIDEO = require("../../assets/intro/amazon-now-logo-reveal.mp4");
const INTRO_VIDEO_ASPECT = 720 / 1280; // width / height

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const [hasFinished, setHasFinished] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(null);

  // Authoritative viewport for centering and scaling.
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Safe area for centering: ignore zero/initial window sizes that occur
  // for a single frame on web before layout settles.
  const safeW = Math.max(screenWidth, 1);
  const safeH = Math.max(screenHeight, 1);
  const screenAspect = safeW / safeH;

  // Fit-to-screen math: bind to whichever dimension is the limiting factor.
  let videoRenderWidth = safeW;
  let videoRenderHeight = safeH;
  if (screenAspect > INTRO_VIDEO_ASPECT) {
    // Screen is wider (relative) than the video -> height is the limit.
    videoRenderHeight = safeH;
    videoRenderWidth = videoRenderHeight * INTRO_VIDEO_ASPECT;
  } else {
    // Screen is taller (relative) than the video -> width is the limit.
    videoRenderWidth = safeW;
    videoRenderHeight = videoRenderWidth / INTRO_VIDEO_ASPECT;
  }

  // Breathing margin so the video never touches the rounded phone corners.
  const SAFETY_MARGIN = 24;
  videoRenderWidth = Math.max(0, videoRenderWidth - SAFETY_MARGIN);
  videoRenderHeight = Math.max(0, videoRenderHeight - SAFETY_MARGIN);

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
    // Defensive safety timer: transition automatically if video never plays
    // within 8 seconds (gives the codec a moment on web).
    const safetyTimer = setTimeout(() => {
      triggerTransition();
    }, 8000);
    return () => clearTimeout(safetyTimer);
  }, []);

  // Once the player is ready, explicitly start playback. This is more
  // reliable than relying solely on `shouldPlay`, which is sometimes
  // suppressed on web until the element is visible.
  useEffect(() => {
    if (videoReady && videoRef.current) {
      videoRef.current
        .playFromPositionAsync(0)
        .catch((err) => {
          // Some platforms (older webkit) reject playFromPositionAsync
          // synchronously; fall back to plain playAsync.
          if (videoRef.current && videoRef.current.playAsync) {
            videoRef.current.playAsync().catch(() => {});
          }
        });
    }
  }, [videoReady]);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      if (!videoReady) setVideoReady(true);
      if (status.didJustFinish) {
        triggerTransition();
      }
    } else if (status.error) {
      setVideoError(status.error);
    }
  };

  return (
    <Animated.View style={[styles.splash, { opacity: fadeAnim }]}>
      <View
        style={[
          styles.videoStage,
          { width: safeW, height: safeH }
        ]}
      >
        <View
          style={[
            styles.videoBox,
            {
              width: videoRenderWidth,
              height: videoRenderHeight,
              backgroundColor: "#000000"
            }
          ]}
        >
          <Video
            ref={videoRef}
            source={INTRO_VIDEO}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isMuted
            isLooping={false}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onReadyForDisplay={() => setVideoReady(true)}
            onError={(err) => setVideoError(err)}
            useNativeControls={false}
            progressUpdateIntervalMillis={250}
            // On web, ensure the underlying <video> can autoplay muted.
            usePoster={false}
          />
        </View>
        {/* Optional: a tiny dev-only badge so we can see the state at a glance. */}
        {videoError ? (
          <View style={styles.debugBadge}>
            <Animated.Text style={styles.debugText}>
              video error: {String(videoError)}
            </Animated.Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splash: {
    backgroundColor: "#000000",
    flex: 1
  },
  videoStage: {
    alignItems: "center",
    justifyContent: "center"
  },
  videoBox: {
    overflow: "hidden",
    position: "relative"
  },
  debugBadge: {
    bottom: 16,
    left: 16,
    position: "absolute",
    right: 16
  },
  debugText: {
    color: "#ff6b6b",
    fontSize: 11,
    textAlign: "center"
  }
});
