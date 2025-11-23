import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { formatPrice } from '../lib/utils'

const Cart = () => {
  const { cartItems, updateCartItem, removeFromCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="cart-page" data-testid="cart-page">
        <div className="container">
          <div className="empty-cart" data-testid="empty-cart-auth">
            <ShoppingBag size={64} />
            <h2>Please sign in to view your cart</h2>
            <Link to="/auth" className="cta-button" data-testid="signin-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page" data-testid="cart-page">
        <div className="container">
          <div className="empty-cart" data-testid="empty-cart">
            <ShoppingBag size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some luxury pieces to get started</p>
            <Link to="/shop" className="cta-button" data-testid="shop-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.products?.price || 0) * item.quantity,
    0
  )

  return (
    <div className="cart-page" data-testid="cart-page">
      <div className="container">
        <h1 className="page-title" data-testid="cart-title">Shopping Cart</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item" data-testid={`cart-item-${item.id}`}>
                <img
                  src={item.products?.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                  alt={item.products?.name}
                  className="cart-item-image"
                />
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name" data-testid="cart-item-name">{item.products?.name}</h3>
                  <p className="cart-item-category" data-testid="cart-item-category">{item.products?.category}</p>
                  <p className="cart-item-price" data-testid="cart-item-price">{formatPrice(item.products?.price)}</p>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-quantity-controls">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn-small"
                      data-testid={`decrease-qty-${item.id}`}
                    >
                      -
                    </button>
                    <span className="cart-quantity" data-testid={`item-quantity-${item.id}`}>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn-small"
                      data-testid={`increase-qty-${item.id}`}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-btn"
                    data-testid={`remove-item-${item.id}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary" data-testid="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span data-testid="cart-subtotal">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping" data-testid="shipping-cost">Free</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row summary-total">
              <span>Total</span>
              <span data-testid="cart-total">{formatPrice(subtotal)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="checkout-btn"
              data-testid="checkout-button"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </button>

            <Link to="/shop" className="continue-shopping" data-testid="continue-shopping-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
