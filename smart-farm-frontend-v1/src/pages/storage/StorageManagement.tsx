// src/pages/storage/StorageManagement.tsx
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import Card from './card';

// types -------------------------------------------------------------------
type MonthRow = { month: string; achats: number; ventes: number };

// constantes ----------------------------------------------------------------
const ITEMS = [
  { path: '/storage-management',          label: 'Analytics'  }, // racine
  { path: '/storage-management/products', label: 'Products'   },
  { path: '/storage-management/categories', label: 'Categories' },
  { path: '/storage-management/clients',    label: 'Clients'    },
  { path: '/storage-management/suppliers',  label: 'Suppliers'  },
  { path: '/storage-management/purchase',   label: 'Purchase'   },
  { path: '/storage-management/sale',       label: 'Sale'       },
  { path: '/storage-management/employee',   label: 'Employee'   },
];

// composant -----------------------------------------------------------------
const StorageManagement = () => {
  /* ----- analytics states ----- */
  const [totalPurchases, setTotalPurchases] = useState<number>(0);
  const [totalSales,     setTotalSales]     = useState<number>(0);
  const [chartData,      setChartData]      = useState<MonthRow[]>([]);

  /* ----- fetch analytics once ----- */
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8036/api/achats/total').then(r => r.json()),
      fetch('http://localhost:8036/api/ventes/total').then(r => r.json()),
      fetch('http://localhost:8036/api/statistiques/ventes-achats-mensuels').then(r => r.json()),
    ])
      .then(([totA, totV, rows]) => {
        setTotalPurchases(Number(totA));
        setTotalSales(Number(totV));
        setChartData(
          rows.map((row: any) => ({
            month: row.month,
            achats: Number(row.achats),
            ventes: Number(row.ventes),
          }))
        );
      })
      .catch(console.error);
  }, []);

  /* ----- savoir si on est sur /storage-management (racine) ----- */
  const location = useLocation();
  const atRoot =
    location.pathname === '/storage-management' ||
    location.pathname === '/storage-management/';

  /* ----- UI ----- */
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Storage Management</h2>

      {/* barre d’onglets --------------------------------------------------- */}
      <div className="flex flex-wrap gap-4 border-b pb-2">
        {ITEMS.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/storage-management'} // « end » pour la racine
            className={({ isActive }) =>
              `px-3 py-1 text-sm font-medium rounded-t
               ${isActive ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* analytics (uniquement sur la racine) ----------------------------- */}
      {atRoot && (
        <>
          {/* cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card title="Total Achats"  value={totalPurchases} color="green" />
            <Card title="Total Ventes"  value={totalSales}     color="brown" />
          </div>

          {/* bar chart */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Monthly Purchases vs Sales
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventes"  name="Sales"      fill="#D2691E" />
                <Bar dataKey="achats"  name="Purchases"  fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ici s’injectent les sous-pages (Products, Categories, …) -------- */}
      <Outlet />
    </div>
  );
};

export default StorageManagement;
