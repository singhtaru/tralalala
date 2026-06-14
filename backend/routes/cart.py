from fastapi import APIRouter, HTTPException

from services.cart_service import add_to_cart, checkout, clear_cart, get_cart, remove_from_cart

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("")
def read_cart():
    return get_cart()


@router.post("/items/{product_id}")
def create_cart_item(product_id: str):
    product = add_to_cart(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "action": "cart_updated",
        "item_added": product,
        "cart": get_cart(),
    }


@router.delete("/items/{product_id}")
def delete_cart_item(product_id: str):
    product = remove_from_cart(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    return {
        "action": "cart_updated",
        "item_removed": product,
        "cart": get_cart(),
    }


@router.post("/clear")
def clear_cart_items():
    return clear_cart()


@router.post("/checkout")
def checkout_cart():
    return checkout()
