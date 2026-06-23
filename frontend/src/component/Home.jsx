import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiClock, FiMapPin, FiSearch, FiShoppingBag, FiTruck, FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import heroImage from "../assets/hero.jpg";

const quickSearches = ["Paneer Pizza", "Coffee", "Veg Burger", "Dal Rice"];

const Home = () => {
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(quickSearches[0]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const filteredSearches = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return quickSearches;
    return quickSearches.filter((item) => item.toLowerCase().includes(cleanQuery));
  }, [query]);

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

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-screen font-sans">
      {/* Background with Animated Gradient Orbs */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fresh campus meal ready for delivery"
          className="h-full w-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/50" />
        
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

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center gap-16 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live campus delivery & tracking
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
            Campus food, <br />
            <span className="text-gradient">moving as fast</span> <br />
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
                  placeholder="Search for Paneer Pizza, Coffee..."
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

          <motion.div variants={itemVariants} className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Trending:</span>
            {filteredSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setActiveSearch(item);
                  setQuery(item);
                }}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                  activeSearch === item
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300 shadow-[0_0_15px_-3px_rgba(52,211,153,0.2)]"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition-all hover:bg-slate-100 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] active:scale-95"
            >
              <FiShoppingBag className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
              Order Now
            </Link>
            <Link
              to="/recipe-generator"
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
            >
              <FiStar className="h-4 w-4 text-fuchsia-400 transition-transform group-hover:rotate-45" />
              Try Recipe AI
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          className="grid gap-6 lg:justify-self-end w-full"
        >
          <div className="glass-card relative w-full max-w-md overflow-hidden rounded-3xl p-8 shadow-2xl">
            <div className="absolute top-0 right-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-500/20 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 translate-y-1/2 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-2xl" />
            
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">Current Rush</p>
                <h2 className="mt-2 text-3xl font-black text-white">Lunch Time 🔥</h2>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live
              </span>
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-3 gap-4">
              {[
                { label: "Active Vendors", value: "24+" },
                { label: "Average ETA", value: "28m" },
                { label: "User Rating", value: "4.9" },
              ].map((stat, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (idx * 0.1) }}
                  key={stat.label} 
                  className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 mt-8 space-y-4">
              {[
                { icon: FiMapPin, label: "Hotspot Pickup", value: "Main Canteen Area", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20" },
                { icon: FiClock, label: "Fastest Delivery", value: "Library Block - 15m", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
                { icon: FiTruck, label: "Live Tracking", value: "Map updates enabled", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (idx * 0.1) }}
                    key={item.label} 
                    className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-4 transition-all hover:bg-slate-800/80 hover:border-white/10"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${item.bg} transition-transform group-hover:scale-110`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">{item.label}</p>
                      <p className="text-sm font-bold text-slate-100">{item.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
