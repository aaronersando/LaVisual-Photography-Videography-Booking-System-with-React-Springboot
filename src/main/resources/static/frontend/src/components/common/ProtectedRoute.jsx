import { Navigate, Outlet } from "react-router-dom";
import AdminService from "../service/AdminService";

const ProtectedAdminRoute = ({ children }) => {
  // Check if user is an admin and authenticated
  const isAdmin = AdminService.adminOnly();
  
  if (!isAdmin) {
    // Redirect to 404 error page if not authenticated or not an admin
    return <Navigate to="/error" replace />;
  }

  // Return either children or outlet
  return children ? children : <Outlet />;
};

export default ProtectedAdminRoute;