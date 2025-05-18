/**
 * Protected Admin Route Component
 * 
 * This component acts as a security gateway for admin-only sections of the application.
 * It protects routes by checking if the current user has admin privileges before allowing access.
 * If the user isn't authenticated or doesn't have admin rights, they are redirected to an error page.
 * 
 * Key features:
 * - Authentication verification through AdminService
 * - Automatic redirection of unauthorized users
 * - Support for both direct child components and nested routes (via Outlet)
 * - Used in App.jsx to protect the Admin dashboard and all its sub-sections
 * 
 * This component is a critical part of the application's security architecture,
 * ensuring that sensitive administrative functionality remains accessible only to
 * authorized personnel.
 */
import { Navigate, Outlet } from "react-router-dom";
import AdminService from "../service/AdminService";

/**
 * ProtectedAdminRoute component
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render if authentication succeeds
 * @returns {JSX.Element} Either the protected content or a redirect to the error page
 */
const ProtectedAdminRoute = ({ children }) => {
  // Check if user is an admin and authenticated
  // The adminOnly method verifies both authentication state and admin role
  const isAdmin = AdminService.adminOnly();
  
  if (!isAdmin) {
    // If not authenticated or not an admin, redirect to error page
    // The 'replace' prop replaces the current history entry instead of adding a new one
    // This prevents users from navigating back to protected routes with the browser back button
    return <Navigate to="/error" replace />;
  }

  // If authentication succeeded, render either:
  // 1. The children directly passed to this component (if any), or
  // 2. The Outlet component which renders any nested route components
  return children ? children : <Outlet />;
};

export default ProtectedAdminRoute;