import json
import openpyxl
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
EXCEL_PATH = BASE_DIR / "frontend" / "data" / "source" / "AmazonNow_Dummy_Product_Dataset.xlsx"
FRONTEND_JSON_PATH = BASE_DIR / "frontend" / "src" / "data" / "products.json"
BACKEND_JSON_PATH = BASE_DIR / "backend" / "products.json"

category_mapping = {
    "Vegetables & Fruits": "fruits",
    "Atta Rice & Dal": "atta",
    "Oil Ghee & Masala": "oil",
    "Dairy Bread & Eggs": "dairy",
    "Bakery & Biscuits": "bakery",
    "Dry Fruits & Cereals": "cereal",
    "Chicken Meat & Fish": "meat",
    "Kitchenware": "kitchen",
    "Chips & Namkeen": "chips",
    "Sweets & Chocolates": "chocolate",
    "Drinks & Juices": "drinks",
    "Tea Coffee & More": "tea",
    "Instant Food": "instant",
    "Protein & Fitness": "health",
    "Ice Creams & Desserts": "icecream"
}

# Emergency products
emergency_products = [
    { "id": "E001", "name": "Sterile Bandages", "category": "first-aid", "categoryName": "First Aid", "price": 65.0, "rating": 4.9, "deliveryMins": 8, "imageUrl": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=500&q=80", "thumbnail": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=500&q=80", "brand": "Band-Aid", "quantity": "20 pcs" },
    { "id": "E002", "name": "Antiseptic Liquid", "category": "first-aid", "categoryName": "First Aid", "price": 110.0, "rating": 4.8, "deliveryMins": 8, "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80", "thumbnail": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80", "brand": "Dettol", "quantity": "100 ml" },
    { "id": "E003", "name": "Medical Cotton", "category": "first-aid", "categoryName": "First Aid", "price": 45.0, "rating": 4.7, "deliveryMins": 8, "imageUrl": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80", "thumbnail": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80", "brand": "Johnson & Johnson", "quantity": "100 g" },
    { "id": "E004", "name": "Medical Tape", "category": "first-aid", "categoryName": "First Aid", "price": 55.0, "rating": 4.7, "deliveryMins": 8, "imageUrl": "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=500&q=80", "thumbnail": "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=500&q=80", "brand": "3M", "quantity": "1 roll" },
    { "id": "E005", "name": "Digital Thermometer", "category": "first-aid", "categoryName": "First Aid", "price": 199.0, "rating": 4.8, "deliveryMins": 9, "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=500&q=80", "thumbnail": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=500&q=80", "brand": "Omron", "quantity": "1 pc" },
    { "id": "E006", "name": "Baby Diapers", "category": "baby", "categoryName": "Baby Care", "price": 399.0, "rating": 4.9, "deliveryMins": 10, "imageUrl": "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?auto=format&fit=crop&w=500&q=80", "thumbnail": "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?auto=format&fit=crop&w=500&q=80", "brand": "Pampers", "quantity": "24 pcs" },
    { "id": "E007", "name": "Baby Wipes", "category": "baby", "categoryName": "Baby Care", "price": 149.0, "rating": 4.8, "deliveryMins": 10, "imageUrl": "https://images.unsplash.com/photo-1598460880248-71ec6d2d582b?auto=format&fit=crop&w=500&q=80", "thumbnail": "https://images.unsplash.com/photo-1598460880248-71ec6d2d582b?auto=format&fit=crop&w=500&q=80", "brand": "Huggies", "quantity": "72 wipes" },
    { "id": "E008", "name": "LED Emergency Bulb", "category": "emergency", "categoryName": "Emergency Care", "price": 299.0, "rating": 4.7, "deliveryMins": 12, "imageUrl": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80", "thumbnail": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80", "brand": "Philips", "quantity": "1 pc" }
]

def main():
    # Load frontend JSON to get current brands and quantities
    frontend_curated = {}
    if FRONTEND_JSON_PATH.exists():
        with open(FRONTEND_JSON_PATH, "r", encoding="utf-8") as f:
            try:
                for item in json.load(f):
                    frontend_curated[item["id"]] = item
            except Exception as e:
                print("Failed to load existing frontend JSON:", e)

    # Read Excel sheet
    print("Loading Excel from:", EXCEL_PATH)
    wb = openpyxl.load_workbook(EXCEL_PATH)
    sheet = wb.active

    headers = [cell.value for cell in sheet[1]]
    print("Headers:", headers)

    products = []
    for row_idx in range(2, sheet.max_row + 1):
        row_cells = sheet[row_idx]
        vals = [cell.value for cell in row_cells]
        if not any(vals):
            continue

        p_id = vals[0]
        p_name = vals[1]
        raw_cat = vals[2]
        price = float(vals[3]) if vals[3] is not None else 0.0
        rating = float(vals[4]) if vals[4] is not None else 4.5
        delivery = int(vals[5]) if vals[5] is not None else 15
        img_url = vals[6]

        normalized_cat = category_mapping.get(raw_cat, "general")
        
        # Match with curated frontend details
        curated = frontend_curated.get(p_id, {})
        brand = curated.get("brand") or p_name.split()[0]
        quantity = curated.get("quantity") or "1 pack"

        product_obj = {
            "id": p_id,
            "name": p_name,
            "category": normalized_cat,
            "categoryName": raw_cat,
            "price": price,
            "rating": rating,
            "deliveryMins": delivery,
            "imageUrl": img_url,
            "thumbnail": img_url,
            "brand": brand,
            "quantity": quantity
        }
        products.append(product_obj)

    # Append emergency products
    products.extend(emergency_products)

    # Save to both frontend and backend
    print(f"Generated {len(products)} products.")

    # Write to backend products.json
    with open(BACKEND_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print("Saved to backend:", BACKEND_JSON_PATH)

    # Write to frontend products.json
    with open(FRONTEND_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print("Saved to frontend:", FRONTEND_JSON_PATH)

if __name__ == "__main__":
    main()
