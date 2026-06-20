import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiClock, FiShoppingCart, FiStar } from "react-icons/fi";
import img1 from "../assets/1.jpg";
import img2 from "../assets/5.jpg";
import img3 from "../assets/6.jpg";
import img4 from "../assets/7.jpg";
import aaloParathaImg from "../images/aalo_paratha.png";
import coffeeImg from "../images/coffee.png";
import dalRiceImg from "../images/dal_rice.png";
import milkImg from "../images/milk.png";
import mixVegImg from "../images/mix_veg.png";
import palakPaneerImg from "../images/palak_paneer.png";

const categories = [
  { name: "Aalo Paratha", img: aaloParathaImg, mood: "Breakfast" },
  { name: "Coffee", img: coffeeImg, mood: "Drinks" },
  { name: "Dal Rice", img: dalRiceImg, mood: "Meals" },
  { name: "Palak Paneer", img: palakPaneerImg, mood: "Meals" },
  { name: "Milk", img: milkImg, mood: "Drinks" },
  { name: "Mix Veg", img: mixVegImg, mood: "Meals" },
];

const dishes = [
  {
    name: "Vanilla Burst Cake",
    description: "Soft vanilla cake for evening cravings and group treats.",
    rating: "4.8",
    type: "Sweet",
    time: "40-50 min",
    image: img1,
    pair: "Coffee",
  },
  {
    name: "Chocolate Shake",
    description: "Cold, rich, and built for post-class recharge breaks.",
    rating: "4.5",
    type: "Drink",
    time: "20-30 min",
    image: img2,
    pair: "Milk",
  },
  {
    name: "Veg Burger",
    description: "A quick snack with crisp veg filling and campus-friendly pricing.",
    rating: "4.6",
    type: "Snack",
    time: "25-35 min",
    image: img3,
    pair: "Mix Veg",
  },
  {
    name: "Paneer Pizza",
    description: "Cheesy paneer topping for a filling shared order.",
    rating: "4.7",
    type: "Snack",
    time: "20-30 min",
    image: img4,
    pair: "Palak Paneer",
  },
];

const CampusEats = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [selectedDish, setSelectedDish] = useState(dishes[0]);
  const navigate = useNavigate();

  const visibleDishes = useMemo(() => {
    const paired = dishes.filter((dish) => dish.pair === selectedCategory);
    return paired.length ? paired : dishes;
  }, [selectedCategory]);

  const searchFood = (name) => {
    navigate(`/search-results?query=${encodeURIComponent(name)}`);
  };

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Browse by craving</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">What do you feel like having?</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            Open Full Menu
            <FiArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const isActive = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                className={`group rounded-lg border p-3 text-left transition ${
                  isActive
                    ? "border-violet-700 bg-violet-700 text-white shadow-lg shadow-violet-200"
                    : "border-slate-200 bg-white text-slate-900 hover:border-violet-300 hover:shadow-md"
                }`}
              >
                <div className="aspect-square overflow-hidden rounded-md bg-slate-100">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="mt-3 block text-sm font-bold sm:text-base">{category.name}</span>
                <span className={`mt-1 block text-xs ${isActive ? "text-violet-100" : "text-slate-500"}`}>
                  {category.mood}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg bg-slate-950 p-5 text-white">
            <div className="overflow-hidden rounded-md">
              <img src={selectedDish.image} alt={selectedDish.name} className="h-72 w-full object-cover" />
            </div>
            <div className="mt-5">
              <p className="text-sm text-emerald-300">Selected pick</p>
              <h3 className="mt-1 text-2xl font-bold">{selectedDish.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{selectedDish.description}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                  <FiStar className="text-yellow-300" />
                  {selectedDish.rating}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                  <FiClock className="text-emerald-300" />
                  {selectedDish.time}
                </span>
              </div>
              <button
                type="button"
                onClick={() => searchFood(selectedDish.name)}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                <FiShoppingCart className="h-4 w-4" />
                Find this dish
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950">Featured dishes</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {visibleDishes.map((dish) => {
                const isActive = selectedDish.name === dish.name;
                return (
                  <button
                    key={dish.name}
                    type="button"
                    onClick={() => setSelectedDish(dish)}
                    className={`overflow-hidden rounded-lg border bg-white text-left transition hover:-translate-y-1 hover:shadow-lg ${
                      isActive ? "border-violet-700 ring-2 ring-violet-100" : "border-slate-200"
                    }`}
                  >
                    <img src={dish.image} alt={dish.name} className="h-44 w-full object-cover" />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-base font-bold text-slate-950">{dish.name}</h4>
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">
                          {dish.type}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-5 text-slate-600">{dish.description}</p>
                      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1 font-semibold text-yellow-600">
                          <FiStar />
                          {dish.rating}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiClock />
                          {dish.time}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusEats;
