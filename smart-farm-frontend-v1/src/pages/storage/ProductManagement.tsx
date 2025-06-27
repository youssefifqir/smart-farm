import React, { useEffect, useState } from "react";
import { Product, Category } from "./types";
import axios from "axios";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  const [newProduct, setNewProduct] = useState({
    id: 0,
    nom: "",
    quantite: 0,
    prix: 0,
    categoryId: 0,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchProducts = async () => {
    const response = await axios.get<Product[]>(
      "http://localhost:8036/api/v1/products"
    );
    setProducts(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get<Category[]>(
      "http://localhost:8036/api/v1/categories"
    );
    setCategories(response.data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nom: newProduct.nom,
      quantite: Number(newProduct.quantite),
      prix: Number(newProduct.prix),
      category: { id: Number(newProduct.categoryId) },
    };

    if (newProduct.id) {
      await axios.put(
        `http://localhost:8036/api/v1/products/${newProduct.id}`,
        payload
      );
    } else {
      await axios.post("http://localhost:8036/api/v1/products", payload);
    }

    setShowModal(false);
    setNewProduct({ id: 0, nom: "", quantite: 0, prix: 0, categoryId: 0 });
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    await axios.delete(`http://localhost:8036/api/v1/products/${id}`);
    fetchProducts();
  };

  const editProduct = (product: Product) => {
    setNewProduct({
      id: product.id,
      nom: product.nom,
      quantite: product.quantite,
      prix: product.prix,
      categoryId: product.category?.id ?? 0,
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Reset current page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const filteredProducts = products.filter(
    (p) =>
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || p.category?.id === selectedCategory)
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center w-2/3">
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 rounded w-1/2 text-xs font-bold text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded text-xs font-bold  text-gray-700"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option className="text-xs font-bold text-gray-600" value="">
              filter
            </option>
            {categories.map((cat) => (
              <option className="text-xs font-bold" key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>

        <button
          className="bg-green-500 text-white p-2 rounded text-xs font-bold"
          onClick={() => {
            setNewProduct({ id: 0, nom: "", quantite: 0, prix: 0, categoryId: 0 });
            setShowModal(true);
          }}
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((prod) => (
              <tr key={prod.id} className="border-t text-xs font-bold text-gray-700">
                <td className="px-4 py-2">{prod.nom}</td>
                <td className="px-4 py-2">{prod.quantite}</td>
                <td className="px-4 py-2">{prod.prix} dh</td>
                <td className="px-4 py-2">{prod.category?.nom}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <PencilIcon
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => editProduct(prod)}
                  />
                  <TrashIcon
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => deleteProduct(prod.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-600 text-white"
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 rounded ${
                pageNum === currentPage ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-600 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-gray-600 text-lg font-bold mb-4">
              {newProduct.id ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-600">
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-600">
                  Product Name
                </label>
                <input
                  type="text"
                  name="nom"
                  value={newProduct.nom}
                  className="w-full p-2 border rounded text-xs font-bold text-gray-500 "
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-600">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantite"
                  value={newProduct.quantite}
                  className="w-full p-2 border rounded text-xs font-bold text-gray-600"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-600">
                  Price (€)
                </label>
                <input
                  type="number"
                  name="prix"
                  value={newProduct.prix}
                  step="0.01"
                  className="w-full p-2 border rounded text-xs font-bold text-gray-600"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-600">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={newProduct.categoryId}
                  className="w-full p-2 border rounded text-xs font-bold text-gray-600 "
                  onChange={handleChange}
                  required
                >
                  <option
                    className="text-xs font-bold text-gray-500"
                    value=""
                  >
                    Select category
                  </option>
                  {categories.map((cat) => (
                    <option
                      className="text-xs font-bold text-gray-600"
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-gray-400 text-gray-600 text-xs font-bold"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded text-xs font-bold"
                >
                  {newProduct.id ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
