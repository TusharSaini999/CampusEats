import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
const Modal = ({ message, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-xl w-11/12 max-w-md relative"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Notification
        </h2>
        <p className="text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg w-full"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};
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
  const [loading, setLoading] = useState(true);
  const [adloading, adsetLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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
      setLoading(true);
      const response = await axios.get(
        `https://campuseats-ki1c.onrender.com/menu/vend`,
        {
          params: { vendor_id: userId }
        }
      );
      const menuWithImages = response.data.map((item) => ({
        ...item,
        image_url: item.image_url
          ? `${item.image_url}`
          : `https://res.cloudinary.com/dsljhnanm/image/upload/v1738939765/menu_images/c199pic8rjpnosgnayzg.jpg`,
      }));
      setMenu(menuWithImages);
      setLoading(false);
      setInitialLoading(false);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  useEffect(() => {
    fetchOurMenu();
  }, [userId, menu]);
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
      setIsSubmitting(false);
      adsetLoading(true);
      toggleAddDishModal();
      const response = await fetch("https://campuseats-ki1c.onrender.com/menu/post-menu", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowModal(true);
        handleShowModal("Dish Added successfully!");
        adsetLoading(false);
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
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setIsEditing(true);
  };
  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`https://campuseats-ki1c.onrender.com/menu/update-menu/${editItem.id}`, {
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        category: editItem.category,
        availability: editItem.availability,
      });
      setShowModal(true);
      handleShowModal("Menu item updated successfully!");
      setIsEditing(false);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setAvailability("");
      await fetchOurMenu();
    } catch (error) {
      console.log(editItem);
      console.error("Error updating menu item:", error);
      setShowModal(true);
      handleShowModal("Failed to update menu item!");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`https://campuseats-ki1c.onrender.com/menu/delete-menu/${itemId}`);
      setShowModal(true);
      handleShowModal("Menu item Deleted successfully!");
      fetchOurMenu();
    } catch (error) {
      console.error("Error deleting item:", error);
      setShowModal(true);
      handleShowModal("Error deleting item!");
    }
  };
  if (adloading) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mt-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 text-sm">
                <th className="p-3 border border-gray-300">
                  <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-40 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Generate Skeleton Rows */}
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-lg"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-40 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (loading && initialLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mt-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 text-sm">
                <th className="p-3 border border-gray-300">
                  <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-40 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="p-3 border border-gray-300">
                  <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Generate Skeleton Rows */}
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-lg"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-40 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white shadow rounded-lg p-4 mt-6 max-w-7xl mx-auto">
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-1/2 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Dish</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Dish Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Availability</label>
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
                  onChange={(e) => setImageUrl(e.target.files[0])}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={toggleAddDishModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
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

      {/* Our Menu */}
      <div className="p-4 overflow-x-auto">
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
                    className="w-16 h-16 object-cover rounded-lg"
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
                  {item.delete === 1 ? (
                    <span className="text-red-500 italic">Item deleted</span>
                  ) : (
                    <>
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
                    </>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg md:max-w-md sm:max-w-sm max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Menu Item</h2>
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
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
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
  );

}

export default Overmenu;