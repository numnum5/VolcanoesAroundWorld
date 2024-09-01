import { Link, NavLink, useNavigate } from "react-router-dom";
import {useContext} from 'react'
import LoggedInContext from "./LoggedInContext";

// Component for navigation bar
export default function Nav() {

  // Delcares function for navigating user to other pages
  const navigate = useNavigate();
  // Context variable for loggedIn status
  const [loggedIn, setLoggedIn] = useContext(LoggedInContext);

  // Handler for logging out current user
  const handleLogout = () => {
      // Sets loggedIn status as halse
      setLoggedIn(false)
      // Removes neccsarry information from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('username')
      navigate('/')
  }
  return (
    <nav>
      {/* Shows different navigation bar depending on loggedIn status */}
      {loggedIn ? (
          <>
            <NavLink to="/" activeClassName="active">Home</NavLink>
            <NavLink to="/volcanoes" activeClassName="active">Volcanoes</NavLink>
            <Link onClick={handleLogout}>Logout</Link>
            <label>User: {localStorage.getItem("username")}</label>
          </>
        ) : (
          <>
            <NavLink to="/" activeClassName="active">Home</NavLink>
            <NavLink to="/volcanoes" activeClassName="active">Volcanoes</NavLink>
            <NavLink to="/register" activeClassName="active">Register</NavLink>
            <NavLink to="/login" activeClassName="active">Login</NavLink>
          </>
        )}
    </nav>
  );
}

