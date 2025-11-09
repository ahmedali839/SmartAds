import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../services/authService";

const ProtectedWrapper = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true = authenticated, false = not authenticated
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        setLoading(true);
        const res = await checkAuth();
        if (res.status === "success") {
          setIsAuth(true);
        }
      } catch (err) {
        console.error(err.message);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children
};

export default ProtectedWrapper;
