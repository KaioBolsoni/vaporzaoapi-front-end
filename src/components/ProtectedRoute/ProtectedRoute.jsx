import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h2>Verificando sessão...</h2>
      </div>
    );
  }

  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
