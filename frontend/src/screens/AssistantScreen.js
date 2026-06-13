import React, { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import ProductCard from "../components/catalog/ProductCard";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { products } from "../data/products";
import { detectIntent } from "../data/intentEngine";
import { colors } from "../theme/colors";

export default function AssistantScreen({
  addToCart,
  addGeneratedCart,
  getQuantity,
  goBack,
  openProduct,
  query,
  removeFromCart,
  setQuery,
  focusInput,
  hideKeyboard
}) {
  const [messages, setMessages] = useState([
    { id: "init", sender: "alexa", text: "Hi Shivi! I'm Alexa. Tell me what you need, or say something like 'I cut my finger' or 'Order butter'." }
  ]);
  const [isAlexaTyping, setIsAlexaTyping] = useState(false);
  const scrollViewRef = useRef(null);

  const queryRef = useRef(query);
  queryRef.current = query;

  const triggerFocus = () => {
    focusInput({
      type: "text",
      value: queryRef.current,
      placeholder: "Ask Alexa...",
      onChangeText: (text) => {
        setQuery(text);
        queryRef.current = text;
      },
      onSubmit: () => {
        handleSend(queryRef.current);
        hideKeyboard();
      }
    });
  };

  // If a query is pre-passed on mount (e.g. from voice examples)
  useEffect(() => {
    if (query) {
      handleSend(query);
    }
  }, []);

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsgId = "user_" + Date.now();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }]);
    setQuery("");
    queryRef.current = "";

    // Trigger typing simulation
    setIsAlexaTyping(true);

    setTimeout(() => {
      const intent = detectIntent(text);
      let alexaResponse = {
        id: "alexa_" + Date.now(),
        sender: "alexa",
        text: "I'm not sure how to assist with that yet, but I can search the store for you. Try 'I cut my finger' or 'Order butter'."
      };

      if (intent) {
        if (intent.id === "injury") {
          alexaResponse.text = "I detected a first-aid emergency and compiled an instant care cart. Would you like me to place the order?";
          alexaResponse.intentCart = intent.products;
          alexaResponse.isEmergency = true;
        } else if (intent.id === "fever") {
          alexaResponse.text = "I've assembled a fever-care recovery pack for you. Shall we order it?";
          alexaResponse.intentCart = intent.products;
          alexaResponse.isEmergency = true;
        } else if (intent.id === "baby") {
          alexaResponse.text = "Baby emergency detected. I've prepared wipes and diaper packs. Confirm to order immediately.";
          alexaResponse.intentCart = intent.products;
          alexaResponse.isEmergency = true;
        } else if (intent.id === "power") {
          alexaResponse.text = "Power outage detected. I've loaded rechargeable lights, noodles, and water. Order now?";
          alexaResponse.intentCart = intent.products;
          alexaResponse.isEmergency = true;
        } else if (intent.id === "guests") {
          alexaResponse.text = "Got it, unexpected guests arrived! I've loaded popular chips, chocolates, and cold beverages. Let's checkout?";
          alexaResponse.intentCart = intent.products;
        } else if (intent.id === "breakfast") {
          alexaResponse.text = "I've compiled a quick breakfast cart including milk, eggs, bread, butter, and bananas. Shall we confirm?";
          alexaResponse.intentCart = intent.products;
        } else if (intent.id === "butter") {
          // Select highest-rated butter and rank it
          const butterProduct = intent.products[0];
          alexaResponse.text = `I selected the top-rated ${butterProduct.name} with fast ${butterProduct.deliveryMins}-minute delivery. Shall I place the order?`;
          alexaResponse.intentCart = [butterProduct];
        }
      }

      setMessages((prev) => [...prev, alexaResponse]);
      setIsAlexaTyping(false);
    }, 1500);
  };

  const handleConfirmOrder = (cartItems, isEmergency) => {
    // Adds generated cart and navigates directly to checkout payment
    addGeneratedCart(cartItems, isEmergency);
  };

  return (
    <View style={styles.screen}>
      {/* Alexa Top Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#00a8e1" />
        </Pressable>
        <View style={styles.alexaHeaderTitleRow}>
          <View style={styles.alexaDot} />
          <Text style={styles.alexaHeaderTitle}>Alexa voice ordering</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* Chat Messages Log */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.sender === "user" ? styles.userRow : styles.alexaRow
            ]}
          >
            {msg.sender === "alexa" && (
              <View style={styles.alexaAvatar}>
                <Ionicons name="mic-circle" size={20} color="#ffffff" />
              </View>
            )}
            
            <View style={styles.bubbleContainer}>
              <View
                style={[
                  styles.bubble,
                  msg.sender === "user" ? styles.userBubble : styles.alexaBubble
                ]}
              >
                <Text style={msg.sender === "user" ? styles.userText : styles.alexaText}>
                  {msg.text}
                </Text>
              </View>

              {/* Render Recommended Products inside the Chat! */}
              {msg.intentCart && (
                <View style={styles.chatCartContainer}>
                  <Text style={styles.aiLabel}>
                    <Ionicons name="sparkles" size={11} color="#00a8e1" /> AI RECOMMENDED
                  </Text>
                  
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chatProductsScroll}>
                    {msg.intentCart.map((product) => (
                      <View key={product.id} style={styles.chatProductCard}>
                        <Text numberOfLines={1} style={styles.chatProdName}>{product.name}</Text>
                        <Text style={styles.chatProdPrice}>₹{product.price}</Text>
                        <Text style={styles.chatProdMeta}>★{product.rating} | {product.deliveryMins} mins</Text>
                        
                        <Pressable onPress={() => addToCart(product)} style={styles.chatAddBtn}>
                          <Text style={styles.chatAddText}>+ Add</Text>
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>

                  {/* Intent Buttons */}
                  <View style={styles.intentActions}>
                    <Pressable
                      onPress={() => handleConfirmOrder(msg.intentCart, msg.isEmergency)}
                      style={styles.confirmBtn}
                    >
                      <Text style={styles.confirmBtnText}>Confirm Order</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        msg.intentCart.forEach(item => addToCart(item));
                        handleConfirmOrder(msg.intentCart, msg.isEmergency);
                      }}
                      style={styles.editBtn}
                    >
                      <Text style={styles.editBtnText}>Edit Cart</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}

        {isAlexaTyping && (
          <View style={[styles.messageRow, styles.alexaRow]}>
            <View style={styles.alexaAvatar}>
              <Ionicons name="mic-circle" size={20} color="#ffffff" />
            </View>
            <View style={[styles.bubble, styles.alexaBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color="#00a8e1" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Voice Wave Visualizer Block */}
      <View style={styles.visualizerBlock}>
        <View style={styles.waveRingOuter}>
          <View style={styles.waveRingInner}>
            <View style={styles.waveLines}>
              <View style={[styles.waveLine, { height: 12 }]} />
              <View style={[styles.waveLine, { height: 26 }]} />
              <View style={[styles.waveLine, { height: 40 }]} />
              <View style={[styles.waveLine, { height: 18 }]} />
              <View style={[styles.waveLine, { height: 32 }]} />
              <View style={[styles.waveLine, { height: 12 }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Typing Row at bottom */}
      <View style={styles.inputRow}>
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            queryRef.current = text;
          }}
          onFocus={triggerFocus}
          placeholder="Ask Alexa..."
          placeholderTextColor="#9ca3af"
          showSoftInputOnFocus={false}
          style={styles.input}
        />
        <Pressable onPress={() => handleSend(query)} style={styles.sendButton}>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#131921",
    flex: 1
  },
  header: {
    alignItems: "center",
    backgroundColor: "#0f141d",
    borderBottomColor: "#1f293d",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  backBtn: {
    padding: 4
  },
  alexaHeaderTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  alexaDot: {
    backgroundColor: "#00a8e1",
    borderRadius: 4,
    height: 8,
    width: 8,
    shadowColor: "#00a8e1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4
  },
  alexaHeaderTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  chatContent: {
    padding: 16,
    paddingBottom: 20
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
    width: "100%"
  },
  userRow: {
    justifyContent: "flex-end"
  },
  alexaRow: {
    justifyContent: "flex-start"
  },
  alexaAvatar: {
    alignItems: "center",
    backgroundColor: "#00a8e1",
    borderRadius: 15,
    height: 30,
    justifyContent: "center",
    marginRight: 8,
    marginTop: 4,
    width: 30,
    shadowColor: "#00a8e1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3
  },
  bubbleContainer: {
    maxWidth: "80%"
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  userBubble: {
    backgroundColor: "#007aff",
    borderBottomRightRadius: 2
  },
  alexaBubble: {
    backgroundColor: "#1f2937",
    borderBottomLeftRadius: 2
  },
  typingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 18
  },
  userText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700"
  },
  alexaText: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19
  },
  chatCartContainer: {
    backgroundColor: "#111827",
    borderColor: "#1f293d",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    padding: 12,
    width: 260
  },
  aiLabel: {
    color: "#00a8e1",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 8
  },
  chatProductsScroll: {
    flexDirection: "row",
    marginBottom: 10
  },
  chatProductCard: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    marginRight: 10,
    padding: 8,
    width: 110
  },
  chatProdName: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800"
  },
  chatProdPrice: {
    color: "#ff9900",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2
  },
  chatProdMeta: {
    color: "#9ca3af",
    fontSize: 9,
    marginTop: 2
  },
  chatAddBtn: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "#ff9900",
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 6,
    paddingVertical: 4
  },
  chatAddText: {
    color: "#ff9900",
    fontSize: 10,
    fontWeight: "800"
  },
  intentActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4
  },
  confirmBtn: {
    alignItems: "center",
    backgroundColor: "#ff9900",
    borderRadius: 6,
    flex: 1,
    paddingVertical: 10
  },
  confirmBtnText: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "800"
  },
  editBtn: {
    alignItems: "center",
    backgroundColor: "#374151",
    borderRadius: 6,
    flex: 1,
    paddingVertical: 10
  },
  editBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800"
  },
  visualizerBlock: {
    alignItems: "center",
    backgroundColor: "#0f141d",
    height: 80,
    justifyContent: "center"
  },
  waveRingOuter: {
    alignItems: "center",
    backgroundColor: "rgba(0, 168, 225, 0.15)",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60
  },
  waveRingInner: {
    alignItems: "center",
    backgroundColor: "#131921",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  waveLines: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4
  },
  waveLine: {
    backgroundColor: "#00a8e1",
    borderRadius: 2,
    width: 3
  },
  inputRow: {
    alignItems: "center",
    backgroundColor: "#0f141d",
    borderTopColor: "#1f293d",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 12
  },
  input: {
    backgroundColor: "#1f2937",
    borderRadius: 20,
    color: "#ffffff",
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    outlineStyle: "none"
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: "#00a8e1",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40
  }
});
