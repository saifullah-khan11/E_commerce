import React from 'react'
import { Award, Heart, Globe } from 'lucide-react'

const About = () => {
  return (
    <div className="about-page" data-testid="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1 className="page-title" data-testid="about-title">About Vélora</h1>
          <p className="page-subtitle" data-testid="about-subtitle">
            Curating timeless luxury since 2025
          </p>
        </section>

        {/* Story Section */}
        <section className="about-story" data-testid="about-story">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Vélora was born from a passion for timeless elegance and exceptional craftsmanship. 
              We believe that true luxury transcends trends, focusing instead on pieces that tell 
              a story and stand the test of time.
            </p>
            <p>
              Each item in our collection is carefully selected for its quality, design, and the 
              artistry behind it. From Italian leather goods to hand-crafted jewelry, every piece 
              embodies our commitment to excellence.
            </p>
          </div>
          <div className="story-image">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800" 
              alt="Vélora Store"
            />
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values" data-testid="about-values">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card" data-testid="value-quality">
              <div className="value-icon">
                <Award size={40} />
              </div>
              <h3>Quality First</h3>
              <p>
                We partner with renowned artisans and brands that share our commitment 
                to exceptional quality and craftsmanship.
              </p>
            </div>

            <div className="value-card" data-testid="value-passion">
              <div className="value-icon">
                <Heart size={40} />
              </div>
              <h3>Passion for Excellence</h3>
              <p>
                Every piece is selected with care and attention to detail, ensuring 
                it meets our exacting standards.
              </p>
            </div>

            <div className="value-card" data-testid="value-sustainability">
              <div className="value-icon">
                <Globe size={40} />
              </div>
              <h3>Sustainable Luxury</h3>
              <p>
                We believe in responsible luxury, working with brands that prioritize 
                ethical practices and sustainability.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta" data-testid="about-cta">
          <h2>Experience the Vélora Difference</h2>
          <p>Discover pieces that will become treasured parts of your collection</p>
        </section>
      </div>
    </div>
  )
}

export default About
