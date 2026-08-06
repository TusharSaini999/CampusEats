import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiClock, FiMapPin, FiSearch, FiShoppingBag, FiTruck, FiStar, FiTrendingUp, FiShoppingCart, FiUser, FiList, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import heroImage from "../assets/hero.jpg";
import aboutImage from "../images/1.png";
import AlertModal from "./AlertModal";

const Home = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  
  // Real Data States
  const [menuItems, setMenuItems] = useState([]);
  const [quickSearches, setQuickSearches] = useState(["Paneer Pizza", "Coffee", "Veg Burger", "Dal Rice"]);
  const [activeSearch, setActiveSearch] = useState("Paneer Pizza");
  const [activeVendorsCount, setActiveVendorsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(import.meta.env.VITE_API_URL + "/menu/");
        const data = await response.json();
        
        // Add a fallback image to data if missing
        const processedData = data.map(item => ({
          ...item,
          image_url: item.image_url ? item.image_url : "https://res.cloudinary.com/cloud451752/image/upload/v1738939765/menu_images/c199pic8rjpnosgnayzg.jpg"
        }));
        setMenuItems(processedData);

        // Calculate Active Vendors
        const uniqueActiveVendors = new Set(
          processedData.filter(item => item.current === 1).map(item => item.vendor_id)
        );
        setActiveVendorsCount(uniqueActiveVendors.size);

        // Calculate Categories
        const categories = [...new Set(processedData.map(item => item.category).filter(Boolean))];
        setCategoriesCount(categories.length);

        // Generate dynamic Quick Searches (Top Categories or Names)
        if (categories.length >= 4) {
          setQuickSearches(categories.slice(0, 4));
          setActiveSearch(categories[0]);
        } else if (processedData.length > 0) {
          const names = [...new Set(processedData.map(item => item.name).filter(Boolean))];
          setQuickSearches(names.slice(0, 4));
          setActiveSearch(names[0]);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const filteredSearches = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return quickSearches;
    return quickSearches.filter((item) => item.toLowerCase().includes(cleanQuery));
  }, [query, quickSearches]);

  const submitSearch = (event) => {
    event.preventDefault();
    const searchTerm = query.trim() || activeSearch;
    navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const handleAddToCart = async (menu_id) => {
    const user_id = localStorage.getItem("id");
    if (!user_id) {
      setAlertMessage("Please login to add items to cart!");
      return;
    }
    const order_id = Date.now();
    const selectedItem = menuItems.find((item) => item.id === menu_id);
    if (!selectedItem) return;
    const cartItem = { order_id, menu_id, quantity: 1, price: selectedItem.price, user_id };
    
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/order_items/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });
      if (response.ok) {
        setAlertMessage("Item added successfully!");
      } else if (response.status === 400) {
        setAlertMessage("Item already exists in the cart.");
      } else {
        setAlertMessage("Failed to add item.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="bg-slate-950 text-white font-sans overflow-hidden">
      <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />
      {/* HERO SECTION */}
      <section className="relative min-h-screen">
        {/* Background with Animated Gradient Orbs */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Fresh campus meal ready for delivery"
            className="h-full w-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60" />
          
          {/* Animated Glow Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/30 blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-emerald-500/20 blur-[120px]" 
          />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center gap-10 lg:gap-16 px-4 sm:px-6 py-12 lg:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live campus delivery & tracking
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Campus food, <br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">moving as fast</span> <br />
              as your day.
            </motion.h1>
            
            <motion.p variants={itemVariants} className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
              Browse nearby campus kitchens, discover cravings, place orders, and track your delivery seamlessly from one smart app.
            </motion.p>

            <motion.form 
              variants={itemVariants} 
              onSubmit={submitSearch} 
              className={`mt-10 max-w-xl rounded-2xl bg-white/5 p-2 backdrop-blur-xl border transition-all duration-300 ${isFocused ? 'border-violet-500/50 shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]' : 'border-white/10 shadow-2xl'}`}
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex min-h-[56px] flex-1 items-center gap-3 rounded-xl bg-slate-900/50 px-5 text-slate-300 transition-colors focus-within:bg-slate-900/80">
                  <FiSearch className={`h-5 w-5 transition-colors ${isFocused ? 'text-violet-400' : 'text-slate-500'}`} />
                  <input
                    value={query}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={`Search for ${quickSearches[0] || "Food"}...`}
                    className="w-full bg-transparent text-base outline-none placeholder:text-slate-600 font-medium"
                  />
                </label>
                <button
                  type="submit"
                  className="group relative inline-flex min-h-[56px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-violet-600 px-8 text-sm font-bold text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_20px_-3px_rgba(139,92,246,0.5)] active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Find Food
                    <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </div>
            </motion.form>

            <motion.div variants={itemVariants} className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1 w-full sm:w-auto">
                <FiTrendingUp className="text-emerald-400" /> Trending:
              </span>
              {filteredSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setActiveSearch(item);
                    setQuery(item);
                    navigate(`/search-results?query=${encodeURIComponent(item)}`);
                  }}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                    activeSearch === item
                      ? "border-violet-400/50 bg-violet-400/10 text-violet-300 shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)]"
                      : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-4">
              <Link
                to="/menu"
                className="group flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition-all hover:bg-slate-100 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] active:scale-95"
              >
                <FiShoppingBag className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Order Now
              </Link>
              <Link
                to="/cart"
                className="group flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                <FiShoppingCart className="h-4 w-4 text-fuchsia-400 transition-transform group-hover:rotate-12" />
                View Cart
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            className="grid gap-6 lg:justify-self-end w-full"
          >
            <div className="relative w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="absolute top-0 right-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-500/20 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 translate-y-1/2 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-2xl" />
              
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-400">Campus Live Stats</p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
                    {isLoading ? "Loading..." : "Cravings Await 🔥"}
                  </h2>
                </div>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live
                </span>
              </div>

              <div className="relative z-10 mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { label: "Active Vendors", value: isLoading ? "--" : `${activeVendorsCount}` },
                  { label: "Total Dishes", value: isLoading ? "--" : `${menuItems.length}` },
                  { label: "Categories", value: isLoading ? "--" : `${categoriesCount}` },
                ].map((stat, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    key={stat.label} 
                    className="rounded-2xl border border-white/5 bg-white/5 p-3 sm:p-4 text-center backdrop-blur-sm transition-colors hover:bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  >
                    <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                    <p className="mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10 mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                {[
                  { icon: FiList, label: "Browse Full Menu", value: "Explore all items", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20", link: "/menu" },
                  { icon: FiTruck, label: "Track Orders", value: "View your order history", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", link: "/order-history" },
                  { icon: FiUser, label: "Your Profile", value: "Manage your account", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", link: "/profile" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      to={item.link}
                      key={item.label}
                    >
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (idx * 0.1) }}
                        className="group flex items-center gap-3 sm:gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-3 sm:p-4 transition-all hover:bg-slate-800/80 hover:border-white/10 mb-3 sm:mb-4"
                      >
                        <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border ${item.bg} transition-transform group-hover:scale-110`}>
                          <Icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400">{item.label}</p>
                          <p className="text-sm font-bold text-slate-100">{item.value}</p>
                        </div>
                        <FiArrowRight className="ml-auto h-5 w-5 text-slate-500 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW: Featured Items Section */}
      <section className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black text-white mb-4">
                Featured <span className="text-violet-400">Campus Bites</span>
              </h2>
              <p className="text-slate-400 max-w-xl">
                Explore our most popular and delicious meals curated just for you. Freshly prepared by top-rated campus vendors.
              </p>
            </div>
            <Link 
              to="/menu" 
              className="group inline-flex items-center gap-2 text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Explore Full Menu
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
                  <div className="h-48 w-full rounded-xl bg-slate-800 mb-4"></div>
                  <div className="h-4 w-3/4 bg-slate-800 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuItems.slice(0, 8).map((item) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  key={item.id}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden hover:border-violet-500/50 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.2)] transition-all duration-300"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {item.category && (
                      <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                      {item.description || "A delicious campus meal ready for you."}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-black text-emerald-400">Rs {item.price}</span>
                      
                      {item.availability === 0 ? (
                        <span className="text-xs font-bold text-rose-500">Out of Stock</span>
                      ) : item.current === 0 ? (
                        <span className="text-xs font-bold text-slate-500">Vendor Offline</span>
                      ) : (
                        <button 
                          onClick={() => handleAddToCart(item.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white transition-all hover:bg-violet-500 hover:scale-110 active:scale-95"
                          title="Add to Cart"
                        >
                          <FiShoppingCart className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEW: Features Section */}
      <section className="relative z-10 py-24 px-6 lg:px-12 bg-slate-900/50 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Why Choose <span className="text-emerald-400">CampusEats?</span>
            </h2>
            <p className="text-slate-400">
              We've built the ultimate food delivery experience tailored specifically for campus life. Here's what makes us different.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiTruck, title: "Lightning Delivery", desc: "Straight to your dorm or library desk in minutes.", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
              { icon: FiStar, title: "Top Vendors", desc: "Only the best-rated campus kitchens and canteens.", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20" },
              { icon: FiClock, title: "Real-time Tracking", desc: "Know exactly when your food will arrive.", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
              { icon: FiShoppingBag, title: "Easy Ordering", desc: "Seamless payments and quick re-ordering.", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20" },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  key={feature.title}
                  className="rounded-3xl border border-white/5 bg-white/5 p-8 text-center transition-all hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.1)]"
                >
                  <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${feature.bg}`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEW: About Us Section */}
      <section className="relative z-10 py-24 px-6 lg:px-12 border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-emerald-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative aspect-square sm:aspect-video lg:aspect-square overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
              <img 
                src={aboutImage} 
                alt="Students enjoying food" 
                className="h-full w-full object-cover opacity-70 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                  <p className="text-2xl font-black text-white italic">"Bringing the campus together, one meal at a time."</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl font-black text-white mb-6">
              About <span className="text-violet-400">CampusEats</span>
            </h2>
            <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
              <p>
                Started by a group of hungry students who were tired of waiting in long canteen lines, CampusEats was built to revolutionize how you get your food between classes.
              </p>
              <p>
                We partner with your favorite local campus vendors to bring you a seamless ordering experience. Whether you're craving a midnight snack during a study session or need a quick lunch before your next lecture, we've got you covered.
              </p>
              <div className="pt-6">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_-3px_rgba(52,211,153,0.5)] active:scale-95"
                >
                  <FiHeart className="h-5 w-5" />
                  Join Our Community
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
