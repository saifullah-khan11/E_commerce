from fastapi import FastAPI, APIRouter, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import logging
from supabase import create_client, Client
from config import settings
from auth import get_current_user, get_supabase_client

app = FastAPI(
    title="Vélora E-Commerce API",
    description="Premium e-commerce backend with Supabase"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# Pydantic Models
class Product(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    image_url: Optional[str] = None
    category: Optional[str] = None

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    shipping_address: str
    payment_method: str = "credit_card"

# Health Check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Vélora API"}

# Products Endpoints
@api_router.get("/products", response_model=List[Product])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """Get all products with optional filtering"""
    supabase: Client = get_supabase_client()
    
    query = supabase.table("products").select("*")
    
    if category:
        query = query.eq("category", category)
    
    if search:
        query = query.ilike("name", f"%{search}%")
    
    response = query.range(skip, skip + limit - 1).execute()
    
    return response.data if response.data else []

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Get a specific product by ID"""
    supabase: Client = get_supabase_client()
    
    response = supabase.table("products").select("*").eq("id", product_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return response.data[0]

@api_router.get("/products/category/{category}")
async def get_products_by_category(category: str):
    """Get products by category"""
    supabase: Client = get_supabase_client()
    
    response = supabase.table("products").select("*").eq("category", category).execute()
    
    return response.data if response.data else []

# Cart Endpoints
@api_router.get("/cart")
async def get_cart_items(current_user: dict = Depends(get_current_user)):
    """Get all items in the user's cart"""
    supabase: Client = get_supabase_client()
    
    # Get user's cart
    cart_response = supabase.table("carts").select("id").eq(
        "user_id", current_user["user_id"]
    ).execute()
    
    if not cart_response.data or len(cart_response.data) == 0:
        return []
    
    cart_id = cart_response.data[0]["id"]
    
    # Get cart items with product details
    items_response = supabase.table("cart_items").select(
        "*, products(*)"
    ).eq("cart_id", cart_id).execute()
    
    return items_response.data if items_response.data else []

@api_router.post("/cart")
async def add_to_cart(
    item: CartItemCreate,
    current_user: dict = Depends(get_current_user)
):
    """Add item to cart"""
    supabase: Client = get_supabase_client()
    
    # Get or create user's cart
    cart_response = supabase.table("carts").select("id").eq(
        "user_id", current_user["user_id"]
    ).execute()
    
    if not cart_response.data or len(cart_response.data) == 0:
        # Create cart if it doesn't exist
        cart_response = supabase.table("carts").insert({
            "user_id": current_user["user_id"]
        }).execute()
        cart_id = cart_response.data[0]["id"]
    else:
        cart_id = cart_response.data[0]["id"]
    
    # Check if item already exists in cart
    existing_item = supabase.table("cart_items").select("*").eq(
        "cart_id", cart_id
    ).eq("product_id", item.product_id).execute()
    
    if existing_item.data and len(existing_item.data) > 0:
        # Update quantity
        response = supabase.table("cart_items").update({
            "quantity": existing_item.data[0]["quantity"] + item.quantity
        }).eq("id", existing_item.data[0]["id"]).execute()
    else:
        # Add new item
        response = supabase.table("cart_items").insert({
            "cart_id": cart_id,
            "product_id": item.product_id,
            "quantity": item.quantity
        }).execute()
    
    return {"message": "Item added to cart", "data": response.data}

@api_router.put("/cart/{item_id}")
async def update_cart_item(
    item_id: int,
    quantity: int,
    current_user: dict = Depends(get_current_user)
):
    """Update cart item quantity"""
    supabase: Client = get_supabase_client()
    
    response = supabase.table("cart_items").update({
        "quantity": quantity
    }).eq("id", item_id).execute()
    
    return {"message": "Cart item updated", "data": response.data}

@api_router.delete("/cart/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Remove item from cart"""
    supabase: Client = get_supabase_client()
    
    response = supabase.table("cart_items").delete().eq("id", item_id).execute()
    
    return {"message": "Item removed from cart"}

# Orders Endpoints
@api_router.post("/orders/checkout")
async def checkout(
    order_data: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    """Process checkout and create order"""
    supabase: Client = get_supabase_client()
    
    # Get user's cart
    cart_response = supabase.table("carts").select("id").eq(
        "user_id", current_user["user_id"]
    ).execute()
    
    if not cart_response.data or len(cart_response.data) == 0:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Get cart items with products
    items_response = supabase.table("cart_items").select(
        "*, products(price)"
    ).eq("cart_id", cart_response.data[0]["id"]).execute()
    
    if not items_response.data or len(items_response.data) == 0:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate total
    total_amount = sum(
        item["quantity"] * item["products"]["price"]
        for item in items_response.data
    )
    
    # Create order
    order_response = supabase.table("orders").insert({
        "user_id": current_user["user_id"],
        "total_amount": total_amount,
        "status": "pending"
    }).execute()
    
    if not order_response.data:
        raise HTTPException(status_code=400, detail="Failed to create order")
    
    order_id = order_response.data[0]["id"]
    
    # Create order items
    for item in items_response.data:
        supabase.table("order_items").insert({
            "order_id": order_id,
            "product_id": item["product_id"],
            "quantity": item["quantity"],
            "price_at_purchase": item["products"]["price"]
        }).execute()
    
    # Clear cart
    supabase.table("cart_items").delete().eq(
        "cart_id", cart_response.data[0]["id"]
    ).execute()
    
    return order_response.data[0]

@api_router.get("/orders")
async def get_orders(
    current_user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20
):
    """Get user's orders"""
    supabase: Client = get_supabase_client()
    
    response = supabase.table("orders").select("*").eq(
        "user_id", current_user["user_id"]
    ).range(skip, skip + limit - 1).order("created_at", desc=True).execute()
    
    return response.data if response.data else []

@api_router.get("/orders/{order_id}")
async def get_order(
    order_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get specific order details"""
    supabase: Client = get_supabase_client()
    
    response = supabase.table("orders").select(
        "*, order_items(*, products(*))"
    ).eq("id", order_id).eq(
        "user_id", current_user["user_id"]
    ).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return response.data[0]

app.include_router(api_router)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
