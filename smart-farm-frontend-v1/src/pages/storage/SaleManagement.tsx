import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

/* ---------- types ---------- */
import { Product } from "./types";
import { Client } from "./types";
type Vente = {
  id: number;
  quantite: number;
  prixTotal: number;
  dateVente: string;
  produit?:{ id: number; name: string };
  client?: Client;
};

/* ---------- pagination ---------- */
const ITEMS_PER_PAGE = 9;

const SaleManagement: React.FC = () => {
  /* ---------- state ---------- */
  const [sales,    setSales]    = useState<Vente[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients,  setClients]  = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedClient, setSelectedClient] = useState<number | "">("");
  const [currentPage, setCurrentPage]     = useState(1);

  const [form, setForm] = useState({
    id: 0,
    quantite: 0,
    prixTotal: 0,
    dateVente: "",
    produitId: 0,
    clientId: 0,
  });

  /* ---------- fetch data ---------- */
  useEffect(() => {
    (async () => {
      const [vts, prods, cls] = await Promise.all([
        axios.get<Vente[]>("http://localhost:8080/api/ventes"),
        axios.get<Product[]>("http://localhost:8080/api/v1/products"),
        axios.get<Client[]>("http://localhost:8080/api/v1/clients"),
      ]);
      setSales(vts.data);
      setProducts(prods.data);
      setClients(cls.data);
    })();
  }, []);

  /* ---------- helpers ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () =>
    setForm({ id:0, quantite:0, prixTotal:0, dateVente:"", produitId:0, clientId:0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      quantite : Number(form.quantite),
      prixTotal: Number(form.prixTotal),
      dateVente: form.dateVente,
      produit  : { id: Number(form.produitId) },
      client   : { id: Number(form.clientId) },
    };
    form.id
      ? await axios.put(`http://localhost:8080/api/ventes/${form.id}`, payload)
      : await axios.post("http://localhost:8080/api/ventes", payload);

    setShowModal(false);
    resetForm();
    const { data } = await axios.get<Vente[]>("http://localhost:8080/api/ventes");
    setSales(data);
  };

  const editSale = (v: Vente) => {
    setForm({
      id: v.id,
      quantite: v.quantite,
      prixTotal: v.prixTotal,
      dateVente: v.dateVente.slice(0,16),
      produitId: v.produit?.id ?? 0,
      clientId : v.client?.id  ?? 0,
    });
    setShowModal(true);
  };

  const deleteSale = async (id:number) => {
    await axios.delete(`http://localhost:8080/api/ventes/${id}`);
    setSales(prev => prev.filter(s => s.id !== id));
  };

  /* ---------- filtering + pagination ---------- */
  const filtered = sales.filter(
    v =>
      (v.produit?.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) &&
      (selectedClient === "" || v.client?.id === selectedClient)
  );

  // si recherche / filtre change -> revenir page 1
  useEffect(() => setCurrentPage(1), [searchTerm, selectedClient]);

  const totalPages     = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx       = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSales = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  /* ---------- UI ---------- */
  return (
    <div className="p-6">
      {/* barre recherche + filtre + add */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center w-2/3">
          <input
            placeholder="Search by product..."
            className="border p-2 rounded text-xs font-bold text-gray-600 w-1/2"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded text-xs font-bold text-gray-700"
            value={selectedClient}
            onChange={e =>
              setSelectedClient(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">Filter Client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>
        <button
          className="bg-green-500 text-white p-2 rounded text-xs font-bold"
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          + Add Sale
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total (MAD)</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map(v => (
              <tr key={v.id} className="border-t text-xs font-bold text-gray-700">
                <td className="px-4 py-2">{v.produit?.name }</td>
                <td className="px-4 py-2">{v.client?.nom ?? "N/A"}</td>
                <td className="px-4 py-2">{v.quantite}</td>
                <td className="px-4 py-2">{v.prixTotal}</td>
                <td className="px-4 py-2">{v.dateVente.slice(0,10)}</td>
                <td className="px-4 py-2 flex gap-2">
                  <PencilIcon
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => editSale(v)}
                  />
                  <TrashIcon
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => deleteSale(v.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-600 text-white"
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
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-gray-600 text-lg font-bold mb-4">
              {form.id ? "Edit Sale" : "Add Sale"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-gray-600">
              {/* product */}
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
              {/* client */}
              <div>
                <label className="block mb-1 text-xs font-bold">Client</label>
                <select
                  name="clientId"
                  value={form.clientId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-xs font-bold"
                  required
                >
                  <option value="">-- choose client --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
              {/* qty + total */}
              <div className="flex gap-2">
                  <label className="block mb-1 text-xs font-bold">Quantity</label>
                <input
                  name="quantite"
                  type="number"
                  placeholder="Qty"
                  className="w-1/2 p-2 border rounded text-xs font-bold"
                  value={form.quantite}
                  onChange={handleChange}
                  required
                />
                  <label className="block mb-1 text-xs font-bold">TotalPrice</label>
                <input
                  name="prixTotal"
                  type="number"
                  placeholder="Total"
                  className="w-1/2 p-2 border rounded text-xs font-bold"
                  value={form.prixTotal}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* date */}
              <div>
                <label className="block mb-1 text-xs font-bold">Date</label>
                <input
                  name="dateVente"
                  type="datetime-local"
                  className="w-full p-2 border rounded text-xs font-bold"
                  value={form.dateVente}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-3 py-2 rounded text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
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

export default SaleManagement;
