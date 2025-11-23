import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="header" data-testid="main-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" data-testid="logo-link">
          <img 
            src="https://customer-assets.emergentagent.com/job_41d2a091-3c44-4b66-919b-1a496eff6acf/artifacts/817aex0s_ChatGPT%20Image%20Nov%2023%2C%202025%2C%2006_48_57%20PM.png"
            alt="Vélora"
            className="logo-image"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" data-testid="desktop-nav">
          <Link to="/" className="nav-link" data-testid="home-link">Home</Link>
          <Link to="/shop" className="nav-link" data-testid="shop-link">Shop</Link>
          <Link to="/about" className="nav-link" data-testid="about-link">About</Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {user ? (
            <>
              <button 
                onClick={handleSignOut} 
                className="icon-button"
                data-testid="signout-button"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
              <Link to="/cart" className="cart-button" data-testid="cart-button">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="cart-count" data-testid="cart-count">{cartCount}</span>
                )}
              </Link>
            </>
          ) : (
            <Link to="/auth" className="icon-button" data-testid="auth-link">
              <User size={20} />
            </Link>
          )}
          
          <button 
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="mobile-nav" data-testid="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
        </nav>
      )}
    </header>
  )
}

export default Header
