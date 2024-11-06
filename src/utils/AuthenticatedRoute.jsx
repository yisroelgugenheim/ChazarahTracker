import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserId } from "./getUserId";

const isAuthorized = async () => {
  const user = await getUserId();
  return !!user;
};

const ProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthorization = async () => {
      const result = await isAuthorized();
      setAuthorized(result);
    };

    checkAuthorization();
  }, []);

  if (authorized === null) {
    return null;
  }

  if (!authorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
