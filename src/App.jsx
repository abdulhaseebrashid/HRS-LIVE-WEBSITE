"use client"

import { useState, useEffect, useRef } from "react"
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion"
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaPhone,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaGoogle,
  FaKey,
  FaArrowLeft,
} from "react-icons/fa"
import "./App.css"
import Dashboard from "./components/Dashboard"
import AdminDashboard from "./components/AdminDashboard"
import ImageWithLoader from "./components/ImageWithLoader"

// Product data from the menu
const products = [
  {
    id: 1,
    name: "Chicken Seekh Kabab",
    description: "Premium quality chicken seekh kababs, perfectly seasoned and ready to cook. Regular pack.",
    image: "/images/chicken-seekh-kabab.png",
    category: "Premium Chicken Product",
    price: 500,
  },
  {
    id: 2,
    name: "Chicken Gola Kabab",
    description: "Delicious round chicken kababs with authentic spices. 450g pack.",
    image: "/images/chicken-gola-kabab.png",
    category: "Premium Chicken Product",
    price: 450,
  },
  {
    id: 3,
    name: "Chicken Chapli Kabab",
    description: "Traditional flat chicken kababs with a perfect blend of spices. Pack of 8 pieces.",
    image: "/images/chicken-chapli-kabab.png",
    category: "Premium Chicken Product",
    price: 450,
  },
  {
    id: 4,
    name: "Chicken Kofta",
    description: "Juicy chicken meatballs ideal for curries and appetizers. Pack of 12 pieces.",
    image: "/images/chicken-kofta1.png",
    category: "Premium Chicken Product",
    price: 450,
  },
  {
    id: 5,
    name: "Chicken Shami Kabab",
    description: "Tender chicken patties with lentils and spices. Pack of 12 pieces.",
    image: "/images/chicken-shami-kabab.png",
    category: "Premium Chicken Product",
    price: 450,
  },
  {
    id: 6,
    name: "Chicken Nuggets",
    description: "Crispy chicken nuggets, perfect for kids and adults. 500g pack.",
    image: "/images/chicken-nuggets.png",
    category: "Premium Chicken Product",
    price: 460,
  },
  {
    id: 7,
    name: "Burger Patty",
    description: "Premium chicken burger patties for the perfect homemade burger. 8pcs pack.",
    image: "/images/burger-patty.png",
    category: "Premium Chicken Product",
    price: 500,
  },
  {
    id: 8,
    name: "Samosa Delights",
    description: "Our signature crispy samosas with various delicious fillings.",
    image: "/images/samosa.png",
    category: "Samosa and Roll",
    price: "250 - 500",
    options: [
      { name: "Tikka Cheese Samosa", price: 450 },
      { name: "Fajita Pizza Samosa", price: 500 },
      { name: "Pizza Samosa", price: 470 },
      { name: "Tikka Samosa", price: 400 },
      { name: "Chicken Veg Samosa", price: 300 },
      { name: "Potato Samosa", price: 250 }
    ]
  },
  {
    id: 10,
    name: "Roll Selection",
    description: "Flaky and crispy rolls with premium meat and vegetable fillings.",
    image: "/images/kabab-roll.png",
    category: "Samosa and Roll",
    price: "350 - 700",
    options: [
      { name: "Tikka Cheese Roll", price: 600 },
      { name: "Pizza Roll", price: 700 },
      { name: "Tikka Roll", price: 500 },
      { name: "Chicken Veg Roll", price: 350 }
    ]
  },
  {
    id: 11,
    name: "French Fries",
    description: "Crispy golden french fries, ready to cook.",
    image: "/images/french-fries.png",
    category: "Fries",
    price: "450 - 900",
    options: [
      { name: "1kg Pack", price: 450 },
      { name: "2kg Pack", price: 900 },
      { name: "Chicorn Fries", price: 500 }
    ]
  },
  {
    id: 12,
    name: "Beef Specials",
    description: "Premium beef products prepared with authentic spices.",
    image: "/images/beef-shami-kabab.png",
    category: "Beef Special",
    price: 450,
    options: [
      { name: "Beef Shami Kabab", price: 450 },
      { name: "Beef Kofta", price: 450 }
    ]
  },
  {
    id: 15,
    name: "Premium Toppings",
    description: "Ready-to-use chicken toppings for pizzas and pastas.",
    image: "/images/topping.jpg",
    category: "Toppings",
    price: 600,
    options: [
      { name: "Tikka Topping", price: 600 },
      { name: "Fajita Topping", price: 600 }
    ]
  },
  {
    id: 17,
    name: "Malai Boti",
    description: "Creamy and tender chicken malai boti, perfectly marinated.",
    image: "/images/malaiBotti.jpg",
    category: "Premium Chicken Product",
    price: 420,
  },
  {
    id: 18,
    name: "Gourmet Cheese",
    description: "High-quality Mozzarella and Cheddar cheese for all your cooking needs.",
    image: "/images/chartter cheese.jpg",
    category: "Cheese",
    price: "1300 - 2550",
    options: [
      { name: "Cheddar Cheese 1kg", price: 1300 },
      { name: "Cheddar Cheese 2kg", price: 2400 },
      { name: "Mozzarella Cheese 1kg", price: 1400 },
      { name: "Mozzarella Cheese 2kg", price: 2550 }
    ]
  },
]

// Group products by category
const groupedProducts = products.reduce((acc, product) => {
  if (!acc[product.category]) {
    acc[product.category] = []
  }
  acc[product.category].push(product)
  return acc
}, {})

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// const apiUrl = (path) => `${API_BASE_URL}${path}`;

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Password reset states (commented out - not used in landing page)
  // const [showPasswordReset, setShowPasswordReset] = useState(false)
  // const [resetStep, setResetStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  // const [resetEmail, setResetEmail] = useState("")
  // const [resetOTP, setResetOTP] = useState("")
  // const [resetToken, setResetToken] = useState("")
  // const [newPassword, setNewPassword] = useState("")
  // const [confirmNewPassword, setConfirmNewPassword] = useState("")
  // const [resetError, setResetError] = useState("")
  // const [resetSuccess, setResetSuccess] = useState("")

  // Product detail modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Menu modal state
  const [showMenuModal, setShowMenuModal] = useState(false)
  // Story modal state
  const [showStoryModal, setShowStoryModal] = useState(false)

  const homeRef = useRef(null)
  const productsRef = useRef(null)
  const locationRef = useRef(null)
  const featuresRef = useRef(null)
  const aboutRef = useRef(null)
  const autoPlayRef = useRef(null)
  const formRef = useRef(null)
  // const resetFormRef = useRef(null) // Commented out - not used in landing page

  // Add this useEffect at the beginning of your App component, right after all your useState declarations
  // This will check for token in URL parameters when the app loads
  useEffect(() => {
    // Check for token in URL parameters (for Google OAuth redirect)
    // const urlParams = new URLSearchParams(window.location.search);
    // const token = urlParams.get("token");
    // const isAdminParam = urlParams.get("is_admin");
    // if (token) {
    //   // Store the token in localStorage
    //   localStorage.setItem("token", token);
    //   // Store admin status if provided
    //   if (isAdminParam !== null) {
    //     localStorage.setItem("isAdmin", isAdminParam);
    //   }
    //   // Mark that this user logged in via Google
    //   localStorage.setItem("authSource", "google");
    //   setAuthSource("google");
    //   // Remove the parameters from URL to prevent issues on refresh
    //   const cleanUrl = window.location.pathname;
    //   window.history.replaceState({}, document.title, cleanUrl);
    //   // Fetch user data with the token
    //   const adminStatus = isAdminParam === "true";
    //   fetchUserData(token, adminStatus);
    // } else {
    //   // Check if user is already logged in (from localStorage)
    //   const storedToken = localStorage.getItem("token");
    //   const adminStatus = localStorage.getItem("isAdmin") === "true";
    //   const storedAuthSource = localStorage.getItem("authSource");
    //   if (storedAuthSource) {
    //     setAuthSource(storedAuthSource);
    //   }
    //   if (storedToken) {
    //     fetchUserData(storedToken, adminStatus);
    //   }
    // }
  }, [])

  // Fetch user data with token
  // const fetchUserData = async (token, adminStatus = false) => {
  //   try {
  //     const response = await fetch(apiUrl("/api/user/"), {
  //       headers: {
  //         Authorization: `Token ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const userData = await response.json();
  //       setUser(userData);
  //       setIsAuthenticated(true);
  //       setIsAdmin(adminStatus);
  //     } else {
  //       // Token is invalid or expired
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("isAdmin");
  //       localStorage.removeItem("authSource");
  //       setAuthSource("");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  // Featured products for the hero slideshow
  const featuredProducts = [
    {
      id: 1,
      name: "Chicken Seekh Kabab",
      image: "/images/chicken-seekh-kabab.png",
      description: "Premium quality chicken seekh kababs, perfectly seasoned and ready to cook.",
    },
    {
      id: 2,
      name: "Chicken Cheese Samosa",
      image: "/images/samosa.png",
      description: "Crispy samosas filled with chicken and cheese. A perfect appetizer or snack.",
    },
    {
      id: 3,
      name: "Beef Kofta",
      image: "/images/beef-kofta.png",
      description: "Juicy beef meatballs perfect for curries and appetizers.",
    },
    {
      id: 4,
      name: "French Fries",
      image: "/images/french-fries.png",
      description: "Crispy golden french fries, ready to cook. Perfect side dish for any meal.",
    },
  ]

  // Auto-play slideshow
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
      }, 3000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, featuredProducts.length])

  // Pause autoplay when user interacts with slideshow
  const handleSlideChange = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)

    // Resume autoplay after 10 seconds of inactivity
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }

    setTimeout(() => {
      setIsAutoPlaying(true)
    }, 10000)
  }

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % featuredProducts.length)
  }

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + featuredProducts.length) % featuredProducts.length)
  }

  // Intersection observer for sections
  useEffect(() => {
    const homeEl = homeRef.current
    const productsEl = productsRef.current
    const locationEl = locationRef.current
    const featuresEl = featuresRef.current
    const aboutEl = aboutRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    if (homeEl) observer.observe(homeEl)
    if (productsEl) observer.observe(productsEl)
    if (locationEl) observer.observe(locationEl)
    if (featuresEl) observer.observe(featuresEl)
    if (aboutEl) observer.observe(aboutEl)

    return () => {
      if (homeEl) observer.unobserve(homeEl)
      if (productsEl) observer.unobserve(productsEl)
      if (locationEl) observer.unobserve(locationEl)
      if (featuresEl) observer.unobserve(featuresEl)
      if (aboutEl) observer.unobserve(aboutEl)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError("")

    try {
      if (isLogin) {
        // Login request
        // const response = await fetch(apiUrl("/api/login/"), {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     username: formData.email, // Can be username or email
        //     password: formData.password,
        //   }),
        // });
        // const data = await response.json();
        // if (response.ok) {
        //   // Save token and user data
        //   localStorage.setItem("token", data.token);
        //   // Save admin status
        //   const isAdminUser = data.is_admin || false;
        //   localStorage.setItem("isAdmin", isAdminUser.toString());
        //   // Mark that this user logged in via regular login
        //   localStorage.setItem("authSource", "regular");
        //   setAuthSource("regular");
        //   setUser(data.user);
        //   setIsAuthenticated(true);
        //   setIsAdmin(isAdminUser);
        //   setShowAuthModal(false);
        //   // Show welcome message with admin recognition
        //   alert(
        //     data.message ||
        //       (isAdminUser
        //         ? "Welcome Admin to HRS Foods"
        //         : "Welcome to HRS Foods")
        //   );
        // } else {
        //   setAuthError(data.error || "Invalid credentials");
        // }
      } else {
        // Register request
        // const response = await fetch(apiUrl("/api/register/"), {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     username: formData.username,
        //     email: formData.email,
        //     password: formData.password,
        //     password2: formData.confirmPassword,
        //     first_name: formData.firstName,
        //     last_name: formData.lastName,
        //     phone_number: formData.phoneNumber,
        //   }),
        // });
        // const data = await response.json();
        // if (response.ok) {
        //   // Save token and user data
        //   localStorage.setItem("token", data.token);
        //   // Mark that this user registered via regular signup
        //   localStorage.setItem("authSource", "regular");
        //   setAuthSource("regular");
        //   setUser(data.user);
        //   setIsAuthenticated(true);
        //   setShowAuthModal(false);
        //   alert(data.message || "CONGRATULATIONS FOR SIGN UP IN HRS Foods");
        // } else {
        //   // Handle validation errors
        //   const errorMessage = Object.values(data).flat().join("\n");
        //   setAuthError(errorMessage || "Registration failed");
        // }
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setAuthError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Login
  // const handleGoogleLogin = () => {
  //   // Add a timestamp to force a new Google auth session
  //   const timestamp = new Date().getTime();
  //   window.location.href = `${apiUrl("/api/google/login/")}?t=${timestamp}`;
  // };

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      // const token = localStorage.getItem("token");

      // // Check if user logged in via Google
      // const isGoogleAuth =
      //   authSource === "google" ||
      //   localStorage.getItem("authSource") === "google";

      // if (token) {
      //   // Regular logout from our backend
      //   await fetch(apiUrl("/api/logout/"), {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Token ${token}`,
      //     },
      //   });

      //   // If user logged in via Google, also log them out from Google
      //   if (isGoogleAuth) {
      //     // Redirect to Google logout endpoint first, then come back
      //     await fetch(apiUrl("/api/google/logout/"), {
      //       method: "GET",
      //     });
      //   }
      // }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear all auth-related data from localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("isAdmin")
      localStorage.removeItem("authSource")

      // Clear all auth-related state
      setUser(null)
      setIsAuthenticated(false)
      setIsAdmin(false)
      // setAuthSource("") // Commented out - not used in landing page

      // Reset form data to prevent auto-fill
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
      })

      // Force the form to reset
      if (formRef.current) {
        formRef.current.reset()
      }

      // Clear any session cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })

      // Show login modal after logout
      setIsLogin(true)
      setShowAuthModal(true)
      setIsLoading(false)
    }
  }

  // Toggle form function (commented out - not used in landing page)
  // const toggleForm = () => {
  //   setIsLogin(!isLogin)
  //   setAuthError("")
  //   // Reset form data when switching between login and signup
  //   setFormData({
  //     firstName: "",
  //     lastName: "",
  //     username: "",
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //     phoneNumber: "",
  //   })

  //   // Reset the form
  //   if (formRef.current) {
  //     formRef.current.reset()
  //   }
  // }

  // Password Reset Functions
  const handleForgotPassword = () => {
    setShowAuthModal(false)
    // setShowPasswordReset(true) // Commented out - not used in landing page
    // setResetStep(1)
    // setResetEmail("")
    // setResetOTP("")
    // setResetToken("") // Commented out - not used in landing page
    // setNewPassword("")
    // setConfirmNewPassword("")
    // setResetError("")
    // setResetSuccess("")
  }

  // const handleResetEmailSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setResetError("");
  //   setResetSuccess("");

  //   try {
  //     const response = await fetch(apiUrl("/api/password/reset/request/"), {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email: resetEmail }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setResetSuccess(data.message || "OTP has been sent to your email.");
  //       setResetStep(2); // Move to OTP verification step
  //     } else {
  //       setResetError(data.error || "Failed to send OTP. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Password reset request error:", error);
  //     setResetError("An error occurred. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleOTPVerification = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setResetError("");
  //   setResetSuccess("");

  //   try {
  //     const response = await fetch(apiUrl("/api/password/reset/verify-otp/"), {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email: resetEmail, otp: resetOTP }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setResetToken(data.reset_token);
  //       setResetSuccess(data.message || "OTP verified successfully.");
  //       setResetStep(3); // Move to new password step
  //     } else {
  //       setResetError(data.error || "Invalid OTP. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("OTP verification error:", error);
  //     setResetError("An error occurred. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handlePasswordReset = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setResetError("");
  //   setResetSuccess("");

  //   if (newPassword !== confirmNewPassword) {
  //     setResetError("Passwords do not match.");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await fetch(apiUrl("/api/password/reset/confirm/"), {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: resetEmail,
  //         reset_token: resetToken,
  //         new_password: newPassword,
  //         confirm_password: confirmNewPassword,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setResetSuccess(
  //         data.message || "Password has been reset successfully."
  //       );

  //       // Wait 3 seconds and then redirect to login
  //       setTimeout(() => {
  //         setShowPasswordReset(false);
  //         setShowAuthModal(true);
  //         setIsLogin(true);

  //         // Reset all password reset fields
  //         setResetStep(1);
  //         setResetEmail("");
  //         setResetOTP("");
  //         setResetToken("");
  //         setNewPassword("");
  //         setConfirmNewPassword("");
  //         setResetError("");
  //         setResetSuccess("");
  //       }, 3000);
  //     } else {
  //       setResetError(
  //         data.error || "Failed to reset password. Please try again."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Password reset error:", error);
  //     setResetError("An error occurred. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Back to login function (commented out - not used in landing page)
  // const backToLogin = () => {
  //   setShowPasswordReset(false)
  //   setShowAuthModal(true)
  //   setIsLogin(true)

  // Reset all password reset fields (commented out - not used in landing page)
  // setResetStep(1)
  // setResetEmail("")
  // setResetOTP("")
  // setResetToken("") // Commented out - not used in landing page
  // setNewPassword("")
  // setConfirmNewPassword("")
  // setResetError("")
  // setResetSuccess("")
  // }

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  const filterProductsByCategory = (category) => {
    setSelectedCategory(category)
  }

  const getFilteredProducts = () => {
    let filtered = products

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return filtered
  }

  const categories = ["All", ...Object.keys(groupedProducts)]

  // Standard Premium Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  }

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  }

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const card3D = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  // If user is authenticated, show appropriate dashboard
  if (isAuthenticated && user) {
    if (isAdmin) {
      // Show admin dashboard if user is admin
      return <AdminDashboard user={user} onLogout={handleLogout} products={products} />
    } else {
      // Show regular user dashboard
      return <Dashboard user={user} onLogout={handleLogout} products={products} />
    }
  }

  return (
    <div className="app-container">
      {/* Header/Navigation */}
      <header className="header">
        <div className="logo">
          <img src="/images/hrs-logo.png" alt="HRS Foods Logo" className="logo-img" />
        </div>

        <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          <button
            className={`nav-item ${activeSection === "home" ? "active" : ""}`}
            onClick={() => scrollToSection(homeRef)}
          >
            HOME
          </button>
          <button
            className={`nav-item ${activeSection === "products" ? "active" : ""}`}
            onClick={() => scrollToSection(productsRef)}
          >
            PRODUCTS
          </button>
          <button
            className={`nav-item ${activeSection === "location" ? "active" : ""}`}
            onClick={() => scrollToSection(locationRef)}
          >
            LOCATION
          </button>
          <button
            className={`nav-item ${activeSection === "features" ? "active" : ""}`}
            onClick={() => scrollToSection(featuresRef)}
          >
            FEATURES
          </button>
          <button
            className={`nav-item ${activeSection === "about" ? "active" : ""}`}
            onClick={() => scrollToSection(aboutRef)}
          >
            ABOUT
          </button>
        </nav>

        <div className="auth-buttons">
          <motion.button
            className="sign-in-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsLogin(true)
              setShowAuthModal(true)
            }}
          >
            Contact Us
          </motion.button>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Rest of your landing page components */}
      {/* Hero Section with Slideshow */}
      <section
        id="home"
        ref={homeRef}
        className="hero-section"
        style={{ background: "#111", position: "relative", overflow: "hidden", minHeight: "100vh" }}
      >
        <div
          className="slideshow-container"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
            >
              <div className="slide-image-container">
                <ImageWithLoader
                  src={featuredProducts[currentSlide].image || "/placeholder.svg"}
                  alt={featuredProducts[currentSlide].name}
                  className="slide-image"
                  // Maintain the animation props via motion if needed, but ImageWithLoader wraps motion.img
                  // We need to pass animate props to ImageWithLoader if we want the zoom effect, 
                  // but ImageWithLoader implementation needs to support it. 
                  // For now, let's keep it simple or update ImageWithLoader to pass through motion props.
                  // Actually, looking at my ImageWithLoader, it spreads props to motion.img.
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }} // Overrides the opacity inside ImageWithLoader if not careful.
                  // Let's rely on ImageWithLoader's internal opacity handling for load, and pass scale here.
                  // But wait, the previous code had specific transition.
                  transition={{ duration: 4 }}
                />
                <div className="image-overlay-glow"></div>
              </div>
              <div className="slide-content">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="slide-title"
                >
                  {featuredProducts[currentSlide].name}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="slide-description"
                >
                  {featuredProducts[currentSlide].description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="premium-tag">Premium Quality</span>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="slideshow-controls">
            <button className="slide-arrow prev" onClick={prevSlide}>
              <FaChevronLeft />
            </button>
            <div className="slide-indicators">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  className={`slide-indicator ${currentSlide === index ? "active" : ""}`}
                  onClick={() => handleSlideChange(index)}
                />
              ))}
            </div>
            <button className="slide-arrow next" onClick={nextSlide}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="hero-content">
          <motion.h1
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            className="hero-title"
          >
            HRS Frozen Foods
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="hero-subtitle"
          >
            Eat Healthy, Live Healthy with HRS Foods. We bring you high-quality frozen foods that are convenient,
            delicious, and ready when you are. From savory kababs to crispy samosas, we've got your meals covered.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="hero-cta"
          >
            <motion.div
              className="search-container"
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="text"
                placeholder="Search for frozen products..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.button
                className="search-btn"
                whileHover={{ scale: 1.08, boxShadow: "0 10px 30px rgba(229, 57, 53, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(productsRef)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Explore Products
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* New Product Announcement */}
      <div className="announcement-bar">
        <span className="new-badge">New</span> Try our Premium Chicken Range with special seasoning
        <motion.button className="try-now-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Try Now <FaArrowRight className="arrow-icon" />
        </motion.button>
      </div>

      {/* Products Section */}
      <section id="products" ref={productsRef} className="products-section">
        <motion.h2
          className="section-title products-title"
          variants={scaleUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Our Premium Frozen Products
        </motion.h2>

        <motion.div
          className="category-filter"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`category-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => filterProductsByCategory(category)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="products-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {getFilteredProducts().map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card"
              variants={card3D}
              whileHover={{
                y: -15,
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              <div className="product-image">
                <ImageWithLoader
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  loading="lazy"
                />
              </div>
              <div className="product-category">
                {product.category}
              </div>
              <div className="product-price-badge">
                {typeof product.price === 'number' ? `PKR ${product.price}` : product.price}
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <motion.button
                className="product-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedProduct(product)
                  setShowProductModal(true)
                }}
              >
                View Details
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Location Section */}
      <section id="location" ref={locationRef} className="location-section">
        <motion.h2
          className="section-title location-title"
          style={{ textAlign: "center" }}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Our Locations
        </motion.h2>

        <div className="location-container">
          <motion.div
            className="location-intro"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="location-intro-title"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              HRS Food Delivery is Present All Over
            </motion.h3>

            <motion.div
              className="location-cities-container"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                className="city-card"
                variants={scaleUp}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="city-icon">🏛️</div>
                <h4 className="city-name">Islamabad</h4>
                <p className="city-description">Capital City</p>
              </motion.div>

              <motion.div
                className="city-card"
                variants={scaleUp}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="city-icon">🌆</div>
                <h4 className="city-name">Sargodha</h4>
                <p className="city-description">City of Eagles</p>
              </motion.div>

              <motion.div
                className="city-card"
                variants={scaleUp}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="city-icon">🏙️</div>
                <h4 className="city-name">Rawalpindi</h4>
                <p className="city-description">Twin City</p>
              </motion.div>
            </motion.div>

            <motion.p
              className="delivery-tagline"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Get Your Delivery Right On The Spot — Fast, Reliable, and Easy!
            </motion.p>
          </motion.div>

          <motion.div
            className="location-features-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="location-feature-card"
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="location-feature-icon">📍</div>
              <h4>Wide Coverage</h4>
              <p>Serving Islamabad, Sargodha, and Rawalpindi with dedicated delivery services.</p>
            </motion.div>

            <motion.div
              className="location-feature-card"
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="location-feature-icon">⚡</div>
              <h4>Fast Delivery</h4>
              <p>Quick and efficient delivery right to your doorstep, ensuring freshness.</p>
            </motion.div>

            <motion.div
              className="location-feature-card"
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="location-feature-icon">✅</div>
              <h4>Reliable Service</h4>
              <p>Trusted by thousands of customers for consistent quality and punctuality.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="features-section">
        <motion.h2
          className="section-title features-title"
          style={{ textAlign: "center", width: "100%", display: "block" }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Why Choose HRS Frozen Foods
        </motion.h2>

        <motion.div
          className="features-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="feature-card"
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.03 }}
          >
            <div className="feature-glow"></div>
            <div className="feature-icon">🥩</div>
            <h3>Premium Quality</h3>
            <p>We use only the finest ingredients, flash-frozen to preserve flavor and nutrients.</p>
          </motion.div>

          <motion.div
            className="feature-card"
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.03 }}
          >
            <div className="feature-glow"></div>
            <div className="feature-icon">🚚</div>
            <h3>Fast & Free Delivery</h3>
            <p>Enjoy fast and free delivery in Rawalpindi and Islamabad areas.</p>
          </motion.div>

          <motion.div
            className="feature-card"
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.03 }}
          >
            <div className="feature-glow"></div>
            <div className="feature-icon">🍽️</div>
            <h3>Variety</h3>
            <p>From chicken and beef specialties to samosas and fries, we offer a wide range of products.</p>
          </motion.div>

          <motion.div
            className="feature-card"
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.03 }}
          >
            <div className="feature-glow"></div>
            <div className="feature-icon">❤️</div>
            <h3>Healthy Options</h3>
            <p>Our motto "Eat Healthy, Live Healthy" reflects our commitment to nutritious food options.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="about-section">
        <div className="about-content">
          <motion.div
            className="about-text"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="section-title ">About HRS Foods</h2>
            <p>
              HRS Foods is dedicated to providing premium quality frozen food products that make meal preparation
              convenient without compromising on taste or nutrition. Our range includes authentic Pakistani favorites
              like kababs, samosas, and more.
            </p>
            <p>
              We believe in our motto "Eat Healthy, Live Healthy" and ensure that all our products are made with the
              finest ingredients and prepared according to traditional recipes with modern food safety standards.
            </p>
            <motion.button
              className="about-btn"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStoryModal(true)}
            >
              Our Story
            </motion.button>
          </motion.div>

          <motion.div
            className="about-image"
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <ImageWithLoader
              src="/images/menu1.jpeg"
              alt="HRS Foods Menu"
              className="menu-image"
              loading="lazy"
              onClick={() => setShowMenuModal(true)}
              style={{ cursor: 'pointer' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/images/hrs-logo.png" alt="HRS Foods Logo" className="footer-logo-img" />
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Products</h3>
              <ul>
                <li>Premium Chicken Products</li>
                <li>Samosas & Rolls</li>
                <li>Fries</li>
                <li>Beef Specials</li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Press</li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Support</h3>
              <ul>
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Shipping</li>
                <li>Returns</li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Contact</h3>
              <ul>
                <li>+92 317-6000811</li>
                <li>Rawalpindi / Islamabad</li>
                <li>info@hrsfoods.com</li>
                <li>Fast & Free Delivery</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 HRS Foods. All rights reserved. Eat Healthy, Live Healthy</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              className="auth-modal"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal" onClick={() => setShowAuthModal(false)}>
                <FaTimes />
              </button>

              <div className="auth-header">
                <div className="auth-logo">
                  <img src="/images/hrs-logo.png" alt="HRS Foods Logo" className="auth-logo-img" />
                </div>
                <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <p className="auth-subtitle">
                  {isLogin
                    ? "Sign in to access your account and order your favorite frozen foods"
                    : "Join HRS Foods for exclusive offers and easy ordering"}
                </p>
              </div>

              {authError && <div className="auth-error">{authError}</div>}

              <form ref={formRef} onSubmit={handleSubmit} className="auth-form" autoComplete="off">
                {!isLogin && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">
                          <FaUser className="input-icon" />
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleChange}
                          required={!isLogin}
                          autoComplete="new-password"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastName">
                          <FaUser className="input-icon" />
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleChange}
                          required={!isLogin}
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="username">
                        <FaUserCircle className="input-icon" />
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required={!isLogin}
                        autoComplete="new-password"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phoneNumber">
                        <FaPhone className="input-icon" />
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required={!isLogin}
                        autoComplete="new-password"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope className="input-icon" />
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <FaLock className="input-icon" />
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>

                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <FaLock className="input-icon" />
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      autoComplete="new-password"
                    />
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="auth-submit-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
                </motion.button>

                {/* Google Login Button */}
                <motion.button
                  type="button"
                  className="google-auth-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                // onClick={handleGoogleLogin} // Temporarily disabled as backend is removed
                >
                  <FaGoogle className="google-icon" />
                  {isLogin ? "Login with Google" : "Sign up with Google"}
                </motion.button>
              </form>

              <div className="auth-footer">
                {isLogin && (
                  <p className="forgot-password">
                    <button type="button" className="toggle-auth-btn" onClick={handleForgotPassword}>
                      Forgot Password?
                    </button>
                  </p>
                )}
                <p>



                  {/* i will work on that just commented it for know on */}
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  {/* <button type="button" className="toggle-auth-btn" onClick={toggleForm}>
                    {isLogin ? "Sign Up" : "Login"}
                  </button> */}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Reset Modal - Commented out for landing page only */}
      {/* <AnimatePresence>
        {showPasswordReset && (
          <motion.div
            className="auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordReset(false)}
          >
            <motion.div
              className="auth-modal"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal" onClick={() => setShowPasswordReset(false)}>
                <FaTimes />
              </button>

              <div className="auth-header">
                <div className="auth-logo">
                  <img src="/images/hrs-logo.png" alt="HRS Foods Logo" className="auth-logo-img" />
                </div>
                <h2>Reset Password</h2>
                <p className="auth-subtitle">
                  {resetStep === 1
                    ? "Enter your email to receive a password reset OTP"
                    : resetStep === 2
                      ? "Enter the OTP sent to your email"
                      : "Create a new password"}
                </p>
              </div>

              {resetError && <div className="auth-error">{resetError}</div>}
              {resetSuccess && <div className="auth-success">{resetSuccess}</div>}

              <div className="reset-step-indicator">
                <div className={`step ${resetStep >= 1 ? "active" : ""}`}>1</div>
                <div className="step-line"></div>
                <div className={`step ${resetStep >= 2 ? "active" : ""}`}>2</div>
                <div className="step-line"></div>
                <div className={`step ${resetStep >= 3 ? "active" : ""}`}>3</div>
              </div>

              {resetStep === 1 && (
                <form
                  ref={resetFormRef}
                  // onSubmit={handleResetEmailSubmit} // Temporarily disabled as backend is removed
                  className="auth-form"
                >
                  <div className="form-group">
                    <label htmlFor="resetEmail">
                      <FaEnvelope className="input-icon" />
                    </label>
                    <input
                      type="email"
                      id="resetEmail"
                      placeholder="Email Address"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="auth-submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </motion.button>
                </form>
              )}

              {resetStep === 2 && (
                <form
                  ref={resetFormRef}
                  // onSubmit={handleOTPVerification} // Temporarily disabled as backend is removed
                  className="auth-form"
                >
                  <div className="form-group">
                    <label htmlFor="resetOTP">
                      <FaKey className="input-icon" />
                    </label>
                    <input
                      type="text"
                      id="resetOTP"
                      placeholder="Enter 6-digit OTP"
                      value={resetOTP}
                      onChange={(e) => setResetOTP(e.target.value)}
                      required
                      maxLength={6}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="auth-submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </motion.button>
                </form>
              )}

              {resetStep === 3 && (
                <form
                  ref={resetFormRef}
                  // onSubmit={handlePasswordReset} // Temporarily disabled as backend is removed
                  className="auth-form"
                >
                  <div className="form-group">
                    <label htmlFor="newPassword">
                      <FaLock className="input-icon" />
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmNewPassword">
                      <FaLock className="input-icon" />
                    </label>
                    <input
                      type="password"
                      id="confirmNewPassword"
                      placeholder="Confirm New Password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="auth-submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </motion.button>
                </form>
              )}

              <div className="auth-footer">
                <button type="button" className="back-to-login" onClick={backToLogin}>
                  <FaArrowLeft /> Back to Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <motion.div
            className="product-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProductModal(false)}
          >
            <motion.div
              className="product-detail-modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="product-modal-close"
                onClick={() => setShowProductModal(false)}
              >
                <FaTimes />
              </button>

              <div className="product-detail-content">
                <div className="product-detail-image-container">
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="product-detail-image"
                  />
                </div>

                <div className="product-detail-info">
                  <motion.div
                    className="product-detail-category"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {selectedProduct.category}
                  </motion.div>
                  <motion.h2
                    className="product-detail-name"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {selectedProduct.name}
                  </motion.h2>
                  <motion.p
                    className="product-detail-description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {selectedProduct.description}
                  </motion.p>

                  {/* Enhanced Mouth-watering Description */}
                  <motion.div
                    className="product-mouth-watering"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="mouth-watering-title">🍽️ Why You'll Love It</h3>
                    <p className="mouth-watering-text">
                      {selectedProduct.category.includes("Chicken")
                        ? "Succulent, tender, and bursting with authentic flavors! Our premium chicken products are marinated with a secret blend of spices that will transport your taste buds to culinary heaven. Perfectly cooked every time, these mouth-watering delights are ready to become the star of your meal!"
                        : selectedProduct.category.includes("Beef")
                          ? "Rich, hearty, and incredibly satisfying! Our premium beef products are crafted with the finest cuts, seasoned to perfection with traditional spices. Each bite delivers a explosion of flavors that will leave you craving for more. A true feast for meat lovers!"
                          : selectedProduct.category.includes("Samosa") || selectedProduct.category.includes("Roll")
                            ? "Crispy, golden, and absolutely irresistible! Each bite reveals a perfect harmony of flavors - from the flaky, buttery crust to the rich, savory filling. These traditional favorites are made with love and care, bringing authentic Pakistani street food flavors right to your kitchen!"
                            : "Fresh, delicious, and perfectly prepared! Made with premium ingredients and our secret recipe, this product delivers exceptional taste and quality. Whether it's a quick snack or a complete meal, you're guaranteed satisfaction with every bite!"
                      }
                    </p>
                  </motion.div>

                  <motion.div
                    className="product-detail-specs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="product-spec-item">
                      <span className="spec-label">Category:</span>
                      <span className="spec-value">{selectedProduct.category}</span>
                    </div>
                    <div className="product-spec-item">
                      <span className="spec-label">Product ID:</span>
                      <span className="spec-value">#{selectedProduct.id}</span>
                    </div>
                    <div className="product-spec-item price-item">
                      <span className="spec-label">Price:</span>
                      <span className="spec-value price-tag">
                        {typeof selectedProduct.price === 'number' ? `PKR ${selectedProduct.price}` : `PKR ${selectedProduct.price}`}
                      </span>
                    </div>
                    {selectedProduct.options && (
                      <div className="product-options-container">
                        <span className="spec-label">Options:</span>
                        <div className="options-list">
                          {selectedProduct.options.map((opt, i) => (
                            <div key={i} className="option-item">
                              <span className="option-name">{opt.name}</span>
                              <span className="option-price">PKR {opt.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <div className="product-detail-actions">
                    <motion.button
                      className="product-detail-btn contact-btn"
                      whileHover={{ scale: 1.08, boxShadow: "0 10px 30px rgba(229, 57, 53, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => scrollToSection(aboutRef)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      Contact Us
                    </motion.button>
                    <motion.button
                      className="product-detail-btn close-btn"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowProductModal(false)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Modal */}
      <AnimatePresence>
        {showMenuModal && (
          <motion.div
            className="menu-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenuModal(false)}
          >
            <motion.div
              className="menu-modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="menu-modal-close"
                onClick={() => setShowMenuModal(false)}
              >
                <FaTimes />
              </button>
              <div className="menu-modal-image-container">
                <img
                  src="/images/menu1.jpeg"
                  alt="HRS Foods Complete Menu"
                  className="menu-modal-image"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Modal */}
      <AnimatePresence>
        {showStoryModal && (
          <motion.div
            className="story-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStoryModal(false)}
          >
            <motion.div
              className="story-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="story-modal-close" onClick={() => setShowStoryModal(false)}>
                <FaTimes />
              </button>
              <div className="story-modal-body">
                <h3 className="story-modal-title">Our Story</h3>
                <p>
                  HRS Foods started with a simple vision: bringing premium quality frozen foods to every household without
                  compromising on taste, nutrition, or convenience. From our authentic kababs and samosas to our signature fries,
                  every product is crafted with care, premium ingredients, and modern food safety standards.
                </p>
                <p>
                  We serve Islamabad, Rawalpindi, and Sargodha with fast, reliable delivery, ensuring your meals are always
                  ready when you are. Our motto, "Eat Healthy, Live Healthy," guides everything we do—because we believe great
                  food brings people together.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
