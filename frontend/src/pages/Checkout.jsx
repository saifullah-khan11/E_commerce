import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { toast } from 'sonner'
import { CreditCard, Lock } from 'lucide-react'
import { formatPrice } from '../lib/utils'

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`

const Checkout = () => {
  const { cartItems, clearCart, refreshCart } = useCart()
  const { user, session } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  })

  if (!user) {
    navigate('/auth')
    return null
  }

  if (!cartItems || cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.products?.price || 0) * item.quantity,
    0
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`
      
      const response = await axios.post(
        `${API_URL}/orders/checkout`,
        {
          shipping_address: shippingAddress,
          payment_method: 'credit_card',
        },
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )

      toast.success('Order placed successfully!')
      await refreshCart()
      navigate('/orders')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page" data-testid="checkout-page">
      <div className="container">
        <h1 className="page-title" data-testid="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form" data-testid="checkout-form">
              <div className="form-section">
                <h2>Shipping Information</h2>
                
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="form-input"
                    data-testid="fullname-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    data-testid="email-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="form-input"
                    data-testid="address-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="form-input"
                      data-testid="city-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="form-input"
                      data-testid="postal-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="form-input"
                    data-testid="country-input"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-info" data-testid="payment-info">
                  <CreditCard size={24} />
                  <div>
                    <p>Credit Card (Demo Mode)</p>
                    <p className="payment-note">No actual payment will be processed</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="place-order-btn"
                data-testid="place-order-button"
              >
                <Lock size={20} />
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary" data-testid="checkout-summary">
            <h2>Order Summary</h2>
            
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item" data-testid={`checkout-item-${item.id}`}>
                  <img
                    src={item.products?.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    alt={item.products?.name}
                  />
                  <div className="checkout-item-info">
                    <p className="item-name">{item.products?.name}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">${((item.products?.price || 0) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span data-testid="checkout-subtotal">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping" data-testid="checkout-shipping">Free</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row summary-total">
              <span>Total</span>
              <span data-testid="checkout-total">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
