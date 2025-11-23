import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { toast } from 'sonner'

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart')
      navigate('/auth')
      return
    }

    try {
      await addToCart(product.id, quantity)
      toast.success('Added to cart')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  if (loading) {
    return <div className="loading" data-testid="loading">Loading...</div>
  }

  if (!product) {
    return <div className="error" data-testid="error">Product not found</div>
  }

  return (
    <div className="product-detail-page" data-testid="product-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button" data-testid="back-button">
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="product-detail-grid">
          {/* Product Image */}
          <div className="product-image-section">
            <img 
              src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'} 
              alt={product.name}
              className="product-detail-image"
              data-testid="product-image"
            />
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-category-badge" data-testid="product-category">{product.category}</div>
            <h1 className="product-detail-title" data-testid="product-title">{product.name}</h1>
            <div className="product-price-large" data-testid="product-price">${product.price.toFixed(2)}</div>
            
            <div className="product-stock" data-testid="product-stock">
              {product.stock > 0 ? (
                <>
                  <Check size={18} className="stock-icon" />
                  <span>{product.stock} in stock</span>
                </>
              ) : (
                <span className="out-of-stock">Out of stock</span>
              )}
            </div>

            <div className="product-description-section">
              <h3>Description</h3>
              <p data-testid="product-description">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                  data-testid="decrease-quantity"
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                  data-testid="quantity-input"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="quantity-btn"
                  data-testid="increase-quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="add-to-cart-large"
              data-testid="add-to-cart-button"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature-item">
                <Check size={16} />
                <span>Free worldwide shipping</span>
              </div>
              <div className="feature-item">
                <Check size={16} />
                <span>Secure payment</span>
              </div>
              <div className="feature-item">
                <Check size={16} />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
