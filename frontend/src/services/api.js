const BASE_URL = "http://localhost:8000";

export function toBackendId(id) {
  return id;
}

export function toFrontendId(id) {
  return id;
}

export function normalizeBackendProduct(backendProd, localProducts = []) {
  const matchedLocal = localProducts.find(p => p.id === backendProd.id);
  
  if (matchedLocal) {
    return {
      ...matchedLocal,
      price: backendProd.price || matchedLocal.price,
      name: backendProd.name || matchedLocal.name,
      image: backendProd.imageUrl || backendProd.thumbnail || matchedLocal.image,
      imageUrl: backendProd.imageUrl || backendProd.thumbnail || matchedLocal.imageUrl
    };
  }
  
  const img = backendProd.imageUrl || backendProd.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80";
  return {
    id: backendProd.id,
    name: backendProd.name,
    category: backendProd.category || "general",
    price: backendProd.price,
    quantity: backendProd.quantity || "1 pack",
    unit: backendProd.quantity || "1 pack",
    image: img,
    imageUrl: img,
    fallbackImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    tag: "Imported",
    rating: backendProd.rating || 4.5,
    deliveryMins: backendProd.deliveryMins || 15,
    brand: backendProd.brand || "Amazon",
    reason: "Highly rated product recommended by Amazon Now AI."
  };
}

export async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("API error in fetchProducts:", error);
    return null;
  }
}

export async function fetchCart() {
  try {
    const response = await fetch(`${BASE_URL}/cart`);
    if (!response.ok) throw new Error("Failed to fetch cart");
    return await response.json();
  } catch (error) {
    console.error("API error in fetchCart:", error);
    return null;
  }
}

export async function addToBackendCart(productId) {
  try {
    const bId = toBackendId(productId);
    const response = await fetch(`${BASE_URL}/cart/items/${bId}`, {
      method: "POST"
    });
    if (!response.ok) throw new Error("Failed to add to cart");
    return await response.json();
  } catch (error) {
    console.error("API error in addToBackendCart:", error);
    return null;
  }
}

export async function removeFromBackendCart(productId) {
  try {
    const bId = toBackendId(productId);
    const response = await fetch(`${BASE_URL}/cart/items/${bId}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error("Failed to remove from cart");
    return await response.json();
  } catch (error) {
    console.error("API error in removeFromBackendCart:", error);
    return null;
  }
}

export async function clearBackendCart() {
  try {
    const response = await fetch(`${BASE_URL}/cart/clear`, {
      method: "POST"
    });
    if (!response.ok) throw new Error("Failed to clear cart");
    return await response.json();
  } catch (error) {
    console.error("API error in clearBackendCart:", error);
    return null;
  }
}

export async function checkoutBackendCart() {
  try {
    const response = await fetch(`${BASE_URL}/cart/checkout`, {
      method: "POST"
    });
    if (!response.ok) throw new Error("Failed to checkout");
    return await response.json();
  } catch (error) {
    console.error("API error in checkoutBackendCart:", error);
    return null;
  }
}

export async function sendChatMessage(query, sessionId = "default") {
  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, session_id: sessionId })
    });
    if (!response.ok) throw new Error("Failed to send chat message");
    return await response.json();
  } catch (error) {
    console.error("API error in sendChatMessage:", error);
    return null;
  }
}
