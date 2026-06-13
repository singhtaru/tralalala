from services.product_service import get_products

_CART_ITEMS = []


def _find_product(product_id):
    return next((product for product in get_products() if product["id"] == product_id), None)


def add_to_cart(product_id):
    product = _find_product(product_id)
    if not product:
        return None

    _CART_ITEMS.append(product)
    return product


def get_cart():
    total = round(sum(item["price"] for item in _CART_ITEMS), 2)
    return {
        "items": list(_CART_ITEMS),
        "total": total,
    }


def clear_cart():
    removed_count = len(_CART_ITEMS)
    _CART_ITEMS.clear()
    return {
        "items": [],
        "total": 0.0,
        "removed_count": removed_count,
    }


def checkout():
    cart = get_cart()
    item_count = len(cart["items"])
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
    }
