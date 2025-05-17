import React, { useEffect, useState } from "react";
import axios from "axios";
import { Category } from "./types";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ nom: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const fetchCategories = async () => {
    const response = await axios.get<Category[]>("http://localhost:8080/api/v1/categories");
    setCategories(response.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingCategoryId !== null) {
      // PUT pour modifier
      await axios.put(`http://localhost:8080/api/v1/categories/${editingCategoryId}`, {
        nom: newCategory.nom,
      });
    } else {
      // POST pour ajouter
      await axios.post("http://localhost:8080/api/v1/categories", {
        nom: newCategory.nom,
      });
    }
    setShowModal(false);
    setNewCategory({ nom: "" });
    setIsEditing(false);
    setEditingCategoryId(null);
    fetchCategories();
  };

  const deleteCategory = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/v1/categories/${id}`);
    fetchCategories();
  };

  const editCategory = (category: Category) => {
    setNewCategory({ nom: category.nom });
    setEditingCategoryId(category.id);
    setIsEditing(true);
    setShowModal(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          className="border p-2 rounded w-1/3 text-xs font-bold text-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-green-500 text-white p-2 rounded text-xs font-bold"
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setNewCategory({ nom: "" });
            setEditingCategoryId(null);
          }}
        >
          + Add Category
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Category Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="px-4 py-2 text-xs font-bold">{cat.nom}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <PencilIcon
                    className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={() => editCategory(cat)}
                  />
                  <TrashIcon
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => deleteCategory(cat.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-600">Category Name</label>
                <input
                  type="text"
                  name="nom"
                  value={newCategory.nom}
                  className="w-full p-2 border rounded text-xs font-bold"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setNewCategory({ nom: "" });
                    setEditingCategoryId(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white p-2 rounded">
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
