import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import FirstAccess from "./pages/FirstAccess";
import Catalog from "./pages/Catalog";
import GameDetails from "./pages/GameDetails";
import PublicProfile from "./pages/PublicProfile";
import ProtectedRoute from "./components/ProtectRouter/ProtectedRoute";
import Library from "./pages/Library";
import Wishlist from "./pages/Wishlist";
import CreateGame from "./pages/CreateGame";
import ManageGame from "./pages/ManageGame";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/first-access" element={<FirstAccess />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/criar-jogo"
        element={
          <ProtectedRoute>
            <CreateGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gerenciar-jogo/:id"
        element={
          <ProtectedRoute>
            <ManageGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/catalogo"
        element={
          <ProtectedRoute>
            <Catalog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/biblioteca"
        element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        } />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />
      <Route
        path="/jogos/:id"
        element={
          <ProtectedRoute>
            <GameDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil/:matricula"
        element={
          <ProtectedRoute>
            <PublicProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
