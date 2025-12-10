"use client"

import { useState, useEffect } from "react"
import {
  FaHome,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBox,
  FaHeart,
  FaRegHeart,
  FaEllipsisV,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaPlus,
  FaMinus,
  FaTimes as FaClose,
  FaEdit,
  FaShoppingBag,
  FaComment,
} from "react-icons/fa"
import "./Dashboard.css"
import PlaceOrder from "./PlaceOrder"

const API_URL = "http://localhost:8000/api"

const Dashboard = ({ user, onLogout, products = [] }) => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [allProducts, setAllProducts] = useState(products || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" })
  const [userReviews, setUserReviews] = useState([])
  const [productReviews, setProductReviews] = useState([])
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false)

  const token = localStorage.getItem("token")

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products/`)
        if (response.ok) {
          const data = await response.json()
          setAllProducts(data)
        } else {
          console.error("Failed to fetch products")
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    if (allProducts.length === 0) {
      fetchProducts()
    }
  }, [allProducts.length])

  // Fetch user's orders
  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/orders/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch user's reviews
  useEffect(() => {
    if (token) {
      fetchUserReviews()
    }
  }, [token])

  const fetchUserReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUserReviews(data)
      } else {
        console.error("Failed to fetch user reviews")
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error)
    }
  }

  // Fetch product reviews when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      fetchProductReviews(selectedProduct.id)
    }
  }, [selectedProduct])

  const fetchProductReviews = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}/reviews/`)
      if (response.ok) {
        const data = await response.json()
        setProductReviews(data)
      } else {
        console.error("Failed to fetch product reviews")
      }
    } catch (error) {
      console.error("Error fetching product reviews:", error)
    }
  }

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart:", error)
        setCart([])
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if product is already in cart
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        // Increase quantity if already in cart
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Add new item with quantity 1
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })

    // Also update server-side cart if user is logged in
    if (token) {
      updateServerCart(product.id, 1, true)
    }
  }

  // Update server-side cart
  const updateServerCart = async (productId, quantity, isAdd = false) => {
    try {
      const method = isAdd ? "POST" : "PUT"
      const url = isAdd ? `${API_URL}/cart/` : `${API_URL}/cart/${productId}/`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          product: productId,
          quantity,
        }),
      })

      if (!response.ok) {
        console.error("Failed to update server cart")
      }
    } catch (error) {
      console.error("Error updating server cart:", error)
    }
  }

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))

    // Also update server-side cart if user is logged in
    if (token) {
      deleteFromServerCart(productId)
    }
  }

  // Delete from server-side cart
  const deleteFromServerCart = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        console.error("Failed to delete from server cart")
      }
    } catch (error) {
      console.error("Error deleting from server cart:", error)
    }
  }

  // Update product quantity in cart
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))

    // Also update server-side cart if user is logged in
    if (token) {
      updateServerCart(productId, newQuantity)
    }
  }

  // Get total number of items in cart
  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Get total price of items in cart
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 12.99) * item.quantity, 0).toFixed(2)
  }

  // Show product details modal
  const showProductDetails = (product) => {
    setSelectedProduct(product)
    setShowProductModal(true)

    // Reset review form
    const userReview = userReviews.find((review) => review.product === product.id)
    if (userReview) {
      setReviewData({
        rating: userReview.rating,
        comment: userReview.comment,
      })
    } else {
      setReviewData({ rating: 5, comment: "" })
    }
  }

  // Show order details modal
  const showOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  // Submit a review
  const submitReview = async () => {
    if (!selectedProduct) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          product: selectedProduct.id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Update user reviews
        fetchUserReviews()
        // Update product reviews
        fetchProductReviews(selectedProduct.id)
        setShowReviewModal(false)
        alert("Review submitted successfully!")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to submit review. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setError("An error occurred while submitting your review. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Place an order
  const placeOrder = async () => {
    if (cart.length === 0) return

    // Show the PlaceOrder component instead of directly submitting
    setShowPlaceOrderModal(true)
  }

  // Add this new function to handle the final order submission
  const submitOrder = async (orderData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          total_amount: Number.parseFloat(getCartTotal()),
          shipping_address: orderData.address,
          contact_number: orderData.contactNumber,
          full_name: orderData.fullName,
          comments: orderData.comments,
          location: orderData.location,
          items: cart.map((item) => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price || 12.99,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Clear cart
        setCart([])
        // Refresh orders
        fetchOrders()
        // Close the place order modal
        setShowPlaceOrderModal(false)
        alert("Order placed successfully!")
        setActiveTab("orders")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to place order. Please try again.")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      setError("An error occurred while placing your order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Cancel an order
  const cancelOrder = async (orderId) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/orders/${orderId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      })

      if (response.ok) {
        // Refresh orders
        fetchOrders()
        setShowOrderModal(false)
        alert("Order cancelled successfully!")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to cancel order. Please try again.")
      }
    } catch (error) {
      console.error("Error cancelling order:", error)
      setError("An error occurred while cancelling your order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Generate star rating component
  const renderStarRating = (rating, interactive = false) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        // Interactive stars for review form
        stars.push(
          <button
            key={i}
            type="button"
            className={`star-btn ${i <= reviewData.rating ? "filled" : "empty"}`}
            onClick={() => setReviewData({ ...reviewData, rating: i })}
          >
            {i <= reviewData.rating ? <FaStar /> : <FaRegStar />}
          </button>,
        )
      } else {
        // Display-only stars
        if (i <= fullStars) {
          stars.push(<FaStar key={i} className="star filled" />)
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(<FaStarHalfAlt key={i} className="star half" />)
        } else {
          stars.push(<FaRegStar key={i} className="star empty" />)
        }
      }
    }

    return <div className="star-rating">{stars}</div>
  }

  // Get user's first initial for avatar
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    } else if (user.username) {
      return user.username[0].toUpperCase()
    }
    return "U"
  }

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Error parsing favorites:", error)
        setFavorites([])
      }
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  // Toggle favorite status for a product
  const toggleFavorite = (productId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter((id) => id !== productId)
      } else {
        return [...prevFavorites, productId]
      }
    })
  }

  // Check if a product is favorited
  const isFavorite = (productId) => {
    return favorites.includes(productId)
  }

  // Get favorite products
  const getFavoriteProducts = () => {
    return allProducts.filter((product) => favorites.includes(product.id))
  }

  // Filter products by category and search term
  const getFilteredProducts = () => {
    let filtered = allProducts

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term),
      )
    }

    return filtered
  }

  // Get unique categories from products
  const categories = ["All", ...new Set(allProducts.map((product) => product.category))]

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "delivered"
      case "shipped":
        return "shipped"
      case "processing":
        return "processing"
      case "cancelled":
        return "cancelled"
      default:
        return "pending"
    }
  }

  // Get recent orders (last 3)
  const getRecentOrders = () => {
    return orders.slice(0, 3)
  }

  // Get cart items for dashboard display (last 3)
  const getRecentCartItems = () => {
    return cart.slice(0, 3)
  }

  return (
    <div className="dashboard-container">
      {/* Mobile menu toggle */}
      <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <img src="/images/hrs-logo.png" alt="HRS Foods" className="sidebar-logo" />
        </div>

        <div className="user-info">
          <div className="user-avatar">{getInitials()}</div>
          <div className="user-details">
            <h4>
              {user.first_name} {user.last_name}
            </h4>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaHome /> Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingBag /> My Orders
            {orders.length > 0 && <span className="badge">{orders.length}</span>}
          </button>
          <button
            className={`nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <FaBox /> Products
          </button>
          <button
            className={`nav-item ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            <FaHeart /> Favorites
            {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
          </button>
          <button className={`nav-item ${activeTab === "cart" ? "active" : ""}`} onClick={() => setActiveTab("cart")}>
            <FaShoppingCart /> My Cart
            {getCartItemsCount() > 0 && <span className="badge">{getCartItemsCount()}</span>}
          </button>
          <button
            className={`nav-item ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <FaComment /> My Reviews
            {userReviews.length > 0 && <span className="badge">{userReviews.length}</span>}
          </button>
          <button
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser /> Profile
          </button>
          <button className="nav-item logout" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="dashboard-content">
        {error && <div className="error-message global-error">{error}</div>}

        {activeTab === "dashboard" && (
          <>
            <h2>Welcome, {user.first_name || user.username}!</h2>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-value">{orders.length}</p>
              </div>
              <div className="stat-card">
                <h3>Cart Items</h3>
                <p className="stat-value">{getCartItemsCount()}</p>
              </div>
              <div className="stat-card">
                <h3>Favorites</h3>
                <p className="stat-value">{favorites.length}</p>
              </div>
              <div className="stat-card">
                <h3>Reward Points</h3>
                <p className="stat-value">{orders.length * 25}</p>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="dashboard-section">
              <div className="section-header">
                <h3>Recent Orders</h3>
                <button className="view-all-btn" onClick={() => setActiveTab("orders")}>
                  View All
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="empty-state">
                  <FaShoppingBag className="empty-icon" />
                  <p>You haven't placed any orders yet.</p>
                  <button className="browse-btn" onClick={() => setActiveTab("products")}>
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="order-cards">
                  {getRecentOrders().map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <h4>Order #{order.id}</h4>
                          <p className="order-date">{formatDate(order.created_at)}</p>
                        </div>
                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
                      </div>
                      <div className="order-card-content">
                        <p className="order-items">{order.item_count} items</p>
                        <p className="order-total">${order.total_amount}</p>
                      </div>
                      <button className="view-details-btn" onClick={() => showOrderDetails(order)}>
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Items Section */}
            <div className="dashboard-section">
              <div className="section-header">
                <h3>Items in Your Cart</h3>
                <button className="view-all-btn" onClick={() => setActiveTab("cart")}>
                  View All
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="empty-state">
                  <FaShoppingCart className="empty-icon" />
                  <p>Your cart is empty.</p>
                  <button className="browse-btn" onClick={() => setActiveTab("products")}>
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="cart-preview">
                  {getRecentCartItems().map((item) => (
                    <div key={item.id} className="cart-preview-item">
                      <div className="preview-item-image">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
                      </div>
                      <div className="preview-item-details">
                        <h4>{item.name}</h4>
                        <p className="preview-item-category">{item.category}</p>
                        <div className="preview-item-price-qty">
                          <p className="preview-item-price">${(item.price || 12.99).toFixed(2)}</p>
                          <p className="preview-item-qty">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="cart-preview-footer">
                    <p className="cart-preview-total">Total: ${getCartTotal()}</p>
                    <button className="checkout-btn-sm" onClick={() => setActiveTab("cart")}>
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Products */}
            <div className="dashboard-section">
              <div className="section-header">
                <h3>Recommended for You</h3>
                <button className="view-all-btn" onClick={() => setActiveTab("products")}>
                  View All
                </button>
              </div>
              <div className="product-grid">
                {allProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} />
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-category">{product.category}</p>
                      <p className="product-description">{product.description.substring(0, 60)}...</p>
                      <div className="product-price-rating">
                        <p className="product-price">${(product.price || 12.99).toFixed(2)}</p>
                        {renderStarRating(product.average_rating || 4.5)}
                      </div>
                      <div className="product-card-actions">
                        <button
                          className={`favorite-btn ${isFavorite(product.id) ? "favorited" : ""}`}
                          onClick={() => toggleFavorite(product.id)}
                        >
                          {isFavorite(product.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <button className="details-btn" onClick={() => showProductDetails(product)}>
                          <FaEllipsisV />
                        </button>
                        <button className="order-btn" onClick={() => addToCart(product)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "profile" && (
          <>
            <h2>Profile Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" defaultValue={user.first_name} />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" defaultValue={user.last_name} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" defaultValue={user.email} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" defaultValue={user.profile?.phone_number || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea id="address" defaultValue={user.profile?.address || ""}></textarea>
              </div>
              <button className="save-btn">Save Changes</button>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <h2>My Orders</h2>
            <p>View and track all your orders here.</p>

            {orders.length === 0 ? (
              <div className="empty-state">
                <FaShoppingBag className="empty-icon" />
                <p>You haven't placed any orders yet.</p>
                <button className="browse-btn" onClick={() => setActiveTab("products")}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-list-item">
                    <div className="order-list-header">
                      <div>
                        <h3>Order #{order.id}</h3>
                        <p className="order-date">{formatDate(order.created_at)}</p>
                      </div>
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
                    </div>
                    <div className="order-list-summary">
                      <div className="order-summary-item">
                        <span className="summary-label">Items:</span>
                        <span className="summary-value">{order.item_count}</span>
                      </div>
                      <div className="order-summary-item">
                        <span className="summary-label">Total:</span>
                        <span className="summary-value">${order.total_amount}</span>
                      </div>
                      <div className="order-summary-item">
                        <span className="summary-label">Address:</span>
                        <span className="summary-value address">{order.shipping_address}</span>
                      </div>
                    </div>
                    <div className="order-list-actions">
                      <button className="view-details-btn" onClick={() => showOrderDetails(order)}>
                        View Details
                      </button>
                      {order.status === "pending" && (
                        <button className="cancel-order-btn" onClick={() => cancelOrder(order.id)}>
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "products" && (
          <>
            <h2>Browse Products</h2>

            <div className="product-filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="category-filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-filter ${selectedCategory === category ? "active" : ""}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {getFilteredProducts().map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image || "/placeholder.svg"} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-category">{product.category}</p>
                    <p className="product-description">{product.description.substring(0, 60)}...</p>
                    <div className="product-price-rating">
                      <p className="product-price">${(product.price || 12.99).toFixed(2)}</p>
                      {renderStarRating(product.average_rating || 4.5)}
                    </div>
                    <div className="product-card-actions">
                      <button
                        className={`favorite-btn ${isFavorite(product.id) ? "favorited" : ""}`}
                        onClick={() => toggleFavorite(product.id)}
                      >
                        {isFavorite(product.id) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      <button className="details-btn" onClick={() => showProductDetails(product)}>
                        <FaEllipsisV />
                      </button>
                      <button className="order-btn" onClick={() => addToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredProducts().length === 0 && (
              <div className="no-results">
                <p>No products found matching your criteria.</p>
              </div>
            )}
          </>
        )}

        {activeTab === "favorites" && (
          <>
            <h2>My Favorites</h2>
            {favorites.length === 0 ? (
              <div className="empty-state">
                <FaHeart className="empty-icon" />
                <p>You haven't added any favorites yet.</p>
                <button className="browse-btn" onClick={() => setActiveTab("products")}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {getFavoriteProducts().map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} />
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-category">{product.category}</p>
                      <p className="product-description">{product.description.substring(0, 60)}...</p>
                      <div className="product-price-rating">
                        <p className="product-price">${(product.price || 12.99).toFixed(2)}</p>
                        {renderStarRating(product.average_rating || 4.5)}
                      </div>
                      <div className="product-card-actions">
                        <button
                          className={`favorite-btn ${isFavorite(product.id) ? "favorited" : ""}`}
                          onClick={() => toggleFavorite(product.id)}
                        >
                          {isFavorite(product.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <button className="details-btn" onClick={() => showProductDetails(product)}>
                          <FaEllipsisV />
                        </button>
                        <button className="order-btn" onClick={() => addToCart(product)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "cart" && (
          <>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="empty-state">
                <FaShoppingCart className="empty-icon" />
                <p>Your cart is empty.</p>
                <button className="browse-btn" onClick={() => setActiveTab("products")}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="cart-container">
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <h4>{item.name}</h4>
                        <p className="item-category">{item.category}</p>
                        <div className="item-price-quantity">
                          <p className="item-price">${(item.price || 12.99).toFixed(2)}</p>
                          <div className="quantity-controls">
                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                              <FaMinus />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                        <FaClose />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${getCartTotal()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${getCartTotal()}</span>
                  </div>
                  <button className="checkout-btn" onClick={placeOrder} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "reviews" && (
          <>
            <h2>My Reviews</h2>
            {userReviews.length === 0 ? (
              <div className="empty-state">
                <FaComment className="empty-icon" />
                <p>You haven't written any reviews yet.</p>
                <button className="browse-btn" onClick={() => setActiveTab("products")}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="reviews-list">
                {userReviews.map((review) => {
                  const product = allProducts.find((p) => p.id === review.product) || {}
                  return (
                    <div key={review.id} className="review-card">
                      <div className="review-product">
                        <img src={product.image || "/placeholder.svg"} alt={product.name} />
                        <div>
                          <h4>{product.name}</h4>
                          <p className="review-date">{formatDate(review.created_at)}</p>
                        </div>
                      </div>
                      <div className="review-content">
                        <div className="review-rating">{renderStarRating(review.rating)}</div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                      <div className="review-actions">
                        <button
                          className="edit-review-btn"
                          onClick={() => {
                            setSelectedProduct(product)
                            setReviewData({
                              rating: review.rating,
                              comment: review.comment,
                            })
                            setShowReviewModal(true)
                          }}
                        >
                          <FaEdit /> Edit Review
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Product Details Modal */}
        {showProductModal && selectedProduct && (
          <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowProductModal(false)}>
                <FaClose />
              </button>

              <div className="modal-content">
                <div className="modal-image">
                  <img src={selectedProduct.image || "/placeholder.svg"} alt={selectedProduct.name} />
                </div>

                <div className="modal-details">
                  <h2>{selectedProduct.name}</h2>
                  <p className="modal-category">{selectedProduct.category}</p>

                  <div className="modal-section">
                    <h3>Product Introduction</h3>
                    <p>{selectedProduct.description}</p>
                  </div>

                  <div className="modal-section">
                    <h3>Ingredients</h3>
                    <p>
                      Premium quality ingredients including fresh{" "}
                      {selectedProduct.category.includes("Chicken")
                        ? "chicken"
                        : selectedProduct.category.includes("Beef")
                          ? "beef"
                          : "vegetables"}
                      , authentic spices, and natural flavors. No artificial preservatives added.
                    </p>
                  </div>

                  <div className="modal-section">
                    <h3>Pricing</h3>
                    <div className="price-options">
                      <div className="price-option">
                        <span className="option-name">Regular Pack</span>
                        <span className="option-price">${(selectedProduct.price || 12.99).toFixed(2)}</span>
                      </div>
                      <div className="price-option">
                        <span className="option-name">Family Pack</span>
                        <span className="option-price">${((selectedProduct.price || 12.99) * 1.8).toFixed(2)}</span>
                      </div>
                      <div className="price-option">
                        <span className="option-name">Party Pack</span>
                        <span className="option-price">${((selectedProduct.price || 12.99) * 2.5).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section">
                    <div className="section-header">
                      <h3>Ratings & Reviews</h3>
                      <button className="write-review-btn" onClick={() => setShowReviewModal(true)}>
                        Write a Review
                      </button>
                    </div>
                    <div className="rating-summary">
                      {renderStarRating(selectedProduct.average_rating || 4.5)}
                      <span className="rating-text">
                        {selectedProduct.average_rating?.toFixed(1) || 4.5} out of 5 ({productReviews.length || 0}{" "}
                        reviews)
                      </span>
                    </div>
                    <div className="review-highlights">
                      {productReviews.length > 0 ? (
                        productReviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="review">
                            <div className="review-header">
                              <span className="reviewer">{review.user_name}</span>
                              {renderStarRating(review.rating)}
                            </div>
                            <p>{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                      )}
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        addToCart(selectedProduct)
                        setShowProductModal(false)
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowOrderModal(false)}>
                <FaClose />
              </button>

              <div className="modal-content">
                <div className="order-modal-header">
                  <div>
                    <h2>Order #{selectedOrder.id}</h2>
                    <p className="order-date">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="order-modal-section">
                  <h3>Order Items</h3>
                  <div className="order-items-list">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="order-item-image">
                          <img src={item.product_image || "/placeholder.svg"} alt={item.product_name} />
                        </div>
                        <div className="order-item-details">
                          <h4>{item.product_name}</h4>
                          <div className="order-item-price-qty">
                            <p className="order-item-price">${item.price.toFixed(2)}</p>
                            <p className="order-item-qty">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="order-item-total">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-modal-section">
                  <h3>Shipping Address</h3>
                  <p className="shipping-address">{selectedOrder.shipping_address}</p>
                </div>

                <div className="order-modal-section">
                  <h3>Order Summary</h3>
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${selectedOrder.total_amount}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>${selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </div>

                <div className="order-modal-actions">
                  {selectedOrder.status === "pending" && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => cancelOrder(selectedOrder.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Cancel Order"}
                    </button>
                  )}
                  <button className="close-btn" onClick={() => setShowOrderModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedProduct && (
          <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowReviewModal(false)}>
                <FaClose />
              </button>

              <div className="modal-content">
                <h2>Review {selectedProduct.name}</h2>

                <div className="review-form">
                  <div className="review-form-product">
                    <img src={selectedProduct.image || "/placeholder.svg"} alt={selectedProduct.name} />
                    <div>
                      <h4>{selectedProduct.name}</h4>
                      <p className="product-category">{selectedProduct.category}</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Your Rating</label>
                    <div className="rating-input">{renderStarRating(reviewData.rating, true)}</div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reviewComment">Your Review</label>
                    <textarea
                      id="reviewComment"
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      rows={5}
                    ></textarea>
                  </div>

                  {error && <p className="error-message">{error}</p>}

                  <div className="review-form-actions">
                    <button
                      className="submit-review-btn"
                      onClick={submitReview}
                      disabled={isLoading || !reviewData.comment.trim()}
                    >
                      {isLoading ? "Submitting..." : "Submit Review"}
                    </button>
                    <button className="cancel-btn" onClick={() => setShowReviewModal(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Place Order Modal */}
        {showPlaceOrderModal && (
          <PlaceOrder 
            cart={cart} 
            user={user} 
            onBack={() => setShowPlaceOrderModal(false)} 
            onSubmit={submitOrder} 
          />
        )}
      </main>
    </div>
  )
}

export default Dashboard