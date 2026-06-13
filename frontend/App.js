import React, { useEffect, useMemo, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import AppShell from "./src/components/layout/AppShell";
import BottomNav from "./src/components/navigation/BottomNav";
import AssistantScreen from "./src/screens/AssistantScreen";
import CartScreen from "./src/screens/CartScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import SplashScreen from "./src/screens/SplashScreen";
import AuthEmailScreen from "./src/screens/AuthEmailScreen";
import AuthOtpScreen from "./src/screens/AuthOtpScreen";
import SearchScreen from "./src/screens/SearchScreen";
import EmergencyScreen from "./src/screens/EmergencyScreen";
import WalletScreen from "./src/screens/WalletScreen";
import TrackingScreen from "./src/screens/TrackingScreen";
import OrderAgainScreen from "./src/screens/OrderAgainScreen";
import IosKeyboard from "./src/components/common/IosKeyboard";
import IosNotification from "./src/components/common/IosNotification";
import { products } from "./src/data/products";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState("email"); // "email" or "otp"
  const [email, setEmail] = useState("");
  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Google Pay");
  const [deposit, setDeposit] = useState(1000);
  const [recentSearches, setRecentSearches] = useState(["coke", "atta", "milk"]);

  // SMS simulated state
  const [smsNotification, setSmsNotification] = useState({
    visible: false,
    title: "Amazon Now",
    body: "Your verification code is: 123456"
  });

  // Simulated keyboard state
  const [keyboard, setKeyboard] = useState({
    visible: false,
    type: "text",
    value: "",
    placeholder: "",
    onChangeText: null,
    onSubmit: null,
    suggestion: null
  });

  const focusInput = (config) => {
    setKeyboard({
      visible: true,
      type: config.type || "text",
      value: config.value || "",
      placeholder: config.placeholder || "",
      onChangeText: config.onChangeText,
      onSubmit: config.onSubmit,
      suggestion: config.suggestion || null
    });
  };

  const updateKeyboardValue = (text) => {
    setKeyboard((prev) => ({ ...prev, value: text }));
  };

  const hideKeyboard = () => {
    setKeyboard((prev) => ({ ...prev, visible: false }));
  };

  // Trigger SMS Arrival
  const triggerSms = () => {
    setSmsNotification({
      visible: true,
      title: "Amazon Now",
      body: "Your verification code is: 123456"
    });
  };

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...items, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (!existing) return items;
      if (existing.qty === 1) {
        return items.filter((item) => item.id !== product.id);
      }
      return items.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty - 1 } : item
      );
    });
  };

  const getQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.qty : 0;
  };

  const openCategory = (category) => {
    setSelectedCategory(category);
    setScreen("category");
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setScreen("product");
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  return (
    <AppShell>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.mainContainer, { paddingBottom: keyboard.visible ? 280 : 0 }]}>
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : !isAuthenticated ? (
          authStep === "email" ? (
            <AuthEmailScreen
              email={email}
              onNext={(val) => {
                setEmail(val);
                setAuthStep("otp");
              }}
              focusInput={focusInput}
              updateKeyboardValue={updateKeyboardValue}
              hideKeyboard={hideKeyboard}
            />
          ) : (
            <AuthOtpScreen
              email={email}
              onBack={() => setAuthStep("email")}
              onVerified={() => {
                setIsAuthenticated(true);
                setScreen("home");
              }}
              focusInput={focusInput}
              updateKeyboardValue={updateKeyboardValue}
              hideKeyboard={hideKeyboard}
              triggerSms={triggerSms}
            />
          )
        ) : (
          <>
            {screen === "home" && (
              <HomeScreen
                activeTab={activeTab}
                addToCart={addToCart}
                cartCount={cart.length}
                customer={{ name: "Shivi" }}
                getQuantity={getQuantity}
                openCategory={openCategory}
                openProduct={openProduct}
                removeFromCart={removeFromCart}
                searchQuery={searchQuery}
                setActiveTab={setActiveTab}
                setSearchQuery={setSearchQuery}
                setScreen={setScreen}
              />
            )}
            {screen === "category" && (
              <CategoryScreen
                addToCart={addToCart}
                category={selectedCategory}
                getQuantity={getQuantity}
                goBack={() => setScreen("home")}
                openProduct={openProduct}
                removeFromCart={removeFromCart}
              />
            )}
            {screen === "product" && (
              <ProductDetailScreen
                addToCart={addToCart}
                getQuantity={getQuantity}
                goBack={() => setScreen(selectedCategory ? "category" : "home")}
                product={selectedProduct}
                removeFromCart={removeFromCart}
                setSelectedProduct={setSelectedProduct}
              />
            )}
            {screen === "cart" && (
              <CartScreen
                cart={cart}
                goBack={() => setScreen("home")}
                onCheckout={() => setScreen("payment")}
                total={total}
              />
            )}
            {screen === "payment" && (
              <PaymentScreen
                cart={cart}
                goBack={() => setScreen("cart")}
                onPlaceOrder={() => setScreen("tracking")}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                total={total}
              />
            )}
            {screen === "assistant" && (
              <AssistantScreen
                addToCart={addToCart}
                addGeneratedCart={(items, isEmergency) => {
                  setCart((prev) => {
                    let next = [...prev];
                    items.forEach((item) => {
                      const existing = next.find((x) => x.id === item.id);
                      if (!existing) {
                        next.push({ ...item, qty: 1 });
                      }
                    });
                    return next;
                  });
                  if (isEmergency) {
                    setPaymentMethod("Emergency Deposit");
                  }
                  setScreen("cart");
                }}
                getQuantity={getQuantity}
                goBack={() => setScreen("home")}
                openProduct={openProduct}
                query={searchQuery}
                removeFromCart={removeFromCart}
                setQuery={(q) => {
                  setSearchQuery(q);
                  updateKeyboardValue(q);
                }}
                focusInput={focusInput}
                hideKeyboard={hideKeyboard}
              />
            )}
            {screen === "profile" && (
              <ProfileScreen
                customer={{ name: "Shivi" }}
                goBack={() => setScreen("home")}
                onSignOut={() => {
                  setIsAuthenticated(false);
                  setAuthStep("email");
                  setEmail("");
                  setCart([]);
                }}
              />
            )}
            {screen === "search" && (
              <SearchScreen
                addToCart={addToCart}
                getQuantity={getQuantity}
                goBack={() => setScreen("home")}
                openProduct={openProduct}
                query={searchQuery}
                recentSearches={recentSearches}
                removeFromCart={removeFromCart}
                setQuery={(q) => {
                  setSearchQuery(q);
                  updateKeyboardValue(q);
                }}
                setRecentSearches={setRecentSearches}
                focusInput={focusInput}
                hideKeyboard={hideKeyboard}
              />
            )}
            {screen === "reorder" && (
              <OrderAgainScreen
                addToCart={addToCart}
                getQuantity={getQuantity}
                openProduct={openProduct}
                removeFromCart={removeFromCart}
              />
            )}
            {screen === "emergency" && (
              <EmergencyScreen
                addToCart={addToCart}
                getQuantity={getQuantity}
                goBack={() => setScreen("home")}
                openProduct={openProduct}
                removeFromCart={removeFromCart}
                addGeneratedCart={(items, isEmergency) => {
                  setCart((prev) => {
                    let next = [...prev];
                    items.forEach((item) => {
                      const existing = next.find((x) => x.id === item.id);
                      if (!existing) {
                        next.push({ ...item, qty: 1 });
                      }
                    });
                    return next;
                  });
                  if (isEmergency) {
                    setPaymentMethod("Emergency Deposit");
                  }
                  setScreen("cart");
                }}
              />
            )}
            {screen === "wallet" && (
              <WalletScreen
                deposit={deposit}
                goBack={() => setScreen("home")}
                setDeposit={(amount) => {
                  setDeposit(amount);
                  setScreen("home");
                }}
              />
            )}
            {screen === "tracking" && (
              <TrackingScreen
                cart={cart}
                goBack={() => setScreen("home")}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                total={total}
              />
            )}
            {!["payment", "assistant", "tracking", "search"].includes(screen) ? (
              <BottomNav active={screen} cartCount={cart.length} setScreen={setScreen} />
            ) : null}
          </>
        )}
      </View>

      <IosNotification
        visible={smsNotification.visible}
        title={smsNotification.title}
        body={smsNotification.body}
        onDismiss={() => setSmsNotification((prev) => ({ ...prev, visible: false }))}
        onPress={() => {
          if (authStep === "otp" && keyboard.visible) {
            keyboard.onChangeText && keyboard.onChangeText("123456");
          }
        }}
      />

      <IosKeyboard
        visible={keyboard.visible}
        type={keyboard.type}
        value={keyboard.value}
        placeholder={keyboard.placeholder}
        onChangeText={(text) => {
          keyboard.onChangeText && keyboard.onChangeText(text);
          updateKeyboardValue(text);
        }}
        onSubmit={keyboard.onSubmit}
        suggestion={keyboard.suggestion}
        onClose={hideKeyboard}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative"
  }
});
