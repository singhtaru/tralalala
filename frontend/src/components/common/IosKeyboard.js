import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const keysLayout = {
  lowercase: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["shift", "z", "x", "c", "v", "b", "n", "m", "backspace"],
    ["123", "@", "space", ".", "return"]
  ],
  uppercase: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["shift-active", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
    ["123", "@", "space", ".", "return"]
  ],
  numbers: [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["-", "/", ":", ";", "(", ")", "$", "&", "@", "\""],
    ["#+=", ".", ",", "?", "!", "'", "backspace"],
    ["ABC", "space", "return"]
  ],
  symbols: [
    ["[", "]", "{", "}", "#", "%", "^", "*", "+", "="],
    ["_", "\\", "|", "~", "<", ">", "€", "£", "¥", "•"],
    ["123", ".", ",", "?", "!", "'", "backspace"],
    ["ABC", "space", "return"]
  ]
};

const phoneLetters = {
  "2": "A B C",
  "3": "D E F",
  "4": "G H I",
  "5": "J K L",
  "6": "M N O",
  "7": "P Q R S",
  "8": "T U V",
  "9": "W X Y Z"
};

export default function IosKeyboard({
  visible,
  type = "text",
  value = "",
  placeholder = "",
  onChangeText,
  onSubmit,
  suggestion,
  onClose
}) {
  const [layout, setLayout] = useState("lowercase");
  const slideAnim = useRef(new Animated.Value(340)).current; // starts offscreen

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 340,
      tension: 50,
      friction: 9,
      useNativeDriver: true
    }).start();
  }, [visible]);

  if (!visible && slideAnim._value === 340) {
    return null;
  }

  const handleKeyPress = (key) => {
    if (!onChangeText) return;

    if (key === "backspace") {
      onChangeText(value.slice(0, -1));
    } else if (key === "space") {
      onChangeText(value + " ");
    } else if (key === "shift") {
      setLayout("uppercase");
    } else if (key === "shift-active") {
      setLayout("lowercase");
    } else if (key === "123") {
      setLayout("numbers");
    } else if (key === "ABC") {
      setLayout("lowercase");
    } else if (key === "#+=") {
      setLayout("symbols");
    } else if (key === "return") {
      if (onSubmit) onSubmit();
      if (onClose) onClose();
    } else {
      onChangeText(value + key);
      // Auto-revert shift after typing one uppercase letter
      if (layout === "uppercase") {
        setLayout("lowercase");
      }
    }
  };

  const handleAutoFill = () => {
    if (suggestion && onChangeText) {
      onChangeText(suggestion);
    }
  };

  const renderKey = (key, rowIndex) => {
    let keyStyle = styles.key;
    let label = key;
    let isSpecial = false;

    if (key === "shift" || key === "shift-active") {
      keyStyle = [styles.key, styles.shiftKey];
      isSpecial = true;
      const shiftColor = key === "shift-active" ? "#000000" : "#4b5563";
      label = <Ionicons name={key === "shift-active" ? "arrow-up" : "arrow-up-outline"} size={19} color={shiftColor} />;
    } else if (key === "backspace") {
      keyStyle = [styles.key, styles.backspaceKey];
      isSpecial = true;
      label = <Ionicons name="backspace-outline" size={20} color="#000000" />;
    } else if (key === "space") {
      keyStyle = [styles.key, styles.spaceKey];
      label = "space";
    } else if (key === "return") {
      keyStyle = [styles.key, styles.returnKey];
      isSpecial = true;
      label = "return";
    } else if (["123", "ABC", "#+="].includes(key)) {
      keyStyle = [styles.key, styles.switcherKey];
      isSpecial = true;
    }

    return (
      <Pressable
        key={key + "-" + rowIndex}
        onPress={() => handleKeyPress(key)}
        style={({ pressed }) => [
          keyStyle,
          pressed && styles.keyPressed,
          isSpecial && styles.specialKeyBg
        ]}
      >
        {typeof label === "string" ? (
          <Text style={[styles.keyText, isSpecial && styles.specialKeyText]}>
            {label}
          </Text>
        ) : (
          label
        )}
      </Pressable>
    );
  };

  const renderQWERTY = () => {
    const currentKeys = keysLayout[layout] || keysLayout.lowercase;
    return (
      <View style={styles.qwertyContainer}>
        {currentKeys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyboardRow}>
            {row.map((key) => renderKey(key, rowIndex))}
          </View>
        ))}
      </View>
    );
  };

  const renderPasscodePad = () => {
    const numbers = [
      "1", "2", "3",
      "4", "5", "6",
      "7", "8", "9",
      "", "0", "backspace"
    ];

    return (
      <View style={styles.passcodeContainer}>
        <View style={styles.passcodeGrid}>
          {numbers.map((key, index) => {
            if (key === "") {
              return <View key={`empty-${index}`} style={styles.passcodeKeyEmpty} />;
            }
            if (key === "backspace") {
              return (
                <Pressable
                  key="backspace-passcode"
                  onPress={() => handleKeyPress("backspace")}
                  style={({ pressed }) => [
                    styles.passcodeKeyEmpty,
                    pressed && styles.passcodeKeyTextPressed
                  ]}
                >
                  <Ionicons name="backspace-outline" size={24} color="#000000" />
                </Pressable>
              );
            }
            return (
              <Pressable
                key={key}
                onPress={() => handleKeyPress(key)}
                style={({ pressed }) => [
                  styles.passcodeKey,
                  pressed && styles.passcodeKeyPressed
                ]}
              >
                <Text style={styles.passcodeNumText}>{key}</Text>
                {phoneLetters[key] ? (
                  <Text style={styles.passcodeLetterText}>{phoneLetters[key]}</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      {/* AutoFill Suggestion Bar */}
      {suggestion ? (
        <Pressable onPress={handleAutoFill} style={styles.autofillBar}>
          <Ionicons name="key-outline" size={17} color="#000000" style={{ marginRight: 6 }} />
          <Text style={styles.autofillText}>From Messages: </Text>
          <Text style={[styles.autofillText, { fontWeight: "900" }]}>{suggestion}</Text>
        </Pressable>
      ) : null}

      {/* Keyboard Body */}
      <View style={styles.keyboardBody}>
        {type === "numeric" ? renderPasscodePad() : renderQWERTY()}
        {/* iOS Home Indicator Bar space */}
        <View style={styles.homeIndicatorSpace} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#cfd3da",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    zIndex: 999
  },
  autofillBar: {
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    borderBottomColor: "#b2b6bd",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  autofillText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700"
  },
  keyboardBody: {
    paddingBottom: 8,
    paddingHorizontal: 4,
    paddingTop: 8
  },
  qwertyContainer: {
    alignItems: "center",
    width: "100%"
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%"
  },
  key: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    elevation: 1,
    flex: 1,
    height: 42,
    justifyContent: "center",
    marginHorizontal: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 0
  },
  keyPressed: {
    backgroundColor: "#adb3bc"
  },
  keyText: {
    color: "#000000",
    fontSize: 19,
    fontWeight: "500"
  },
  specialKeyBg: {
    backgroundColor: "#abb1b9"
  },
  specialKeyText: {
    fontSize: 15,
    fontWeight: "700"
  },
  shiftKey: {
    flex: 1.25,
    marginRight: 6
  },
  backspaceKey: {
    flex: 1.25,
    marginLeft: 6
  },
  spaceKey: {
    flex: 4.5
  },
  returnKey: {
    backgroundColor: "#abb1b9",
    flex: 2
  },
  switcherKey: {
    flex: 1.5
  },
  passcodeContainer: {
    alignItems: "center",
    paddingVertical: 12,
    width: "100%"
  },
  passcodeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 320
  },
  passcodeKey: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 36,
    height: 70,
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    width: 70
  },
  passcodeKeyPressed: {
    backgroundColor: "#adb3bc"
  },
  passcodeKeyEmpty: {
    alignItems: "center",
    height: 70,
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 12,
    width: 70
  },
  passcodeKeyTextPressed: {
    opacity: 0.5
  },
  passcodeNumText: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "400",
    lineHeight: 32
  },
  passcodeLetterText: {
    color: "#000000",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: -2
  },
  homeIndicatorSpace: {
    height: 20
  }
});
