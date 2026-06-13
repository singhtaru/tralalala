import { products } from "./products";

const emergencyProducts = [
  { id: "E001", name: "Sterile Bandages", category: "first-aid", price: 65, rating: 4.9, deliveryMins: 8, quantity: "20 pcs", image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=500&q=80", reason: "Essential wound protection selected for an injury emergency." },
  { id: "E002", name: "Antiseptic Liquid", category: "first-aid", price: 110, rating: 4.8, deliveryMins: 8, quantity: "100 ml", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80", reason: "Helps clean minor cuts before dressing." },
  { id: "E003", name: "Medical Cotton", category: "first-aid", price: 45, rating: 4.7, deliveryMins: 8, quantity: "100 g", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80", reason: "Useful for cleaning and applying antiseptic." },
  { id: "E004", name: "Medical Tape", category: "first-aid", price: 55, rating: 4.7, deliveryMins: 8, quantity: "1 roll", image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=500&q=80", reason: "Keeps dressings securely in place." },
  { id: "E005", name: "Digital Thermometer", category: "first-aid", price: 199, rating: 4.8, deliveryMins: 9, quantity: "1 pc", image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=500&q=80", reason: "Fast temperature check for a fever emergency." },
  { id: "E006", name: "Baby Diapers", category: "baby", price: 399, rating: 4.9, deliveryMins: 10, quantity: "24 pcs", image: "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?auto=format&fit=crop&w=500&q=80", reason: "Top-rated emergency diaper pack." },
  { id: "E007", name: "Baby Wipes", category: "baby", price: 149, rating: 4.8, deliveryMins: 10, quantity: "72 wipes", image: "https://images.unsplash.com/photo-1598460880248-71ec6d2d582b?auto=format&fit=crop&w=500&q=80", reason: "Gentle cleaning essential for baby care." },
  { id: "E008", name: "LED Emergency Bulb", category: "emergency", price: 299, rating: 4.7, deliveryMins: 12, quantity: "1 pc", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80", reason: "Rechargeable light selected for a power outage." }
];

const byNames = (...names) => names.map((name) => products.find((item) => item.name === name)).filter(Boolean);
const emergencyByIds = (...ids) => ids.map((id) => emergencyProducts.find((item) => item.id === id)).filter(Boolean);

export const emergencyCategories = [
  { id: "injury", title: "Injury", icon: "bandage-outline", message: "We detected a first-aid emergency.", products: emergencyByIds("E001", "E002", "E003", "E004") },
  { id: "fever", title: "Fever", icon: "thermometer-outline", message: "Fever-care essentials are ready.", products: [...emergencyByIds("E005"), ...byNames("Orange Juice", "Instant Noodles")] },
  { id: "baby", title: "Baby Emergency", icon: "baby-face-outline", library: "material", message: "Baby-care essentials are ready.", products: emergencyByIds("E006", "E007") },
  { id: "power", title: "Power Outage", icon: "flash-outline", message: "Power-outage essentials are ready.", products: [...emergencyByIds("E008"), ...byNames("Water Bottle", "Instant Noodles")] },
  { id: "household", title: "Household Emergency", icon: "home-alert-outline", library: "material", message: "Household essentials are ready.", products: byNames("Water Bottle", "Storage Container", "Instant Noodles", "Amul Milk 1L") }
];

export function detectIntent(query = "") {
  const text = query.toLowerCase();
  if (/(cut|finger|injury|hurt|bleed|bandage|first aid)/.test(text)) return emergencyCategories[0];
  if (/(fever|temperature|sick)/.test(text)) return emergencyCategories[1];
  if (/(baby|diaper|nappy)/.test(text)) return emergencyCategories[2];
  if (/(power|outage|light|electricity)/.test(text)) return emergencyCategories[3];
  if (/(guest|party|friends arrived)/.test(text)) return { id: "guests", title: "Guest-ready cart", message: "Unexpected guests? Snacks and drinks are ready.", products: byNames("Lays Chips", "Kurkure", "Coca Cola 1L", "Dairy Milk", "Vanilla Ice Cream") };
  if (/(breakfast|morning meal)/.test(text)) return { id: "breakfast", title: "Quick breakfast", message: "A quick breakfast cart is ready.", products: byNames("Amul Milk 1L", "Brown Bread", "Butter 500g", "Eggs Pack of 12", "Banana") };
  if (text.includes("butter")) return { id: "butter", title: "Best-ranked butter", message: "I selected the highest-rated butter with the fastest delivery.", products: byNames("Butter 500g") };
  return null;
}

