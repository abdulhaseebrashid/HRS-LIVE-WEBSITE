"use client"

import { useState } from "react"
import {
  FaHome,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBox,
  FaUsers,
  FaChartLine,
  FaCog,
  FaShieldAlt,
} from "react-icons/fa"
import "./Dashboard.css"

const AdminDashboard = ({ user, onLogout, products = [] }) => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Get user's first initial for avatar
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    } else if (user.username) {
      return user.username[0].toUpperCase()
    }
    return "A"
  }

  // Sample data for admin dashboard
  const recentOrders = [
    { id: "ORD-1234", date: "2025-05-08", customer: "John Doe", total: "$45.99", status: "Delivered" },
    { id: "ORD-1235", date: "2025-05-10", customer: "Sarah Smith", total: "$32.50", status: "Processing" },
    { id: "ORD-1236", date: "2025-05-11", customer: "Mike Johnson", total: "$78.25", status: "Processing" },
    { id: "ORD-1237", date: "2025-05-11", customer: "Emily Brown", total: "$54.75", status: "Pending" },
    { id: "ORD-1238", date: "2025-05-12", customer: "Alex Wilson", total: "$22.99", status: "Delivered" },
  ]

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", joined: "2025-05-01", orders: 5 },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", joined: "2025-05-03", orders: 3 },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", joined: "2025-05-05", orders: 2 },
    { id: 4, name: "Emily Brown", email: "emily@example.com", joined: "2025-05-08", orders: 1 },
  ]

  const productInventory = products.map((product) => ({
    ...product,
    stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-109
    sold: Math.floor(Math.random() * 50) + 5, // Random sold between 5-54
  }))

  return (
    <div className="dashboard-container">
      {/* Mobile menu toggle */}
      <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <img src="/images/hrs-logo.png" alt="HRS Foods" className="sidebar-logo" />
        </div>

        <div className="user-info admin-user">
          <div className="user-avatar admin-avatar">{getInitials()}</div>
          <div className="user-details">
            <h4>
              {user.first_name} {user.last_name}
            </h4>
            <p className="admin-badge">
              <FaShieldAlt /> Administrator
            </p>
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
            <FaShoppingCart /> Orders
          </button>
          <button
            className={`nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <FaBox /> Products
          </button>
          <button className={`nav-item ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            <FaUsers /> Users
          </button>
          <button
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <FaChartLine /> Analytics
          </button>
          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog /> Settings
          </button>
          <button className="nav-item logout" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="dashboard-content">
        {activeTab === "dashboard" && (
          <>
            <div className="admin-header">
              <h2>Admin Dashboard</h2>
              <p className="welcome-message">Welcome Admin to HRS Foods</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-value">124</p>
              </div>
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">48</p>
              </div>
              <div className="stat-card">
                <h3>Total Products</h3>
                <p className="stat-value">{products.length}</p>
              </div>
              <div className="stat-card">
                <h3>Revenue</h3>
                <p className="stat-value">$4,582</p>
              </div>
            </div>

            <div className="admin-sections">
              <div className="admin-section">
                <div className="section-header">
                  <h3>Recent Orders</h3>
                  <button className="view-all-btn" onClick={() => setActiveTab("orders")}>
                    View All
                  </button>
                </div>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.date}</td>
                        <td>{order.customer}</td>
                        <td>{order.total}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              order.status.toLowerCase() === "delivered"
                                ? "delivered"
                                : order.status.toLowerCase() === "processing"
                                  ? "processing"
                                  : "pending"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button className="view-btn">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-section">
                <div className="section-header">
                  <h3>Recent Users</h3>
                  <button className="view-all-btn" onClick={() => setActiveTab("users")}>
                    View All
                  </button>
                </div>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Orders</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.joined}</td>
                        <td>{user.orders}</td>
                        <td>
                          <button className="view-btn">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <h2>Order Management</h2>
            <p>View and manage all customer orders.</p>
            <div className="filter-controls">
              <input type="text" placeholder="Search orders..." className="search-input" />
              <select className="filter-select">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="filter-btn">Filter</button>
            </div>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.customer}</td>
                    <td>Multiple items</td>
                    <td>{order.total}</td>
                    <td>
                      <select className="status-select" defaultValue={order.status.toLowerCase()}>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-btn">View</button>
                        <button className="edit-btn">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "products" && (
          <>
            <h2>Product Management</h2>
            <p>Manage your product inventory and listings.</p>
            <div className="admin-actions">
              <button className="add-btn">Add New Product</button>
            </div>
            <div className="filter-controls">
              <input type="text" placeholder="Search products..." className="search-input" />
              <select className="filter-select">
                <option value="all">All Categories</option>
                <option value="chicken">Premium Chicken Product</option>
                <option value="samosa">Samosa and Roll</option>
                <option value="beef">Beef Special</option>
                <option value="fries">Fries</option>
              </select>
              <button className="filter-btn">Filter</button>
            </div>
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productInventory.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-thumbnail" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{product.sold}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "users" && (
          <>
            <h2>User Management</h2>
            <p>Manage user accounts and permissions.</p>
            <div className="filter-controls">
              <input type="text" placeholder="Search users..." className="search-input" />
              <select className="filter-select">
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="customer">Customers</option>
              </select>
              <button className="filter-btn">Filter</button>
            </div>
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 0,
                    name: "Admin User",
                    email: "admin@hrsfoods.com",
                    role: "Admin",
                    joined: "2025-01-01",
                    orders: 0,
                  },
                  ...recentUsers.map((user) => ({ ...user, role: "Customer" })),
                ].map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
                    </td>
                    <td>{user.joined}</td>
                    <td>{user.orders}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-btn">View</button>
                        <button className="edit-btn">Edit</button>
                        {user.role !== "Admin" && <button className="delete-btn">Delete</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "analytics" && (
          <>
            <h2>Analytics</h2>
            <p>View sales and performance metrics.</p>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Sales</h3>
                <p className="stat-value">$4,582</p>
                <p className="stat-change positive">+12% from last month</p>
              </div>
              <div className="stat-card">
                <h3>Orders</h3>
                <p className="stat-value">124</p>
                <p className="stat-change positive">+8% from last month</p>
              </div>
              <div className="stat-card">
                <h3>Average Order Value</h3>
                <p className="stat-value">$36.95</p>
                <p className="stat-change positive">+3% from last month</p>
              </div>
              <div className="stat-card">
                <h3>New Customers</h3>
                <p className="stat-value">18</p>
                <p className="stat-change negative">-5% from last month</p>
              </div>
            </div>
            <div className="chart-container">
              <h3>Sales Overview</h3>
              <div className="chart-placeholder">
                <p>Sales chart would be displayed here</p>
              </div>
            </div>
            <div className="admin-sections">
              <div className="admin-section">
                <h3>Top Selling Products</h3>
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productInventory
                      .slice(0, 5)
                      .sort((a, b) => b.sold - a.sold)
                      .map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>{product.sold}</td>
                          <td>${(product.sold * 12.99).toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <h2>System Settings</h2>
            <p>Configure system settings and preferences.</p>
            <div className="settings-form">
              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="form-group">
                  <label htmlFor="siteName">Site Name</label>
                  <input type="text" id="siteName" defaultValue="HRS Foods" />
                </div>
                <div className="form-group">
                  <label htmlFor="siteDescription">Site Description</label>
                  <textarea
                    id="siteDescription"
                    defaultValue="Premium frozen food products for your convenience."
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="contactEmail">Contact Email</label>
                  <input type="email" id="contactEmail" defaultValue="info@hrsfoods.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="contactPhone">Contact Phone</label>
                  <input type="tel" id="contactPhone" defaultValue="+92 317-6000811" />
                </div>
              </div>

              <div className="settings-section">
                <h3>Order Settings</h3>
                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <select id="currency" defaultValue="USD">
                    <option value="USD">USD ($)</option>
                    <option value="PKR">PKR (₨)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="taxRate">Tax Rate (%)</label>
                  <input type="number" id="taxRate" defaultValue="5" min="0" max="100" />
                </div>
                <div className="form-group">
                  <label htmlFor="shippingFee">Shipping Fee</label>
                  <input type="number" id="shippingFee" defaultValue="0" min="0" />
                </div>
              </div>

              <button className="save-btn">Save Changes</button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
