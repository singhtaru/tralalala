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
import OnboardingScreen from "./src/screens/OnboardingScreen";
import UserSetupScreen from "./src/screens/UserSetupScreen";
import AddressFormScreen from "./src/screens/AddressFormScreen";
import ManageAddressesScreen from "./src/screens/ManageAddressesScreen";
import AddFundsScreen from "./src/screens/AddFundsScreen";
import GooglePayScreen from "./src/screens/GooglePayScreen";
import IosKeyboard from "./src/components/common/IosKeyboard";
import IosNotification from "./src/components/common/IosNotification";
import { products as localProducts } from "./src/data/products";
import {
  fetchProducts,
  fetchCart,
  addToBackendCart,
  removeFromBackendCart,
  clearBackendCart,
  checkoutBackendCart,
  normalizeBackendProduct
} from "./src/services/api";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState("email"); // "email" or "otp"
  const [email, setEmail] = useState("");
  
  // Profile Setup states
  const [customer, setCustomer] = useState(null); // setup on UserSetupScreen
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressToEdit, setAddressToEdit] = useState(null);

  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState(localProducts);
  const [selectedProduct, setSelectedProduct] = useState(localProducts[0]);
  const [cart, setCart] = useState([]);
  const [assistantStartListening, setAssistantStartListening] = useState(false);

  const triggerVoiceAssistant = () => {
    setAssistantStartListening(true);
    setScreen("assistant");
  };
  
  // Wallet Balances
  const [walletBalance, setWalletBalance] = useState(700);
  const [emergencyDeposit, setEmergencyDeposit] = useState(0); // Active only after onboarding payment success
  const [paymentMethod, setPaymentMethod] = useState("Google Pay");
  const [recentSearches, setRecentSearches] = useState(["coke", "atta", "milk"]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [checkoutDeficit, setCheckoutDeficit] = useState(0);

  // Google Pay specific states
  const [gpayAmount, setGpayAmount] = useState(0);
  const [gpayFlow, setGpayFlow] = useState("recharge"); // "recharge", "onboarding", "checkout"
  const [tempOnboardingData, setTempOnboardingData] = useState(null);

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

  // Trigger visual notification popup
  const triggerNotification = (title, body) => {
    setSmsNotification({
      visible: true,
      title: title,
      body: body
    });
  };

  useEffect(() => {
    async function loadCatalog() {
      const backendProds = await fetchProducts();
      if (backendProds && backendProds.length > 0) {
        const normalized = backendProds.map(p => normalizeBackendProduct(p, localProducts));
        setProducts(normalized);
      }
    }
    loadCatalog();
  }, []);

  useEffect(() => {
    async function loadCart() {
      const backendCart = await fetchCart();
      if (backendCart && backendCart.items) {
        const mappedItems = backendCart.items.map(item => {
          const norm = normalizeBackendProduct(item, localProducts);
          return {
            ...norm,
            qty: item.quantity || 1
          };
        });
        setCart(mappedItems);
      }
    }
    loadCart();
  }, [products]);

  const addToCart = async (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...items, { ...product, qty: 1 }];
    });
    await addToBackendCart(product.id);
  };

  const removeFromCart = async (product) => {
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
    await removeFromBackendCart(product.id);
  };

  const changeQuantity = (item, delta) => {
    if (delta > 0) {
      addToCart(item);
    } else {
      removeFromCart(item);
    }
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

  const handleAddGeneratedCart = async (items, isEmergency) => {
    try {
      await clearBackendCart();
      for (const item of items) {
        const qty = item.quantity || 1;
        for (let i = 0; i < qty; i++) {
          await addToBackendCart(item.id);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setCart(items.map(item => ({ ...item, qty: item.quantity || 1 })));
    if (isEmergency) {
      setPaymentMethod("Emergency Deposit");
    } else {
      setPaymentMethod("Amazon Wallet");
    }
    setScreen("payment");
  };

  const handlePlaceOrder = async (method) => {
    const grandTotal = Math.max(0, total + 19 + 6 - 25);
    
    if (method === "Google Pay") {
      setGpayAmount(grandTotal);
      setGpayFlow("checkout");
      setScreen("google_pay");
      return;
    }

    try {
      await checkoutBackendCart();
    } catch (e) {
      console.error(e);
    }

    // Deduct standard balance or emergency deposit
    if (method === "Amazon Wallet") {
      setWalletBalance((prev) => Math.max(0, prev - grandTotal));
    } else if (method === "Emergency Deposit") {
      setEmergencyDeposit((prev) => Math.max(0, prev - grandTotal));
    }

    // Add to history
    const newOrder = {
      id: "ord_" + Date.now(),
      date: "Delivered just now",
      price: grandTotal,
      itemsText: cart.map(item => `${item.qty} x ${item.name}`).join(", "),
      items: [...cart]
    };
    setOrderHistory((prev) => [newOrder, ...prev]);

    setPaymentMethod(method);
    setScreen("tracking");
  };

  const handleReorderPastItems = async (items) => {
    try {
      await clearBackendCart();
      for (const item of items) {
        await addToBackendCart(item.id);
      }
    } catch (e) {
      console.error(e);
    }
    setCart(items.map(item => ({ ...item, qty: 1 })));
    setScreen("cart");
  };

  const handleGoBackFromTracking = () => {
    setCart([]);
    setScreen("home");
  };

  // Address CRUD Handlers
  const handleSaveAddress = (address) => {
    setAddresses((prev) => {
      const exists = prev.find((x) => x.id === address.id);
      let updated;
      if (exists) {
        updated = prev.map((x) => (x.id === address.id ? address : x));
      } else {
        updated = [...prev, address];
      }
      // Set active default address
      if (address.isDefault || prev.length === 0) {
        setSelectedAddress(address);
      }
      return updated;
    });
    setScreen("manage_addresses");
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter((x) => x.id !== id);
      if (selectedAddress?.id === id) {
        setSelectedAddress(filtered[0] || null);
      }
      return filtered;
    });
  };

  // Google Pay recharge handlers
  const handleGooglePaySuccess = async (amount) => {
    if (gpayFlow === "onboarding") {
      if (tempOnboardingData) {
        setCustomer(tempOnboardingData.customer);
        setAddresses([tempOnboardingData.address]);
        setSelectedAddress(tempOnboardingData.address);
        setEmergencyDeposit(tempOnboardingData.deposit);
        setTempOnboardingData(null);
      }
      setGpayFlow("recharge");
      setScreen("home");
      triggerNotification("Emergency Deposit", `₹${amount} emergency deposit added successfully!`);
    } else if (gpayFlow === "checkout") {
      try {
        await checkoutBackendCart();
      } catch (e) {
        console.error(e);
      }
      const grandTotal = amount;
      const newOrder = {
        id: "ord_" + Date.now(),
        date: "Delivered just now",
        price: grandTotal,
        itemsText: cart.map(item => `${item.qty} x ${item.name}`).join(", "),
        items: [...cart]
      };
      setOrderHistory((prev) => [newOrder, ...prev]);
      setPaymentMethod("Google Pay");
      setGpayFlow("recharge");
      setScreen("tracking");
      triggerNotification("Order Confirmed", `₹${grandTotal} paid successfully using Google Pay.`);
    } else {
      setWalletBalance((prev) => prev + amount);
      setGpayFlow("recharge");
      setScreen("payment");
      triggerNotification("Google Pay", `₹${amount} recharged successfully to your Wallet!`);
    }
  };

  const handleGooglePayCancel = () => {
    if (gpayFlow === "onboarding") {
      setTempOnboardingData(null);
      setGpayFlow("recharge");
      // Stay on UserSetupScreen by leaving customer null, set screen back
      setScreen("setup");
    } else if (gpayFlow === "checkout") {
      setGpayFlow("recharge");
      setScreen("payment");
    } else {
      setGpayFlow("recharge");
      setScreen("add_funds");
    }
  };

  return (
    <AppShell>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.mainContainer, { paddingBottom: keyboard.visible ? 280 : 0 }]}>
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : !isOnboarded ? (
          <OnboardingScreen onFinish={() => setIsOnboarded(true)} />
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
              }}
              focusInput={focusInput}
              updateKeyboardValue={updateKeyboardValue}
              hideKeyboard={hideKeyboard}
              triggerSms={() => triggerNotification("Amazon Now", "Your verification code is: 123456")}
            />
          )
        ) : (gpayFlow === "onboarding" && screen === "google_pay") ? (
          <GooglePayScreen
            amount={gpayAmount}
            flow={gpayFlow}
            onSuccess={handleGooglePaySuccess}
            onCancel={handleGooglePayCancel}
          />
        ) : !customer ? (
          <UserSetupScreen
            focusInput={focusInput}
            updateKeyboardValue={updateKeyboardValue}
            hideKeyboard={hideKeyboard}
            onComplete={(data) => {
              setTempOnboardingData(data);
              setGpayAmount(data.deposit);
              setGpayFlow("onboarding");
              setScreen("google_pay");
            }}
          />
        ) : (
          <>
            {screen === "home" && (
              <HomeScreen
                activeTab={activeTab}
                addToCart={addToCart}
                cartCount={cart.length}
                customer={customer}
                getQuantity={getQuantity}
                openCategory={openCategory}
                openProduct={openProduct}
                removeFromCart={removeFromCart}
                searchQuery={searchQuery}
                setActiveTab={setActiveTab}
                setSearchQuery={setSearchQuery}
                setScreen={setScreen}
                onReorderPastItems={handleReorderPastItems}
                products={products}
                triggerVoiceAssistant={triggerVoiceAssistant}
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
                products={products}
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
                products={products}
              />
            )}
            {screen === "cart" && (
              <CartScreen
                cart={cart}
                changeQuantity={changeQuantity}
                goBack={() => setScreen("home")}
                onCheckout={() => setScreen("payment")}
                total={total}
              />
            )}
            {screen === "payment" && (
              <PaymentScreen
                cart={cart}
                goBack={() => setScreen("cart")}
                onPlaceOrder={handlePlaceOrder}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                total={total}
                walletBalance={walletBalance}
                emergencyDeposit={emergencyDeposit}
                selectedAddress={selectedAddress}
                onChangeAddress={() => setScreen("manage_addresses")}
                onAddFunds={(deficit) => {
                  setCheckoutDeficit(deficit);
                  setScreen("add_funds");
                }}
              />
            )}
            {screen === "assistant" && (
              <AssistantScreen
                addToCart={addToCart}
                addGeneratedCart={handleAddGeneratedCart}
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
                startListening={assistantStartListening}
                onStopListening={() => setAssistantStartListening(false)}
                products={products}
              />
            )}
            {screen === "profile" && (
              <ProfileScreen
                customer={customer}
                addresses={addresses}
                orderHistory={orderHistory}
                walletBalance={walletBalance}
                goBack={() => setScreen("home")}
                onSignOut={() => {
                  setIsAuthenticated(false);
                  setAuthStep("email");
                  setEmail("");
                  setCustomer(null);
                  setAddresses([]);
                  setSelectedAddress(null);
                  setCart([]);
                }}
                onManageAddresses={() => setScreen("manage_addresses")}
                onManageWallet={() => setScreen("wallet")}
                onReorderPastItems={handleReorderPastItems}
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
                products={products}
                triggerVoiceAssistant={triggerVoiceAssistant}
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
                addGeneratedCart={handleAddGeneratedCart}
                products={products}
              />
            )}
            {screen === "wallet" && (
              <WalletScreen
                deposit={emergencyDeposit}
                goBack={() => setScreen("profile")}
                setDeposit={(amount) => {
                  setEmergencyDeposit(amount);
                  setScreen("profile");
                }}
              />
            )}
            {screen === "tracking" && (
              <TrackingScreen
                cart={cart}
                goBack={handleGoBackFromTracking}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                total={total}
                selectedAddress={selectedAddress}
                triggerGlobalNotification={triggerNotification}
              />
            )}
            {screen === "manage_addresses" && (
              <ManageAddressesScreen
                addresses={addresses}
                selectedAddress={selectedAddress}
                onSelectAddress={(addr) => {
                  setSelectedAddress(addr);
                  setScreen("payment");
                }}
                onAddAddress={() => {
                  setAddressToEdit(null);
                  setScreen("address_form");
                }}
                onEditAddress={(addr) => {
                  setAddressToEdit(addr);
                  setScreen("address_form");
                }}
                onDeleteAddress={handleDeleteAddress}
                goBack={() => setScreen("payment")}
              />
            )}
            {screen === "address_form" && (
              <AddressFormScreen
                addressToEdit={addressToEdit}
                focusInput={focusInput}
                updateKeyboardValue={updateKeyboardValue}
                hideKeyboard={hideKeyboard}
                onSave={handleSaveAddress}
                goBack={() => setScreen("manage_addresses")}
              />
            )}
            {screen === "add_funds" && (
              <AddFundsScreen
                deficitAmount={checkoutDeficit}
                onSelectGooglePay={(amt) => {
                  setGpayAmount(amt);
                  setGpayFlow("recharge");
                  setScreen("google_pay");
                }}
                goBack={() => setScreen("payment")}
              />
            )}
            {screen === "google_pay" && (
              <GooglePayScreen
                amount={gpayAmount}
                flow={gpayFlow}
                onSuccess={handleGooglePaySuccess}
                onCancel={handleGooglePayCancel}
              />
            )}
            {!["payment", "assistant", "tracking", "search", "google_pay", "add_funds", "address_form", "manage_addresses"].includes(screen) ? (
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
