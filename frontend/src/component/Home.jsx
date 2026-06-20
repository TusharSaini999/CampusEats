import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiClock, FiMapPin, FiSearch, FiShoppingBag, FiTruck } from "react-icons/fi";
import heroImage from "../assets/hero.jpg";

const quickSearches = ["Paneer Pizza", "Coffee", "Veg Burger", "Dal Rice"];

const Home = () => {
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(quickSearches[0]);
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

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Fresh campus meal ready for delivery"
          className="h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/30" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 md:grid-cols-[1.05fr_0.95fr] md:px-8 lg:px-10">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur">
            <FiTruck className="h-4 w-4 text-emerald-300" />
            Live campus delivery, vendor menus, and order tracking
          </div>

          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Campus food, moving as fast as your day.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
            Browse nearby campus kitchens, search cravings, place orders, and track delivery from one app.
          </p>

          <form onSubmit={submitSearch} className="mt-8 max-w-xl rounded-lg bg-white p-2 shadow-2xl shadow-black/30">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex min-h-12 flex-1 items-center gap-3 rounded-md bg-slate-100 px-4 text-slate-700">
                <FiSearch className="h-5 w-5 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search food or restaurants"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-violet-700 px-5 text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Find Food
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {filteredSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setActiveSearch(item);
                  setQuery(item);
                }}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeSearch === item
                    ? "border-emerald-300 bg-emerald-300 text-slate-950"
                    : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-violet-800 transition hover:bg-slate-100"
            >
              <FiShoppingBag className="h-5 w-5" />
              Order Now
            </Link>
            <Link
              to="/recipe-generator"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Try Recipe AI
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:justify-self-end">
          <div className="w-full max-w-md rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-300">Current rush</p>
                <h2 className="mt-1 text-2xl font-bold">Lunch orders are open</h2>
              </div>
              <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-bold text-slate-950">
                Live
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Vendors", value: "24+" },
                { label: "Avg ETA", value: "28m" },
                { label: "Rating", value: "4.8" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-md bg-white/10 p-3 text-center">
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {[
                { icon: FiMapPin, label: "Pickup", value: "Main canteen" },
                { icon: FiClock, label: "Fastest delivery", value: "Library block" },
                { icon: FiTruck, label: "Tracking", value: "Map updates enabled" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-md bg-slate-950/35 p-3">
                    <Icon className="h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-sm font-semibold">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
