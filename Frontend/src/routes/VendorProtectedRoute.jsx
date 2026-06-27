import { Navigate } from 'react-router-dom';

const VendorProtectedRoute = ({ children }) => {
  const vendorToken = localStorage.getItem('vendorToken');

  if (!vendorToken) {
    return <Navigate to="/vendor-login" replace />;
  }

  return children;
};

export default VendorProtectedRoute;