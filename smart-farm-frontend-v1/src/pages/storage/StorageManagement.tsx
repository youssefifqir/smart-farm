import { Outlet } from 'react-router-dom';

const StorageManagement = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Storage Management</h2>
      {}
      <Outlet />
    </div>
  );
};

export default StorageManagement;