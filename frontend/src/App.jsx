import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";

const API_URL = "http://localhost:5000";

const CATEGORIES = ["fitness", "tech", "Shwarma"];

const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    categories: "",
    price: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    filterProducts(searchTerm, selectedCategory);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (term, category) => {
    const filtered = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(term);
      const categoryMatch = category === "" || product.categories === category;
      return nameMatch && categoryMatch;
    });
    setFilteredProducts(filtered);
  };

  const handleInputChange = (e, isNewProduct = false) => {
    const { name, value } = e.target;
    if (isNewProduct) {
      setNewProduct({ ...newProduct, [name]: value });
    } else {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post(`${API_URL}/products/add`, newProduct);
      setNewProduct({ name: "", description: "", categories: "", price: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.patch(
        `${API_URL}/products/${editingProduct.id}`,
        editingProduct
      );
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* Search and Filter */}
      <div className="flex mb-4">
        <div className="relative flex-grow mr-2">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 pl-8 border rounded"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          className="p-2 border rounded"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Product Form */}
      <div className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => handleInputChange(e, true)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => handleInputChange(e, true)}
          className="w-full p-2 mb-2 border rounded"
        />
        <select
          name="categories"
          value={newProduct.categories}
          onChange={(e) => handleInputChange(e, true)}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select a Category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => handleInputChange(e, true)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <PlusCircle className="inline-block mr-2" />
          Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            {editingProduct && editingProduct.id === product.id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="description"
                  value={editingProduct.description}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border rounded"
                />
                <select
                  name="categories"
                  value={editingProduct.categories}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="">Select a Category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button
                  onClick={handleUpdateProduct}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-600">{product.categories}</p>
                <p className="text-green-600 font-bold">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    <Edit className="inline-block" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    <Trash2 className="inline-block" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
