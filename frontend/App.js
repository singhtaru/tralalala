import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "react-native";
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
import { products } from "./src/data/products";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Google Pay");

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 10000);
    return () => clearTimeout(timer);
  }, []);

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
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          {screen === "home" && (
            <HomeScreen
              activeTab={activeTab}
              addToCart={addToCart}
              cartCount={cart.length}
              openCategory={openCategory}
              openProduct={openProduct}
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
              goBack={() => setScreen("home")}
              openProduct={openProduct}
            />
          )}
          {screen === "product" && (
            <ProductDetailScreen
              addToCart={addToCart}
              goBack={() => setScreen(selectedCategory ? "category" : "home")}
              product={selectedProduct}
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
              goBack={() => setScreen("cart")}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              total={total}
            />
          )}
          {screen === "assistant" && (
            <AssistantScreen
              addToCart={addToCart}
              goBack={() => setScreen("home")}
              openProduct={openProduct}
              query={searchQuery}
              setQuery={setSearchQuery}
            />
          )}
          {screen === "profile" && <ProfileScreen goBack={() => setScreen("home")} />}
          {!["payment", "assistant"].includes(screen) ? (
            <BottomNav active={screen} cartCount={cart.length} setScreen={setScreen} />
          ) : null}
        </>
      )}
    </AppShell>
  );
}
