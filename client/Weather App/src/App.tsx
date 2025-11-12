import './App.css'
import { Link, Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
      <header className="flex justify-between items-center px-8 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Weather Finder</h1>
        <nav className="flex gap-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
          Home
          </Link>
          <Link to="/saved" className="text-gray-700 hover:text-blue-600 font-medium">
          My Saved Places
          </Link>
        </nav>
      </header>

      {/* The Outlet is where the matched page component will be rendered */}
      <Outlet />
    </div>
  );
};

export default App;