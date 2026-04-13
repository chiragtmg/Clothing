import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="px-4">
      <Outlet />
    </div>
  );
};

export default AdminLayout;