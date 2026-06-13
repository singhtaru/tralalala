"""Convert the Amazon Now Excel catalog into frontend JSON."""

import json
import re
from pathlib import Path

from openpyxl import load_workbook


FRONTEND_ROOT = Path(__file__).resolve().parents[1]
SOURCE_FILE = FRONTEND_ROOT / "data" / "source" / "AmazonNow_Dummy_Product_Dataset.xlsx"
OUTPUT_FILE = FRONTEND_ROOT / "src" / "data" / "products.json"

CATEGORY_IDS = {
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
    "Ice Creams & Desserts": "icecream",
}

IMAGE_OVERRIDES = {
    "Tomato": "https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=500&q=80",
    "Potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80",
    "Onion": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?auto=format&fit=crop&w=500&q=80",
    "Banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80",
    "Apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80",
    "Orange": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=500&q=80",
    "Carrot": "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=500&q=80",
    "Spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80",
    "Aashirvaad Atta 5kg": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80",
    "Fortune Atta 5kg": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80",
    "Butter 500g": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80",
    "Coca Cola 1L": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80",
    "Pepsi 1L": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=500&q=80",
    "Lays Chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80",
    "Dairy Milk": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=500&q=80",
    "Instant Coffee": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80",
    "Chocolate Ice Cream": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=500&q=80",
    "Vanilla Ice Cream": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80",
}

CATEGORY_IMAGES = {
    "Vegetables & Fruits": "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=500&q=80",
    "Atta Rice & Dal": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80",
    "Oil Ghee & Masala": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80",
    "Dairy Bread & Eggs": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80",
    "Bakery & Biscuits": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
    "Dry Fruits & Cereals": "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=500&q=80",
    "Chicken Meat & Fish": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80",
    "Kitchenware": "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=500&q=80",
    "Chips & Namkeen": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80",
    "Sweets & Chocolates": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=500&q=80",
    "Drinks & Juices": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=500&q=80",
    "Tea Coffee & More": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80",
    "Instant Food": "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=500&q=80",
    "Protein & Fitness": "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80",
    "Ice Creams & Desserts": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=500&q=80",
}


def extract_quantity(product_name: str) -> str:
    match = re.search(
        r"(\d+(?:\.\d+)?\s?(?:kg|g|ml|l)|pack of \d+)",
        product_name,
        re.IGNORECASE,
    )
    return match.group(1) if match else "1 pack"


def image_url_for(product_name: str, category_name: str) -> str:
    if product_name in IMAGE_OVERRIDES:
        return IMAGE_OVERRIDES[product_name]

    return CATEGORY_IMAGES[category_name]


def main() -> None:
    workbook = load_workbook(SOURCE_FILE, data_only=True)
    worksheet = workbook["AmazonNowProducts"]
    rows = list(worksheet.iter_rows(values_only=True))
    headers = rows[0]
    headers = list(headers)
    image_column = "Image_URL"
    if image_column not in headers:
        worksheet.cell(row=1, column=len(headers) + 1, value=image_column)
        headers.append(image_column)

    products = []

    for row_index, values in enumerate(rows[1:], start=2):
        row = dict(zip(headers, values))
        product_name = str(row["Product_Name"])
        image_url = image_url_for(product_name, row["Category"])
        worksheet.cell(row=row_index, column=headers.index(image_column) + 1, value=image_url)
        products.append(
            {
                "id": row["Product_ID"],
                "name": product_name,
                "category": CATEGORY_IDS[row["Category"]],
                "categoryName": row["Category"],
                "price": row["Price_INR"],
                "rating": row["Rating"],
                "deliveryMins": row["Delivery_Time_Min"],
                "quantity": extract_quantity(product_name),
                "imageUrl": image_url,
            }
        )

    workbook.save(SOURCE_FILE)
    OUTPUT_FILE.write_text(
        json.dumps(products, indent=2, ensure_ascii=True) + "\n",
        encoding="utf-8",
    )
    print(f"Generated {len(products)} products at {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
