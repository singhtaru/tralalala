import excelProducts from "./products.json";

const categoryMeta = {
  fruits: {
    title: "Vegetables & Fruits",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=500&q=80",
    tag: "Fresh"
  },
  atta: {
    title: "Atta, Rice & Dal",
    image: "https://images.unsplash.com/photo-1605522469906-3fe226b356bc?auto=format&fit=crop&w=500&q=80",
    tag: "Daily"
  },
  oil: {
    title: "Oil, Ghee & Masala",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80",
    tag: "Kitchen"
  },
  dairy: {
    title: "Dairy, Bread & Eggs",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80",
    tag: "Chilled"
  },
  bakery: {
    title: "Bakery & Biscuits",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
    tag: "Baked"
  },
  cereal: {
    title: "Dry Fruits & Cereals",
    image: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=500&q=80",
    tag: "Healthy"
  },
  meat: {
    title: "Chicken, Meat & Fish",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80",
    tag: "Fresh"
  },
  kitchen: {
    title: "Kitchenware",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=500&q=80",
    tag: "Home"
  },
  chips: {
    title: "Chips & Namkeen",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80",
    tag: "Snack"
  },
  chocolate: {
    title: "Sweets & Chocolates",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=500&q=80",
    tag: "Sweet"
  },
  drinks: {
    title: "Drinks & Juices",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=500&q=80",
    tag: "Drinks"
  },
  tea: {
    title: "Tea, Coffee & More",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80",
    tag: "Beverage"
  },
  instant: {
    title: "Instant Food",
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=500&q=80",
    tag: "Quick"
  },
  health: {
    title: "Protein & Fitness",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80",
    tag: "Fitness"
  },
  icecream: {
    title: "Ice Creams & Desserts",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=500&q=80",
    tag: "Frozen"
  }
};

export const topTabs = [
  { id: "all", label: "All", icon: "shopping-outline", categories: [] },
  { id: "grocery", label: "Grocery", icon: "basket-outline", categories: ["fruits", "atta", "oil", "dairy"] },
  { id: "snacks", label: "Snacks", icon: "food-outline", categories: ["bakery", "chips", "chocolate", "instant", "icecream"] },
  { id: "drinks", label: "Drinks", icon: "cup-outline", categories: ["drinks", "tea"] },
  { id: "home", label: "Home", icon: "home-outline", categories: ["kitchen", "cereal", "health", "meat"] }
];

const sectionDefinitions = [
  {
    id: "grocery",
    title: "Grocery & Kitchen",
    categoryIds: ["fruits", "atta", "oil", "dairy", "bakery", "cereal", "meat", "kitchen"]
  },
  {
    id: "snacks",
    title: "Snacks & Drinks",
    categoryIds: ["chips", "chocolate", "drinks", "tea", "instant", "health", "icecream"]
  }
];

export const categorySections = sectionDefinitions.map((section) => ({
  id: section.id,
  title: section.title,
  tiles: section.categoryIds.map((id) => ({
    id,
    title: categoryMeta[id].title,
    image: categoryMeta[id].image
  }))
}));

export const products = excelProducts.map((product) => {
  const meta = categoryMeta[product.category];
  return {
    ...product,
    image: product.imageUrl || meta.image,
    fallbackImage: meta.image,
    tag: meta.tag,
    unit: product.quantity,
    reason: `${product.rating} star ${meta.title.toLowerCase()} product with ${product.deliveryMins}-minute delivery.`
  };
});
