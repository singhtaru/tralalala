import React, { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import ProductCard from "../components/catalog/ProductCard";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { products as localProducts } from "../data/products";
import { detectIntent as localDetectIntent } from "../data/intentEngine";
import { colors } from "../theme/colors";
import { sendChatMessage, normalizeBackendProduct } from "../services/api";

const getFilteredAlternatives = (alternatives, filter) => {
  if (!filter) return alternatives;
  const f = filter.toLowerCase();
  
  if (f === "high protein") {
    return alternatives.filter(p => 
      p.name.toLowerCase().includes("protein") || 
      p.name.toLowerCase().includes("shake") ||
      p.name.toLowerCase().includes("bar") ||
      p.name.toLowerCase().includes("nuts")
    );
  }
  if (f === "healthy" || f === "low calorie") {
    return alternatives.filter(p => 
      p.category === "fruits" || 
      p.name.toLowerCase().includes("oats") ||
      p.name.toLowerCase().includes("nuts") ||
      p.name.toLowerCase().includes("granola") ||
      p.name.toLowerCase().includes("water") ||
      p.name.toLowerCase().includes("juice") ||
      p.name.toLowerCase().includes("green tea") ||
      p.name.toLowerCase().includes("spinach") ||
      p.name.toLowerCase().includes("carrot")
    );
  }
  if (f === "lactose free") {
    return alternatives.filter(p => 
      !["milk", "cheese", "paneer", "butter", "curd", "yogurt"].some(term => p.name.toLowerCase().includes(term))
    );
  }
  if (f === "organic") {
    return alternatives.filter(p => 
      p.brand.toLowerCase().includes("organic") || 
      p.name.toLowerCase().includes("organic") || 
      p.name.toLowerCase().includes("fresh")
    );
  }
  if (f === "budget friendly" || f === "low cost") {
    return alternatives.filter(p => p.price < 120);
  }
  if (f === "premium" || f === "premium quality") {
    return alternatives.filter(p => p.price >= 120 || p.brand.toLowerCase().includes("licious") || p.brand.toLowerCase().includes("muscleblaze"));
  }
  if (f === "fast delivery") {
    return alternatives.filter(p => p.deliveryMins <= 10);
  }
  if (f === "best seller") {
    return alternatives.filter(p => p.rating >= 4.7);
  }
  return alternatives;
};

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
  hideKeyboard,
  startListening,
  onStopListening,
  products
}) {
  const [messages, setMessages] = useState([
    { id: "init", sender: "alexa", text: "Hi Shivi! I'm Alexa. Tell me what you need, or say something like 'I cut my finger' or 'Order butter'." }
  ]);
  const [isAlexaTyping, setIsAlexaTyping] = useState(false);
  const scrollViewRef = useRef(null);
  
  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [waveHeights, setWaveHeights] = useState([12, 26, 40, 18, 32, 12]);
  const recognitionRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

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

  // Handle external trigger for voice assistant
  useEffect(() => {
    if (startListening) {
      startSpeechRecognition();
      if (onStopListening) {
        onStopListening();
      }
    }
  }, [startListening]);

  // Pulse animation for mic wave lines when listening
  useEffect(() => {
    let interval;
    if (isListening) {
      interval = setInterval(() => {
        setWaveHeights([
          Math.floor(Math.random() * 30) + 8,
          Math.floor(Math.random() * 35) + 12,
          Math.floor(Math.random() * 45) + 15,
          Math.floor(Math.random() * 35) + 10,
          Math.floor(Math.random() * 40) + 12,
          Math.floor(Math.random() * 30) + 8
        ]);
      }, 100);
    } else {
      setWaveHeights([12, 26, 40, 18, 32, 12]);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Graceful fallback if Speech API is not supported in the environment
      const errMsgId = "alexa_err_" + Date.now();
      setMessages((prev) => [...prev, {
        id: errMsgId,
        sender: "alexa",
        text: "Voice speech recognition is not supported in your browser/device. Please try typing your request."
      }]);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = "en-US";
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const speechText = event.results[0][0].transcript;
        if (speechText && speechText.trim()) {
          setQuery(speechText);
          handleSend(speechText);
        }
      };

      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }
    setIsListening(false);
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;

    setSelectedFilter(null);

    // Add user message
    const userMsgId = "user_" + Date.now();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }]);
    setQuery("");
    queryRef.current = "";

    // Trigger typing simulation
    setIsAlexaTyping(true);

    // Call backend API
    const response = await sendChatMessage(text);

    if (response) {
      // Map recommended products returned from the backend
      const normalizedItems = (response.recommended_items || []).map(p =>
        normalizeBackendProduct(p, localProducts)
      );

      const isEmergency = response.intent && (
        response.intent.occasion === "first aid emergency" ||
        response.intent.occasion === "injury" ||
        response.intent.category === "first_aid" ||
        response.intent.category === "baby" ||
        response.intent.category === "emergency"
      );

      const alexaResponse = {
        id: "alexa_" + Date.now(),
        sender: "alexa",
        text: response.message || `Found products matching your request.`,
        intentCart: normalizedItems.length > 0 ? normalizedItems : null,
        isEmergency: !!isEmergency,
        refinementFilters: response.refinement_filters || []
      };
      setMessages((prev) => [...prev, alexaResponse]);
    } else {
      // Graceful local fallback simulation if backend is offline/fails
      const intent = localDetectIntent(text);
      let alexaResponse = {
        id: "alexa_" + Date.now(),
        sender: "alexa",
        text: "I cut my finger? Suggest snacks for guests? I'm having difficulty connecting to my servers right now. Here is a simulated view.",
        refinementFilters: []
      };

      if (intent) {
        if (intent.id === "injury") {
          alexaResponse.text = "[Offline Mode] I detected a first-aid emergency and compiled an instant care cart. Would you like me to place the order?";
          alexaResponse.intentCart = intent.products;
          alexaResponse.isEmergency = true;
          alexaResponse.refinementFilters = ["Fast Delivery", "Best Seller", "Budget Friendly"];
        } else if (intent.id === "fever") {
          alexaResponse.text = "[Offline Mode] I've assembled a fever-care recovery pack for you. Shall we order it?";
          alexaResponse.intentCart = intent.products;
          alexaResponse.isEmergency = true;
          alexaResponse.refinementFilters = ["Fast Delivery", "Best Seller"];
        } else if (intent.id === "baby") {
          alexaResponse.text = "[Offline Mode] Baby emergency detected. I've prepared wipes and diaper packs. Confirm to order immediately.";
          alexaResponse.intentCart = intent.products;
          alexaResponse.isEmergency = true;
          alexaResponse.refinementFilters = ["Budget Friendly", "Best Seller"];
        } else if (intent.id === "power") {
          alexaResponse.text = "[Offline Mode] Power outage detected. I've loaded rechargeable lights, noodles, and water. Order now?";
          alexaResponse.intentCart = intent.products;
          alexaResponse.isEmergency = true;
          alexaResponse.refinementFilters = ["Fast Delivery", "Budget Friendly"];
        } else if (intent.id === "guests") {
          alexaResponse.text = "[Offline Mode] Got it, unexpected guests arrived! I've loaded popular chips, chocolates, and cold beverages. Let's checkout?";
          alexaResponse.intentCart = intent.products;
          alexaResponse.refinementFilters = ["Healthy", "Low Calorie", "High Protein", "Budget Friendly", "Premium"];
        } else if (intent.id === "breakfast") {
          alexaResponse.text = "[Offline Mode] I've compiled a quick breakfast cart including milk, eggs, bread, butter, and bananas. Shall we confirm?";
          alexaResponse.intentCart = intent.products;
          alexaResponse.refinementFilters = ["Lactose Free", "High Protein", "Organic", "Budget Friendly"];
        } else if (intent.id === "butter") {
          const butterProduct = intent.products[0];
          alexaResponse.text = `[Offline Mode] I selected the top-rated ${butterProduct.name} with fast ${butterProduct.deliveryMins}-minute delivery. Shall I place the order?`;
          alexaResponse.intentCart = [butterProduct];
          alexaResponse.refinementFilters = ["Premium Quality", "Budget Friendly", "Best Seller", "Fast Delivery", "Organic"];
        }
      } else {
        alexaResponse.text = "I'm not sure how to assist with that. Please type your query, or try saying 'I cut my finger' or 'Order butter'.";
      }
      setMessages((prev) => [...prev, alexaResponse]);
    }
    setIsAlexaTyping(false);
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
              {msg.intentCart && msg.intentCart.length > 0 && (
                <View style={styles.chatCartContainer}>
                  <Text style={styles.aiLabel}>
                    <Ionicons name="sparkles" size={11} color="#00a8e1" /> AI RECOMMENDED
                  </Text>
                  
                  {/* Top Pick Product Card */}
                  {(() => {
                    const topPick = msg.intentCart[0];
                    return (
                      <View style={styles.topPickContainer}>
                        <View style={styles.topPickBadge}>
                          <Text style={styles.topPickText}>TOP PICK</Text>
                        </View>
                        <Text style={styles.chatProdName}>{topPick.name}</Text>
                        <Text style={styles.chatProdPrice}>₹{topPick.price}</Text>
                        <Text style={styles.chatProdMeta}>★{topPick.rating || "4.8"} | {topPick.deliveryMins || "10"} mins | {topPick.brand || "Amazon"}</Text>
                        
                        <Pressable onPress={() => addToCart(topPick)} style={styles.chatAddBtn}>
                          <Text style={styles.chatAddText}>+ Add to Cart</Text>
                        </Pressable>
                      </View>
                    );
                  })()}

                  {/* Refinement Filters */}
                  {msg.refinementFilters && msg.refinementFilters.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                      {msg.refinementFilters.map((filter) => {
                        const isActive = selectedFilter === filter;
                        return (
                          <Pressable 
                            key={filter} 
                            onPress={() => setSelectedFilter(isActive ? null : filter)}
                            style={[styles.filterChip, isActive && styles.filterChipActive]}
                          >
                            <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                              {filter}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  )}

                  {/* Alternative Products */}
                  {msg.intentCart.length > 1 && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.alternativesHeader}>Alternative Options</Text>
                      {(() => {
                        const filteredAlternatives = getFilteredAlternatives(msg.intentCart.slice(1), selectedFilter);
                        if (filteredAlternatives.length === 0) {
                          return <Text style={{ color: "#9ca3af", fontSize: 10, marginVertical: 8 }}>No alternatives match this filter.</Text>;
                        }
                        return (
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chatProductsScroll}>
                            {filteredAlternatives.map((product) => (
                              <View key={product.id} style={styles.chatProductCard}>
                                <Text numberOfLines={1} style={styles.chatProdName}>{product.name}</Text>
                                <Text style={styles.chatProdPrice}>₹{product.price}</Text>
                                <Text style={styles.chatProdMeta}>★{product.rating || "4.8"} | {product.deliveryMins || "10"} mins</Text>
                                
                                <Pressable onPress={() => addToCart(product)} style={styles.chatAddBtn}>
                                  <Text style={styles.chatAddText}>+ Add</Text>
                                </Pressable>
                              </View>
                            ))}
                          </ScrollView>
                        );
                      })()}
                    </View>
                  )}

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
      <Pressable
        onPress={isListening ? stopSpeechRecognition : startSpeechRecognition}
        style={styles.visualizerBlock}
      >
        <View style={[styles.waveRingOuter, isListening && styles.waveRingOuterActive]}>
          <View style={styles.waveRingInner}>
            <View style={styles.waveLines}>
              <View style={[styles.waveLine, { height: waveHeights[0] }]} />
              <View style={[styles.waveLine, { height: waveHeights[1] }]} />
              <View style={[styles.waveLine, { height: waveHeights[2] }]} />
              <View style={[styles.waveLine, { height: waveHeights[3] }]} />
              <View style={[styles.waveLine, { height: waveHeights[4] }]} />
              <View style={[styles.waveLine, { height: waveHeights[5] }]} />
            </View>
          </View>
        </View>
        {isListening && <Text style={styles.listeningText}>Alexa is listening...</Text>}
      </Pressable>

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
    height: 100,
    justifyContent: "center",
    paddingVertical: 10
  },
  waveRingOuter: {
    alignItems: "center",
    backgroundColor: "rgba(0, 168, 225, 0.15)",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60
  },
  waveRingOuterActive: {
    backgroundColor: "rgba(0, 168, 225, 0.4)",
    shadowColor: "#00a8e1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10
  },
  listeningText: {
    color: "#00a8e1",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  chatProductCardActive: {
    borderColor: "#ff9900",
    borderWidth: 1.5,
    backgroundColor: "#273142"
  },
  topPickBadge: {
    backgroundColor: "#ff9900",
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignSelf: "flex-start",
    marginBottom: 4
  },
  topPickText: {
    color: "#111827",
    fontSize: 8,
    fontWeight: "900"
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
  },
  filterContainer: {
    flexDirection: "row",
    gap: 6,
    marginVertical: 10
  },
  filterChip: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6
  },
  filterChipActive: {
    backgroundColor: "#00a8e1",
    borderColor: "#00a8e1"
  },
  filterChipText: {
    color: "#9ca3af",
    fontSize: 10,
    fontWeight: "700"
  },
  filterChipTextActive: {
    color: "#ffffff",
    fontWeight: "800"
  },
  topPickContainer: {
    backgroundColor: "#273142",
    borderColor: "#ff9900",
    borderRadius: 10,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 8,
    position: "relative"
  },
  alternativesHeader: {
    color: "#9ca3af",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5
  }
});
