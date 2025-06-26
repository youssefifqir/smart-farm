import React, { useEffect, useState } from "react";
import { Supplier } from "./types";
import axios from "axios";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

const FournissManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    id: 0,
    nom: "",
    adresse: "",
    telephone: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const fetchSuppliers = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/suppliers");
    setSuppliers(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSupplier.id) {
      await axios.put(
        `http://localhost:8080/api/v1/suppliers/${newSupplier.id}`,
        newSupplier
      );
    } else {
      await axios.post("http://localhost:8080/api/v1/suppliers", newSupplier);
    }
    setShowModal(false);
    fetchSuppliers();
    setNewSupplier({ id: 0, nom: "", adresse: "", telephone: "" });
  };

  const deleteSupplier = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/v1/suppliers/${id}`);
    fetchSuppliers();
  };

  const editSupplier = (supplier: Supplier) => {
    setNewSupplier(supplier);
    setShowModal(true);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((s) =>
    s.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Suppliers..."
          className="border p-2 rounded w-1/3 text-xs font-bold text-gray-600"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          className="bg-green-500 text-white p-2 rounded text-xs font-bold"
          onClick={() => {
            setNewSupplier({ id: 0, nom: "", adresse: "", telephone: "" });
            setShowModal(true);
          }}
        >
          + Add Supplier
        </button>
      </div>

      <table className="min-w-full text-sm text-left bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSuppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className="border-t text-xs font-bold text-gray-700"
            >
              <td className="px-4 py-2">{supplier.nom}</td>
              <td className="px-4 py-2">{supplier.adresse}</td>
              <td className="px-4 py-2">{supplier.telephone}</td>
              <td className="px-4 py-2 flex space-x-2">
                <PencilIcon
                  className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => editSupplier(supplier)}
                />
                <TrashIcon
                  className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => deleteSupplier(supplier.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
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
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-gray-600 text-lg font-bold mb-4">
              {newSupplier.id ? "Edit Supplier" : "Add Supplier"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-600">
              <input
                type="text"
                name="nom"
                value={newSupplier.nom}
                placeholder="Supplier Name"
                className="w-full p-2 border rounded block mb-1 text-xs font-bold text-gray-600"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="adresse"
                value={newSupplier.adresse}
                placeholder="Adresse"
                className="w-full p-2 border rounded block mb-1 text-xs font-bold text-gray-600"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="telephone"
                value={newSupplier.telephone}
                placeholder="Telephone"
                className="w-full p-2 border rounded block mb-1 text-xs font-bold text-gray-600"
                onChange={handleChange}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded text-xs font-bold text-gray-500"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded text-xs font-bold"
                >
                  {newSupplier.id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FournissManagement;
