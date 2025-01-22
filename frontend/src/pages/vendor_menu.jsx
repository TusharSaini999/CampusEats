import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Overmenu = () => {
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [availability, setAvailability] = useState("");
  const [menu, setMenu] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAddDishModal = () => {
    setShowAddDishModal(!showAddDishModal);
  };
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  }, [setUserId]);
  const fetchOurMenu = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:4000/menu/vend`,
        {
          params: { vendor_id: userId }
        }
      );
      setMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  useEffect(() => {
    fetchOurMenu();
    const interval = setInterval(() => {
      fetchOurMenu();
    }, 3000); // 5000ms = 5 seconds

    return () => clearInterval(interval);
  }, [userId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !category || !image_url) {
      console.error("Please fill all the fields");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('vendor_id', userId);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('availability', availability);
    formData.append('image_url', image_url);
    try {
      const response = await fetch("http://localhost:4000/menu/post-menu", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Dish Added successfully");
        toggleAddDishModal();
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setAvailability("");
        setImageUrl("");
        await fetchOurMenu();
      } else {
        console.error("Error submitting menu:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:4000/menu/update-menu/${editItem.id}`, {
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        category: editItem.category,
        image_url: editItem.image_url,
        availability: editItem.availability,
      });
      alert("Menu item updated successfully!");
      setIsEditing(false);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setAvailability("");
      setImageUrl("");
      await fetchOurMenu();
    } catch (error) {
      console.log(editItem);
      console.error("Error updating menu item:", error);
      alert("Failed to update menu item.");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:4000/menu/delete-menu/${itemId}`);
      fetchOurMenu();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  return (
    <div className="bg-white shadow rounded-lg p-4 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Our Menu</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={toggleAddDishModal}
        >
          Add Dish
        </button>
      </div>

      {/* Add Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Dish</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Dish Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Availability
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Image</label>
                <input
                  type="file"
                  onChange={(e) => setImageUrl(e.target.files[0])} // store the file in state
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />

              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleAddDishModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${isSubmitting ? "opacity-50" : ""
                    }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/*Our Menu*/}
      <div className="p-4">
        {/* Menu List */}
        <div>
          <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 text-sm">
                <th className="p-3 border border-gray-300">Image</th>
                <th className="p-3 border border-gray-300">Dish Name</th>
                <th className="p-3 border border-gray-300">Description</th>
                <th className="p-3 border border-gray-300">Price</th>
                <th className="p-3 border border-gray-300">Category</th>
                <th className="p-3 border border-gray-300">Availability</th>
                <th className="p-3 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 transition-colors ${item.availability === 0 ? "bg-red-100" : ""
                    }`}
                >
                  <td className="p-3 border border-gray-300">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="p-3 border border-gray-300">{item.name}</td>
                  <td className="p-3 border border-gray-300">{item.description}</td>
                  <td className="p-3 border border-gray-300">Rs {item.price}</td>
                  <td className="p-3 border border-gray-300">{item.category}</td>
                  <td className="p-3 border border-gray-300">
                    {item.availability === 0 ? (
                      <span className="text-red-500 animate-pulse">
                        Out of Stock
                      </span>
                    ) : (
                      "Available"
                    )}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Edit Form */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Edit Menu Item</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Dish Name</label>
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    value={editItem.description}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        description: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="text"
                    value={editItem.price}
                    onChange={(e) =>
                      setEditItem({ ...editItem, price: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    type="text"
                    value={editItem.category}
                    onChange={(e) =>
                      setEditItem({ ...editItem, category: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Image URL</label>
                  <input
                    type="text"
                    value={editItem.image_url}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        image_url: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Availability</label>
                  <input
                    type="number"
                    value={editItem.availability}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        availability: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                    min="0" // To ensure no negative availability
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

export default Overmenu;