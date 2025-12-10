import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaUser, FaPhone, FaHome, FaComment, FaMinus, FaPlus, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import "./PlaceOrder.css";

// Import Leaflet directly into component
// Note: Add this in your main component or entry file, not in each component
// import 'leaflet/dist/leaflet.css';

const PlaceOrder = ({ cart, onBack, onSubmit, user = {} }) => {
  const [formData, setFormData] = useState({
    fullName: user.first_name ? `${user.first_name} ${user.last_name}` : "",
    contactNumber: user.profile?.phone_number || "",
    address: user.profile?.address || "",
    comments: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mapVisible, setMapVisible] = useState(true); // Set to true by default
  const [userLocation, setUserLocation] = useState({
    lat: 51.505,
    lng: -0.09
  });
  
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);

  // Load Leaflet script dynamically
  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) return;

    // Create script tag for Leaflet
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;
    
    // Create link tag for Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';

    // Append to head
    document.head.appendChild(link);
    document.body.appendChild(script);

    return () => {
      // Clean up on component unmount
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  // Initialize map with a slight delay to ensure DOM is ready
  useEffect(() => {
    if (!mapVisible) return;
    
    // Ensure we have access to the Leaflet library
    const initializeMap = () => {
      if (!window.L) {
        console.error("Leaflet library not loaded");
        return;
      }
      
      // Check if map is already initialized
      if (mapRef.current) return;
      
      // Check if container exists
      if (!mapContainerRef.current) {
        console.error("Map container element not found");
        return;
      }
      
      // Force the height of the container to ensure visibility
      mapContainerRef.current.style.height = '300px';
      
      console.log("Initializing map...");
      
      // Initialize the map
      try {
        mapRef.current = window.L.map(mapContainerRef.current).setView([userLocation.lat, userLocation.lng], 13);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);
        
        // Add marker
        markerRef.current = window.L.marker([userLocation.lat, userLocation.lng], {
          draggable: true
        }).addTo(mapRef.current)
          .bindPopup('Drag to set your location')
          .openPopup();
        
        // Event listener for marker movement
        markerRef.current.on('dragend', async function(e) {
          const marker = e.target;
          const position = marker.getLatLng();
          
          setUserLocation({
            lat: position.lat,
            lng: position.lng
          });
          
          // Fetch address from coordinates
          await reverseGeocode(position.lat, position.lng);
        });
        
        // Click handler for map
        mapRef.current.on('click', async function(e) {
          const position = e.latlng;
          
          // Update marker position
          markerRef.current.setLatLng(position);
          
          setUserLocation({
            lat: position.lat,
            lng: position.lng
          });
          
          // Fetch address from coordinates
          await reverseGeocode(position.lat, position.lng);
        });
        
        console.log("Map initialized successfully");
        
        // Force a resize after a slight delay to handle any rendering issues
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 100);
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to load the map. Please try again later.");
      }
    };
    
    // Delay initialization slightly to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeMap();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      // Clean up map when component unmounts
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapVisible, userLocation.lat, userLocation.lng]);

  // Ensure map resizes properly when it becomes visible
  useEffect(() => {
    if (mapVisible && mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [mapVisible]);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          setUserLocation({
            lat: latitude,
            lng: longitude
          });
          
          // Update map view and marker
          if (mapRef.current && markerRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
            markerRef.current.setLatLng([latitude, longitude]);
            
            // Get address from coordinates
            reverseGeocode(latitude, longitude);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your current location. Please select manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Convert coordinates to address using OpenStreetMap Nominatim API
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      );
      
      const data = await response.json();
      
      if (data && data.display_name) {
        // Update address in form
        setFormData((prev) => ({
          ...prev,
          address: data.display_name,
        }));
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
    }
  };

  // Toggle map visibility
  const toggleMap = () => {
    setMapVisible(!mapVisible);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validate form
    if (!formData.fullName || !formData.contactNumber || !formData.address) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Create order data
    const orderData = {
      shipping_address: formData.address,
      total_amount: parseFloat(getCartTotal()),
      status: "pending",
      // Include customer information for email
      fullName: formData.fullName,
      contactNumber: formData.contactNumber,
      address: formData.address,
      comments: formData.comments,
      // Include location data
      location: userLocation,
    };

    try {
      // Submit order
      const result = await onSubmit(orderData);
      
      // Show success message
      setSuccess("Your order has been placed successfully! You will receive a confirmation email shortly. Please wait 30 minutes for delivery.");
      
      // Clear form after successful submission
      setTimeout(() => {
        onBack(); // Go back to previous screen after showing success message
      }, 5000);
    } catch (error) {
      setError("Failed to place your order. Please try again.");
      console.error("Order submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total price
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 12.99) * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-content place-order-content">
          <h2 className="place-order-title">Complete Your Order</h2>
          
          <div className="back-to-cart">
            <button onClick={onBack} className="back-button">
              <FaArrowLeft className="back-icon" /> Back to Cart
            </button>
          </div>

          {/* Success Message */}
          {success && <div className="success-message">{success}</div>}
          
          {/* Cart Items */}
          <div className="place-order-cart-items">
            {cart.map((item) => (
              <div key={item.id} className="place-order-cart-item">
                <div className="place-order-item-image">
                  <img 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.name} 
                    className="place-order-item-img"
                  />
                </div>
                <div className="place-order-item-details">
                  <h3 className="place-order-item-name">{item.name}</h3>
                  <p className="place-order-item-category">Premium Chicken Product</p>
                </div>
                <div className="place-order-item-quantity">
                  <button className="quantity-button minus">−</button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button className="quantity-button plus">+</button>
                </div>
                <div className="place-order-item-price">
                  ${(item.price || 12.99).toFixed(2)}
                </div>
                <button className="place-order-remove-item">×</button>
              </div>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Delivery Information */}
          <div className="place-order-section">
            <h3 className="place-order-section-title">Delivery Information</h3>
            
            {/* Map Toggle Button */}
            <div className="map-toggle-container">
              <button 
                onClick={toggleMap} 
                className="map-toggle-button"
              >
                {mapVisible ? "Hide Map" : "Show Map"} <FaMapMarkerAlt />
              </button>
              
              {mapVisible && (
                <button 
                  onClick={getUserLocation} 
                  className="current-location-button"
                >
                  Use My Current Location
                </button>
              )}
            </div>
            
            {/* Map Container */}
            {mapVisible && (
              <div className="map-container-wrapper">
                <div id="map" ref={mapContainerRef} className="leaflet-map-container"></div>
                <p className="map-instructions">Click on the map or drag the marker to set your delivery location</p>
              </div>
            )}
            
            <form className="place-order-form">
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  <FaUser className="form-icon" /> Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactNumber">
                  <FaPhone className="form-icon" /> Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  <FaHome className="form-icon" /> Delivery Address *
                  <span className="address-helper">(Auto-filled from map selection)</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Enter your delivery address"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="comments">
                  <FaComment className="form-icon" /> Additional Comments
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Special instructions for delivery"
                  rows="3"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="place-order-summary">
            <h3 className="place-order-summary-title">Order Summary</h3>
            <div className="place-order-summary-details">
              <div className="place-order-summary-row">
                <span className="place-order-summary-label">Subtotal</span>
                <span className="place-order-summary-value">${getCartTotal()}</span>
              </div>
              <div className="place-order-summary-row">
                <span className="place-order-summary-label">Shipping</span>
                <span className="place-order-summary-value shipping">Free</span>
              </div>
              <div className="place-order-summary-row total">
                <span className="place-order-summary-label">Total</span>
                <span className="place-order-summary-value">${getCartTotal()}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="place-order-button"
            >
              {isLoading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;