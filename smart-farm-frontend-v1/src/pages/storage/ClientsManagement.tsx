import React, { useEffect, useState } from "react";
import { Client } from "./types";
import axios from "axios";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState<Client>({ id: 0, nom: "", adresse: "", telephone: "" });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchClients = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/clients");
    setClients(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.id) {
      await axios.put(`http://localhost:8080/api/v1/clients/${newClient.id}`, newClient);
    } else {
      await axios.post("http://localhost:8080/api/v1/clients", newClient);
    }
    setShowModal(false);
    fetchClients();
    setNewClient({ id: 0, nom: "", adresse: "", telephone: "" });
  };

  const deleteClient = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/v1/clients/${id}`);
    fetchClients();
  };

  const editClient = (client: Client) => {
    setNewClient(client);
    setShowModal(true);
  };

  useEffect(() => {
    fetchClients();
  }, []);

 
  const filteredClients = clients.filter((client) =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          className="border p-2 rounded w-1/3 text-xs font-bold text-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-green-500 text-white p-2 rounded text-xs font-bold"
          onClick={() => {
            setNewClient({ id: 0, nom: "", adresse: "", telephone: "" });
            setShowModal(true);
          }}
        >
          + Add Client
        </button>
      </div>

      <table className="min-w-full text-sm text-left bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Telephone</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id} className="border-t text-xs font-bold text-gray-700">
              <td className="px-4 py-2">{client.nom}</td>
              <td className="px-4 py-2">{client.adresse}</td>
              <td className="px-4 py-2">{client.telephone}</td>
              <td className="px-4 py-2 flex space-x-2">
                <PencilIcon
                  className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={() => editClient(client)}
                />
                <TrashIcon
                  className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => deleteClient(client.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-gray-600 text-lg font-bold mb-4">
              {newClient.id ? "Edit Client" : "Add Client"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-600">
              <input
                type="text"
                name="nom"
                value={newClient.nom}
                placeholder="Client Name"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="adresse"
                value={newClient.adresse}
                placeholder="Adresse"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="telephone"
                value={newClient.telephone}
                placeholder="Telephone"
                className="w-full p-2 border rounded"
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
                <button type="submit" className="bg-green-500 text-white p-2 rounded text-xs font-bold">
                  {newClient.id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
