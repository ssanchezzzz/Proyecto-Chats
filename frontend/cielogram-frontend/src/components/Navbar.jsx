import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white p-4 fixed top-0 w-full shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider">Cielogram</h1>
        <div className="flex space-x-6 text-lg items-center">
          <Link to="/" className="text-black hover:underline hover:text-yellow-300 transition">Inicio</Link>
          {user ? (
            <>
              <Link to="/chat" className="text-black relative hover:underline hover:text-yellow-300 transition">
                Chat
              </Link>
              <Link to="/profile" className="text-black hover:underline hover:text-yellow-300 transition">Perfil</Link>
              <button
                onClick={handleLogout}
                className="hover:underline hover:text-yellow-300 bg-transparent border-none cursor-pointer transition"
                style={{ background: "none", padding: 0 }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline hover:text-yellow-300 transition">Iniciar Sesión</Link>
              <Link to="/register" className="hover:underline hover:text-yellow-300 transition">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

