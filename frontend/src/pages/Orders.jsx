import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { Package, Calendar } from 'lucide-react'
import { formatPrice } from '../lib/utils'

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`

const Orders = () => {
  const { user, session } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading" data-testid="loading">Loading orders...</div>
  }

  return (
    <div className="orders-page" data-testid="orders-page">
      <div className="container">
        <h1 className="page-title" data-testid="orders-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders" data-testid="no-orders">
            <Package size={64} />
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="orders-list" data-testid="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card" data-testid={`order-${order.id}`}>
                <div className="order-header">
                  <div>
                    <h3 data-testid={`order-number-${order.id}`}>Order #{order.id}</h3>
                    <p className="order-date" data-testid={`order-date-${order.id}`}>
                      <Calendar size={16} />
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status" data-testid={`order-status-${order.id}`}>
                    {order.status}
                  </div>
                </div>
                <div className="order-total" data-testid={`order-total-${order.id}`}>
                  Total: ${order.total_amount?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
