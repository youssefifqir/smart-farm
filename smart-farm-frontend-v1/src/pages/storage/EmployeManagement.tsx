import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

type Employee = {
  id: number;
  nom: string;
  poste: string;
  salaire: number;
};

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: 0,
    nom: "",
    poste: "",
    salaire: 0,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:8036/api/employes");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nom: newEmployee.nom,
      poste: newEmployee.poste,
      salaire: Number(newEmployee.salaire),
    };

    if (newEmployee.id) {
      await axios.put(`http://localhost:8036/api/employes/${newEmployee.id}`, payload);
    } else {
      await axios.post("http://localhost:8036/api/employes", payload);
    }

    setShowModal(false);
    setNewEmployee({ id: 0, nom: "", poste: "", salaire: 0 });
    fetchEmployees();
  };

  const editEmployee = (employee: Employee) => {
    setNewEmployee(employee);
    setShowModal(true);
  };

  const deleteEmployee = async (id: number) => {
    await axios.delete(`http://localhost:8036/api/employes/${id}`);
    fetchEmployees();
  };

  
  const filteredEmployees = employees.filter((e) =>
    e.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

 
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded text-xs font-bold text-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-green-500 text-white p-2 rounded text-xs font-bold"
          onClick={() => {
            setNewEmployee({ id: 0, nom: "", poste: "", salaire: 0 });
            setShowModal(true);
          }}
        >
          + Add Employee
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((employee) => (
              <tr key={employee.id} className="border-t text-xs font-bold text-gray-700">
                <td className="px-4 py-2">{employee.nom}</td>
                <td className="px-4 py-2">{employee.poste}</td>
                <td className="px-4 py-2">{employee.salaire} dh</td>
                <td className="px-4 py-2 flex space-x-2">
                  <PencilIcon
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => editEmployee(employee)}
                  />
                  <TrashIcon
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => deleteEmployee(employee.id)}
                  />
                </td>
              </tr>
            ))}

            {paginatedEmployees.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-gray-600 text-lg font-bold mb-4">
              {newEmployee.id ? "Edit Employee" : "Add Employee"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-600">
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-600">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={newEmployee.nom}
                  className="w-full p-2 border rounded text-xs font-bold text-gray-600"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-600">Poste</label>
                <input
                  type="text"
                  name="poste"
                  value={newEmployee.poste}
                  className="w-full p-2 border rounded text-xs font-bold text-gray-600"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-600">Salaire</label>
                <input
                  type="number"
                  name="salaire"
                  value={newEmployee.salaire}
                  className="w-full p-2 border rounded text-xs font-bold text-gray-600"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded text-xs font-bold text-gray-500"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white p-2 rounded text-xs font-bold">
                  {newEmployee.id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
