import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Shield, TruckIcon } from 'lucide-react'

const Home = () => {
  return (
    <div className="home-page" data-testid="home-page">
      {/* Hero Section */}
      <section className="hero" data-testid="hero-section">
        <div className="hero-content">
          <h1 className="hero-title" data-testid="hero-title">
            Timeless Elegance
            <span className="hero-subtitle">Redefined</span>
          </h1>
          <p className="hero-description" data-testid="hero-description">
            Discover our curated collection of luxury fashion and accessories
          </p>
          <Link to="/shop" className="cta-button" data-testid="shop-now-button">
            Explore Collection
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features" data-testid="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card" data-testid="feature-quality">
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h3>Premium Quality</h3>
              <p>Hand-selected luxury pieces crafted with the finest materials</p>
            </div>
            
            <div className="feature-card" data-testid="feature-shipping">
              <div className="feature-icon">
                <TruckIcon size={32} />
              </div>
              <h3>Free Shipping</h3>
              <p>Complimentary worldwide delivery on all orders</p>
            </div>
            
            <div className="feature-card" data-testid="feature-secure">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Secure Shopping</h3>
              <p>Protected transactions and verified authenticity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="categories-preview" data-testid="categories-section">
        <div className="container">
          <h2 className="section-title" data-testid="categories-title">Shop by Category</h2>
          
          <div className="categories-grid">
            <Link to="/shop?category=Clothing" className="category-card" data-testid="category-clothing">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600" 
                alt="Clothing"
              />
              <div className="category-overlay">
                <h3>Clothing</h3>
              </div>
            </Link>
            
            <Link to="/shop?category=Accessories" className="category-card" data-testid="category-accessories">
              <img 
                src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600" 
                alt="Accessories"
              />
              <div className="category-overlay">
                <h3>Accessories</h3>
              </div>
            </Link>
            
            <Link to="/shop?category=Jewelry" className="category-card" data-testid="category-jewelry">
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600" 
                alt="Jewelry"
              />
              <div className="category-overlay">
                <h3>Jewelry</h3>
              </div>
            </Link>
            
            <Link to="/shop?category=Handbags" className="category-card" data-testid="category-handbags">
              <img 
                src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600" 
                alt="Handbags"
              />
              <div className="category-overlay">
                <h3>Handbags</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" data-testid="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 data-testid="cta-title">Experience Luxury</h2>
            <p data-testid="cta-description">Join our exclusive community and enjoy personalized shopping</p>
            <Link to="/auth" className="cta-button-secondary" data-testid="signup-button">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
