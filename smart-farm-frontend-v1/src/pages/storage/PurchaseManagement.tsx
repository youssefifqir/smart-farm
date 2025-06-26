import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

/* ---------- Types ---------- */
type Purchase = {
  id: number;
  quantite: number;
  prixTotal: number;
  dateAchat: string;
  produit?: { id: number; name: string };
  fournisseur?: { id: number; nom: string };
};
type Product = { id: number; nom: string };
type Supplier = { id: number; nom: string };

/* ---------- Constantes pagination ---------- */
const ITEMS_PER_PAGE = 9;

const PurchaseManagement: React.FC = () => {
  /* ---------- States ---------- */
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products,  setProducts]  = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<number | "">("");
  const [currentPage, setCurrentPage]     = useState(1);

  /* ---------- Form state ---------- */
  const [form, setForm] = useState({
    id: 0,
    quantite: 0,
    prixTotal: 0,
    dateAchat: "",
    produitId: 0,
    fournisseurId: 0,
  });

  /* ---------- Initial fetch ---------- */
  useEffect(() => {
    (async () => {
      const [pchs, prods, sups] = await Promise.all([
        axios.get<Purchase[]>("http://localhost:8080/api/achats"),
        axios.get<Product[]>("http://localhost:8080/api/v1/products"),
        axios.get<Supplier[]>("http://localhost:8080/api/v1/suppliers"),
      ]);
      setPurchases(pchs.data);
      setProducts(prods.data);
      setSuppliers(sups.data);
    })();
  }, []);

  /* ---------- Form helpers ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () =>
    setForm({
      id: 0,
      quantite: 0,
      prixTotal: 0,
      dateAchat: "",
      produitId: 0,
      fournisseurId: 0,
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      quantite   : Number(form.quantite),
      prixTotal  : Number(form.prixTotal),
      dateAchat  : form.dateAchat,
      produit    : { id: Number(form.produitId) },
      fournisseur: { id: Number(form.fournisseurId) },
    };

    if (form.id) {
      await axios.put(`http://localhost:8080/api/achats/id/${form.id}`, payload);
    } else {
      await axios.post("http://localhost:8080/api/achats", payload);
    }
    setShowModal(false);
    resetForm();
    const { data } = await axios.get<Purchase[]>("http://localhost:8080/api/achats");
    setPurchases(data);
  };

  const editPurchase = (p: Purchase) => {
    setForm({
      id: p.id,
      quantite: p.quantite,
      prixTotal: p.prixTotal,
      dateAchat: p.dateAchat.slice(0, 16),
      produitId: p.produit?.id ?? 0,
      fournisseurId: p.fournisseur?.id ?? 0,
    });
    setShowModal(true);
  };

  const deletePurchase = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/achats/id/${id}`);
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  /* ---------- Filtering + pagination ---------- */
  const filtered = purchases.filter(
    p =>
      (p.produit?.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) &&
      (selectedSupplier === "" || p.fournisseur?.id === selectedSupplier)
  );

  useEffect(() => setCurrentPage(1), [searchTerm, selectedSupplier]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx    = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated   = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);


  return (
    <div className="p-6">
      {/* Barre de recherche + filtre + bouton add */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center w-2/3">
          <input
            type="text"
            placeholder="Search purchases..."
            className="border p-2 rounded w-1/2 text-xs font-bold text-gray-600"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded text-xs font-bold text-gray-700"
            value={selectedSupplier}
            onChange={e =>
              setSelectedSupplier(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">Filter supplier</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.nom}</option>
            ))}
          </select>
        </div>
        <button
          className="bg-green-500 text-white p-2 rounded text-xs font-bold"
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          + Add Purchase
        </button>
      </div>

      {/* Tableau des achats */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total (MAD)</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr key={p.id} className="border-t text-xs font-bold text-gray-700">
                <td className="px-4 py-2">{p.produit?.name}</td>
                <td className="px-4 py-2">{p.fournisseur?.nom}</td>
                <td className="px-4 py-2">{p.quantite}</td>
                <td className="px-4 py-2">{p.prixTotal}</td>
                <td className="px-4 py-2">{p.dateAchat.slice(0, 10)}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <PencilIcon
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => editPurchase(p)}
                  />
                  <TrashIcon
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => deletePurchase(p.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal d'ajout / édition */}
     {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 className="text-gray-600 text-lg font-bold mb-4">
        {form.id ? "Edit Purchase" : "Add Purchase"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3 text-gray-600">
        {/* Product */}
        <div>
          <label className="block mb-1 text-xs font-bold">Product</label>
          <select
            name="produitId"
            value={form.produitId}
            onChange={handleChange}
            className="w-full p-2 border rounded text-xs font-bold"
            required
          >
            <option value="">-- choose product --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div>
          <label className="block mb-1 text-xs font-bold">Supplier</label>
          <select
            name="fournisseurId"
            value={form.fournisseurId}
            onChange={handleChange}
            className="w-full p-2 border rounded text-xs font-bold"
            required
          >
            <option value="">-- choose supplier --</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.nom}</option>
            ))}
          </select>
        </div>

        {/* Quantity + Total Price side by side */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1 text-xs font-bold">Quantity</label>
            <input
              name="quantite"
              type="number"
              placeholder="Qty"
              className="w-full p-2 border rounded text-xs font-bold"
              value={form.quantite}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-xs font-bold">Total Price (MAD)</label>
            <input
              name="prixTotal"
              type="number"
              placeholder="Total Price"
              className="w-full p-2 border rounded text-xs font-bold"
              value={form.prixTotal}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 text-xs font-bold">Purchase Date</label>
          <input
            type="datetime-local"
            name="dateAchat"
            value={form.dateAchat}
            onChange={handleChange}
            className="w-full p-2 border rounded text-xs font-bold"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            {form.id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default PurchaseManagement;
