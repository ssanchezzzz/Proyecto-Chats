import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 fixed top-0 w-full shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cielogram</h1>
        <div className="flex space-x-6 text-lg">
          <Link to="/" className="hover:underline hover:text-yellow-300">Inicio</Link>
          <Link to="/profile" className="hover:underline hover:text-yellow-300">Perfil</Link>
          <Link to="/chat" className="hover:underline hover:text-yellow-300">Chat</Link>
          <Link to="/login" className="hover:underline hover:text-yellow-300">Iniciar Sesión</Link>
          <Link to="/register" className="hover:underline hover:text-yellow-300">Registro</Link>
        </div>
      </div>
    </nav>
  );
}

