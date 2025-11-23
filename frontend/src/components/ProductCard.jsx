import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { toast } from 'sonner'
import { formatPrice } from '../lib/utils'

const ProductCard = ({ product }) => {
  const { user } = useAuth()
  const { addToCart } = useCart()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to add items to cart')
      return
    }

    try {
      await addToCart(product.id)
      toast.success('Added to cart')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card" data-testid={`product-card-${product.id}`}>
      <div className="product-image-container">
        <img 
          src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} 
          alt={product.name}
          className="product-image"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="product-badge" data-testid="low-stock-badge">Limited Stock</span>
        )}
        {product.stock === 0 && (
          <span className="product-badge sold-out" data-testid="sold-out-badge">Sold Out</span>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-category" data-testid="product-category">{product.category}</div>
        <h3 className="product-name" data-testid="product-name">{product.name}</h3>
        <p className="product-description" data-testid="product-description">
          {product.description?.substring(0, 60)}{product.description?.length > 60 ? '...' : ''}
        </p>
        
        <div className="product-footer">
          <span className="product-price" data-testid="product-price">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="add-to-cart-btn"
            data-testid={`add-to-cart-btn-${product.id}`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
