import React, { createContext, useState, useEffect, useContext } from 'react'
import { useAuth } from './AuthContext'
import axios from 'axios'

const CartContext = createContext()

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const { user, session } = useAuth()

  useEffect(() => {
    if (user && session) {
      fetchCart()
    } else {
      setCartItems([])
      setCartCount(0)
    }
  }, [user, session])

  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    setCartCount(count)
  }, [cartItems])

  const fetchCart = async () => {
    if (!session) return

    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      setCartItems(response.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!session) {
      throw new Error('Please sign in to add items to cart')
    }

    try {
      await axios.post(
        `${API_URL}/cart`,
        { product_id: productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )
      await fetchCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    if (!session) return

    try {
      await axios.put(
        `${API_URL}/cart/${itemId}?quantity=${quantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )
      await fetchCart()
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    }
  }

  const removeFromCart = async (itemId) => {
    if (!session) return

    try {
      await axios.delete(`${API_URL}/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      await fetchCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const value = {
    cartItems,
    cartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
