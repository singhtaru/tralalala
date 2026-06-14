import React from "react";
import { Platform, SafeAreaView, StyleSheet, View, useWindowDimensions } from "react-native";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";

// Phone-frame aspect ratio is locked at 9:16 (portrait), matching the
// dimensions the rest of the app was designed against (393 x 852 logical px).
// We expose the height-of-the-screen-from-styles as a unit so the inner
// screen can scale together with the outer frame.
const PHONE_ASPECT = 9 / 16; // width / height
const PHONE_PADDING = 10; // web-only inner padding inside the phone bezel
const STAGE_PADDING = 18; // web-only padding around the phone
const IS_WEB = Platform.OS === "web";

// Design reference size: 393 x 852 (logical). The phone scales relative
// to this on web so the visual size shrinks on short/narrow viewports.
const REFERENCE_HEIGHT = 852;

export default function AppShell({ children }) {
  // Authoritative viewport from react-native; works on web and native.
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // On native, the app is full-bleed; only compute a derived size on web
  // where we draw a phone bezel inside a desktop background.
  let phoneWidth = "100%";
  let phoneHeight = "100%";
  let phoneBorderRadius = 0;
  let phonePadding = 0;
  let screenBorderRadius = 0;
  let stagePadding = 0;
  let showSpeaker = false;

  if (IS_WEB) {
    stagePadding = STAGE_PADDING;
    phonePadding = PHONE_PADDING;
    phoneBorderRadius = 46;
    screenBorderRadius = 34;
    showSpeaker = true;

    // Available area inside the stage once we account for padding and the
    // phone's own inner padding (the bezel).
    const availableW = Math.max(0, windowWidth - 2 * (STAGE_PADDING + PHONE_PADDING));
    const availableH = Math.max(0, windowHeight - 2 * (STAGE_PADDING + PHONE_PADDING));

    // We want to fit a 9:16 rectangle inside (availableW x availableH) and
    // also never exceed the original 393x852 design size. This keeps the
    // phone at a sensible size on tall windows, but shrinks on short ones.
    let targetH = availableH;
    let targetW = targetH * PHONE_ASPECT;
    if (targetW > availableW) {
      targetW = availableW;
      targetH = targetW / PHONE_ASPECT;
    }

    // Cap at the original design size for a comfortable visual.
    const maxH = REFERENCE_HEIGHT;
    const maxW = maxH * PHONE_ASPECT;
    if (targetH > maxH) {
      targetH = maxH;
      targetW = maxW;
    }

    // Clamp to a minimum size so the UI never collapses below usability.
    const minH = 360;
    const minW = minH * PHONE_ASPECT;
    if (targetH < minH) {
      targetH = minH;
      targetW = minW;
    }

    phoneWidth = `${targetW}px`;
    phoneHeight = `${targetH}px`;
  }

  return (
    <View
      style={[
        styles.desktopStage,
        IS_WEB && {
          padding: stagePadding
        }
      ]}
    >
      <View
        style={[
          styles.phoneFrame,
          IS_WEB && {
            width: phoneWidth,
            height: phoneHeight,
            borderRadius: phoneBorderRadius,
            padding: phonePadding
          }
        ]}
      >
        {showSpeaker ? <View style={styles.speaker} /> : null}
        <SafeAreaView
          style={[
            styles.phoneScreen,
            IS_WEB && { borderRadius: screenBorderRadius }
          ]}
        >
          {children}
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopStage: {
    alignItems: "center",
    backgroundColor: colors.desktopBackground,
    flex: 1,
    justifyContent: "center"
  },
  phoneFrame: {
    ...shadows.phone,
    backgroundColor: "#050607",
    overflow: "hidden"
  },
  speaker: {
    alignSelf: "center",
    backgroundColor: "#1b1f24",
    borderRadius: 4,
    height: 5,
    marginBottom: 8,
    width: 72
  },
  phoneScreen: {
    backgroundColor: colors.appBackground,
    flex: 1,
    overflow: "hidden"
  }
});
