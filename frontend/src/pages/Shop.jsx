import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { Search } from 'lucide-react'

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`

const Shop = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')

  const categories = ['All', 'Clothing', 'Accessories', 'Jewelry', 'Handbags', 'Footwear']

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchTerm])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let url = `${API_URL}/products?limit=50`
      
      if (selectedCategory !== 'All') {
        url += `&category=${selectedCategory}`
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`
      }

      const response = await axios.get(url)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  return (
    <div className="shop-page" data-testid="shop-page">
      <div className="container">
        {/* Page Header */}
        <div className="shop-header">
          <h1 className="page-title" data-testid="shop-title">Our Collection</h1>
          <p className="page-subtitle" data-testid="shop-subtitle">Discover timeless pieces for every occasion</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-bar" data-testid="search-form">
          <div className="search-input-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              data-testid="search-input"
            />
          </div>
        </form>

        {/* Category Filter */}
        <div className="category-filter" data-testid="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              data-testid={`category-btn-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading" data-testid="loading-spinner">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products" data-testid="no-products">No products found</div>
        ) : (
          <div className="products-grid" data-testid="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop
