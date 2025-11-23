import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="footer" data-testid="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section">
            <img 
              src="https://customer-assets.emergentagent.com/job_41d2a091-3c44-4b66-919b-1a496eff6acf/artifacts/817aex0s_ChatGPT%20Image%20Nov%2023%2C%202025%2C%2006_48_57%20PM.png"
              alt="Vélora"
              className="footer-logo"
            />
            <p className="footer-tagline">Premium luxury fashion & accessories</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h3 className="footer-title">Customer Service</h3>
            <ul className="footer-links">
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-section">
            <h3 className="footer-title">Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link" data-testid="instagram-link">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link" data-testid="facebook-link">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" data-testid="twitter-link">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Vélora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
