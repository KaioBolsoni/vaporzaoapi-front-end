import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Login from "../pages/Login";
import FirstAccess from "../pages/FirstAccess";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import GameDetails from "../pages/GameDetails";
import PublicProfile from "../pages/PublicProfile";
import Library from "../pages/Library";
import Wishlist from "../pages/Wishlist";
import CreateGame from "../pages/CreateGame";
import ManageGame from "../pages/ManageGame";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/first-access" element={<FirstAccess />} />

      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/catalogo" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
      <Route path="/jogos/:id" element={<ProtectedRoute><GameDetails /></ProtectedRoute>} />
      <Route path="/perfil/:matricula" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
      <Route path="/biblioteca" element={<ProtectedRoute><Library /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/criar-jogo" element={<ProtectedRoute><CreateGame /></ProtectedRoute>} />
      <Route path="/gerenciar-jogo/:id" element={<ProtectedRoute><ManageGame /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
