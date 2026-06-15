import { products } from "./products";

const emergencyProducts = [
  { id: "E001", name: "Sterile Bandages", category: "first-aid", price: 65, rating: 4.9, deliveryMins: 8, quantity: "20 pcs", brand: "Johnson's", image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=500&q=80", reason: "Essential wound protection selected for an injury emergency." },
  { id: "E002", name: "Antiseptic Liquid", category: "first-aid", price: 110, rating: 4.8, deliveryMins: 8, quantity: "100 ml", brand: "Dettol", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80", reason: "Helps clean minor cuts before dressing." },
  { id: "E003", name: "Medical Cotton", category: "first-aid", price: 45, rating: 4.7, deliveryMins: 8, quantity: "100 g", brand: "Firstaid", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80", reason: "Useful for cleaning and applying antiseptic." },
  { id: "E004", name: "Medical Tape", category: "first-aid", price: 55, rating: 4.7, deliveryMins: 8, quantity: "1 roll", brand: "Firstaid", image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=500&q=80", reason: "Keeps dressings securely in place." },
  { id: "E005", name: "Digital Thermometer", category: "first-aid", price: 199, rating: 4.8, deliveryMins: 9, quantity: "1 pc", brand: "Omron", image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=500&q=80", reason: "Fast temperature check for a fever emergency." },
  { id: "E006", name: "Baby Diapers", category: "baby", price: 399, rating: 4.9, deliveryMins: 10, quantity: "24 pcs", brand: "Pampers", image: "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?auto=format&fit=crop&w=500&q=80", reason: "Top-rated emergency diaper pack." },
  { id: "E007", name: "Baby Wipes", category: "baby", price: 149, rating: 4.8, deliveryMins: 10, quantity: "72 wipes", brand: "Pampers", image: "https://images.unsplash.com/photo-1598460880248-71ec6d2d582b?auto=format&fit=crop&w=500&q=80", reason: "Gentle cleaning essential for baby care." },
  { id: "E008", name: "LED Emergency Bulb", category: "emergency", price: 299, rating: 4.7, deliveryMins: 12, quantity: "1 pc", brand: "Philips", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80", reason: "Rechargeable light selected for a power outage." }
];

const byNames = (...names) => names.map((name) => products.find((item) => item.name === name)).filter(Boolean);
const emergencyByIds = (...ids) => ids.map((id) => emergencyProducts.find((item) => item.id === id)).filter(Boolean);

// Rank products by rating first, then delivery time
const rankProducts = (productList) => {
  return [...productList].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return a.deliveryMins - b.deliveryMins;
  });
};

// Find products matching a search term by name, category, or brand
const findProductsByTerm = (term) => {
  const lower = term.toLowerCase();
  const matches = products.filter((p) => {
    const name = p.name.toLowerCase();
    const category = (p.category || "").toLowerCase();
    const brand = (p.brand || "").toLowerCase();
    const catName = (p.categoryName || "").toLowerCase();
    return name.includes(lower) || category.includes(lower) || brand.includes(lower) || catName.includes(lower);
  });
  return rankProducts(matches);
};

// Get products from same category as the top result
const getCategoryPeers = (product, maxCount = 6) => {
  const peers = products.filter((p) => p.category === product.category && p.id !== product.id);
  return rankProducts(peers).slice(0, maxCount);
};

// Category-specific refinement filters
const getCategoryFilters = (category) => {
  const filterMap = {
    dairy: ["Best Seller", "Organic", "Premium", "Budget Friendly"],
    oil: ["Best Seller", "Organic", "Premium", "Budget Friendly"],
    atta: ["Best Seller", "Organic", "Premium", "Budget Friendly"],
    fruits: ["Best Seller", "Organic", "Fast Delivery", "Budget Friendly"],
    bakery: ["Best Seller", "Premium", "Budget Friendly", "Fast Delivery"],
    chips: ["Best Seller", "Premium", "Budget Friendly", "Fast Delivery"],
    chocolate: ["Best Seller", "Premium", "Budget Friendly"],
    cereal: ["Healthy", "High Protein", "Organic", "Budget Friendly"],
    meat: ["Best Seller", "Premium", "Fast Delivery"],
    drinks: ["Best Seller", "Healthy", "Budget Friendly", "Fast Delivery"],
    tea: ["Best Seller", "Healthy", "Premium", "Budget Friendly"],
    kitchen: ["Best Seller", "Premium", "Budget Friendly"],
    health: ["High Protein", "Healthy", "Premium"],
    instant: ["Fast Delivery", "Best Seller", "Budget Friendly"],
    icecream: ["Best Seller", "Premium", "Budget Friendly"]
  };
  return filterMap[category] || ["Best Seller", "Premium", "Budget Friendly", "Fast Delivery"];
};

export const emergencyCategories = [
  { id: "injury", title: "Injury", icon: "bandage-outline", message: "We detected a first-aid emergency.", products: emergencyByIds("E001", "E002", "E003", "E004") },
  { id: "burn", title: "Burn", icon: "flame-outline", message: "Burn care essentials are ready.", products: emergencyByIds("E003", "E001", "E004", "E002") },
  { id: "fever", title: "Fever", icon: "thermometer-outline", message: "Fever-care essentials are ready.", products: [...emergencyByIds("E005"), ...byNames("Orange Juice", "Water Bottle")] },
  { id: "baby", title: "Baby Emergency", icon: "baby-face-outline", library: "material", message: "Baby-care essentials are ready.", products: emergencyByIds("E006", "E007") },
  { id: "power", title: "Power Outage", icon: "flash-outline", message: "Power-outage essentials are ready.", products: [...emergencyByIds("E008"), ...byNames("Water Bottle", "Instant Noodles")] },
  { id: "household", title: "Household Emergency", icon: "home-alert-outline", library: "material", message: "Household essentials are ready.", products: byNames("Water Bottle", "Storage Container", "Instant Noodles", "Amul Milk 1L") }
];

export function detectIntent(query = "") {
  const text = query.toLowerCase().trim();

  // ==================== EMERGENCY INTENTS ====================
  // Injury / Cut - recommend bandages, cotton, antiseptic, tape (NOT thermometer)
  if (/(cut|finger|injury|hurt|bleed|bandage|wound|scratch)/.test(text)) {
    return {
      ...emergencyCategories[0],
      refinementFilters: ["Fast Delivery", "Best Seller", "Budget Friendly"]
    };
  }

  // Burns - recommend cotton, bandage, tape, antiseptic
  if (/(burn|burnt|scald|hot water|flame)/.test(text)) {
    return {
      ...emergencyCategories[1],
      refinementFilters: ["Fast Delivery", "Best Seller", "Budget Friendly"]
    };
  }

  // Fever - recommend thermometer, juice, water
  if (/(fever|temperature|sick|cold|flu|cough)/.test(text)) {
    return {
      ...emergencyCategories[2],
      refinementFilters: ["Fast Delivery", "Best Seller"]
    };
  }

  // Baby emergency
  if (/(baby|diaper|nappy|infant)/.test(text)) {
    return {
      ...emergencyCategories[3],
      refinementFilters: ["Budget Friendly", "Best Seller", "Fast Delivery"]
    };
  }

  // Power outage
  if (/(power|outage|light|electricity|blackout)/.test(text)) {
    return {
      ...emergencyCategories[4],
      refinementFilters: ["Fast Delivery", "Budget Friendly"]
    };
  }

  // ==================== OCCASION INTENTS ====================
  if (/(guest|party|friends arrived|visitors|friends coming)/.test(text)) {
    const guestProducts = byNames("Lays Chips", "Kurkure", "Nachos", "Coca Cola 1L", "Pepsi 1L", "Dairy Milk");
    return {
      id: "guests",
      title: "Guest-ready cart",
      message: "Unexpected guests? I've picked popular snacks and drinks for hosting.",
      products: rankProducts(guestProducts),
      refinementFilters: ["Best Seller", "Premium", "Budget Friendly", "Fast Delivery"]
    };
  }

  if (/(breakfast|morning meal|morning food)/.test(text)) {
    const breakfastProducts = byNames("Amul Milk 1L", "Brown Bread", "Butter 500g", "Eggs Pack of 12", "Banana", "Oats 1kg");
    return {
      id: "breakfast",
      title: "Quick breakfast",
      message: "Here's a balanced breakfast cart. Add what you need!",
      products: rankProducts(breakfastProducts),
      refinementFilters: ["Healthy", "High Protein", "Organic", "Budget Friendly"]
    };
  }

  if (/(healthy|diet|fitness|gym|workout)/.test(text)) {
    const healthProducts = byNames("Oats 1kg", "Almonds 500g", "Green Tea", "Banana", "Protein Shake", "Eggs Pack of 12");
    return {
      id: "healthy",
      title: "Healthy picks",
      message: "Here are my top picks for a healthy lifestyle!",
      products: rankProducts(healthProducts),
      refinementFilters: ["High Protein", "Low Calorie", "Organic", "Best Seller"]
    };
  }

  // ==================== PRODUCT-SPECIFIC INTENTS ====================
  // Extract specific product keywords
  const productKeywords = [
    "butter", "milk", "bread", "eggs", "cheese", "paneer", "curd",
    "rice", "atta", "dal", "oil", "ghee",
    "turmeric", "chilli", "masala", "cumin", "coriander",
    "chips", "kurkure", "nachos", "biscuit", "cookies",
    "chocolate", "kitkat", "ice cream",
    "coffee", "tea", "juice", "coke", "cola", "pepsi",
    "chicken", "fish", "mutton", "prawns",
    "oats", "cornflakes", "muesli", "almonds", "cashews", "walnuts",
    "noodles", "pasta", "protein"
  ];

  for (const keyword of productKeywords) {
    if (text.includes(keyword)) {
      const matched = findProductsByTerm(keyword);
      if (matched.length > 0) {
        const topProduct = matched[0];
        const alternatives = matched.slice(1, 5);
        const allProducts = [topProduct, ...alternatives];
        const category = topProduct.category;

        return {
          id: `product_${keyword}`,
          title: `Best ${keyword}`,
          message: `I found the top-rated ${topProduct.name} for you. ${topProduct.rating}★ with ${topProduct.deliveryMins}-minute delivery.`,
          products: allProducts,
          refinementFilters: getCategoryFilters(category)
        };
      }
    }
  }

  // ==================== CATEGORY SEARCH FALLBACK ====================
  // Try to match against category names
  const categoryKeywords = {
    snack: "chips",
    snacks: "chips",
    drink: "drinks",
    drinks: "drinks",
    beverage: "drinks",
    fruit: "fruits",
    vegetable: "fruits",
    grocery: "atta",
    spice: "oil",
    masala: "oil",
    meat: "meat",
    nonveg: "meat",
    sweet: "chocolate",
    dessert: "icecream",
    cereal: "cereal",
    "dry fruit": "cereal",
    kitchen: "kitchen",
    bakery: "bakery"
  };

  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (text.includes(keyword)) {
      const matched = rankProducts(products.filter((p) => p.category === category));
      if (matched.length > 0) {
        const topProduct = matched[0];
        const allProducts = matched.slice(0, 5);
        return {
          id: `category_${category}`,
          title: `Top ${keyword} picks`,
          message: `Here are the best ${keyword} products. ${topProduct.name} is the top pick with ${topProduct.rating}★ rating.`,
          products: allProducts,
          refinementFilters: getCategoryFilters(category)
        };
      }
    }
  }

  // Generic "order" intent - try to extract the noun after "order"
  const orderMatch = text.match(/(?:order|buy|get|want|need)\s+(.+)/);
  if (orderMatch) {
    const searchTerm = orderMatch[1].replace(/[^a-z\s]/g, "").trim();
    if (searchTerm) {
      const matched = findProductsByTerm(searchTerm);
      if (matched.length > 0) {
        const topProduct = matched[0];
        const allProducts = matched.slice(0, 5);
        const category = topProduct.category;
        return {
          id: `search_${searchTerm}`,
          title: `Best ${searchTerm}`,
          message: `I found ${topProduct.name} as the top result for "${searchTerm}". ${topProduct.rating}★ rated with ${topProduct.deliveryMins}-minute delivery.`,
          products: allProducts,
          refinementFilters: getCategoryFilters(category)
        };
      }
    }
  }

  return null;
}
