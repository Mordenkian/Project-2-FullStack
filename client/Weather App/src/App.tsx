import './App.css'
import { Link, Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
      <header>
        <h1>Weather Finder</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/saved">My Saved Places</Link>
        </nav>
      </header>
      {/* The Outlet is where the matched page component will be rendered */}
      <Outlet />
    </div>
  );
};

export default App;