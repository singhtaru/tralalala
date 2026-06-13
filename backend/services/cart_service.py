from services.product_service import get_products

_CART_ITEMS = []


def _find_product(product_id):
    return next((product for product in get_products() if product["id"] == product_id), None)


def add_to_cart(product_id):
    product = _find_product(product_id)
    if not product:
        return None

    existing_item = next((item for item in _CART_ITEMS if item["id"] == product_id), None)
    if existing_item:
        existing_item["quantity"] = existing_item.get("quantity", 1) + 1
        return existing_item

    cart_item = {**product, "quantity": 1}
    _CART_ITEMS.append(cart_item)
    return cart_item


def get_cart():
    total = round(sum(item["price"] * item.get("quantity", 1) for item in _CART_ITEMS), 2)
    total_quantity = sum(item.get("quantity", 1) for item in _CART_ITEMS)
    return {
        "items": list(_CART_ITEMS),
        "total": total,
        "total_quantity": total_quantity,
    }


def clear_cart():
    removed_count = len(_CART_ITEMS)
    _CART_ITEMS.clear()
    return {
        "items": [],
        "total": 0.0,
        "removed_count": removed_count,
        "total_quantity": 0,
    }


def checkout():
    cart = get_cart()
    item_count = sum(item.get("quantity", 1) for item in cart["items"])
    if item_count == 0:
        return {
            "items": [],
            "total": 0.0,
            "item_count": 0,
            "status": "empty_cart",
            "message": "Cart is empty. Nothing to checkout.",
        }

    clear_cart()
    return {
        "items": cart["items"],
        "total": cart["total"],
        "item_count": item_count,
        "status": "checked_out",
        "message": f"Checkout completed for {item_count} items totaling Rs {cart['total']}.",
        "total_quantity": item_count,
    }
