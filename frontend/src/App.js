import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Volcanoes from "./pages/volcanoes";
import Register from "./pages/register";
import Volcano from './pages/volcano';
import Login from './pages/login';
import { jwtDecode } from 'jwt-decode';
import LoggedInContext from './components/LoggedInContext';
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/App.css"


// Main entry point of the application
function App()
{
  // State variable for keeping track of loggedIn status of current user
  const [loggedIn, setLoggedIn] = useState(false);

  // Checks if the user's token is expired or not if they reload the application
  useEffect(
    ()=>{
      // Gets the token from localStorage
      const token = localStorage.getItem('token');
      // Checks if it's null
      if(localStorage.getItem('token') !== null)
      {
        // Decodes token and sets loggedIn status by comparing expiry data to current time
        const decoded = jwtDecode(token)
        if(decoded.exp > Date.now()/1000)
        {
          setLoggedIn(true);
        }
        else
        {
          localStorage.clear()
          setLoggedIn(false);
        }
      }
    },[])

  return (
    // Sets context provider for loggedIn status
    <LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>
    <BrowserRouter>
    {/* Sets routes for diffrent pages */}
    <div className="App">
      <Header/>
      <Routes>
         <Route path="/" element={<Home/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/register" element={<Register/>} />
        <Route path="/volcanoes" element={<Volcanoes/>} />
        <Route path="/volcanoe/:volcanoId" element={<Volcano loggedIn={loggedIn}/>} />
        {/* Redirects users to homepage if they try routes not defined above */}
         <Route path='/*' element={<Navigate to="/"/>} />
       </Routes>
       <Footer/>
    </div>
    </BrowserRouter>
    </LoggedInContext.Provider>
  );
}
      
export default App;
