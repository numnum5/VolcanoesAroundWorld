import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import "../css/redirect.css"


// A redirect component for redirecting user to the homepage
export default function RedirectComponent({ message }) {
  const navigate = useNavigate();

  // Redirects users after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000); 

    return ()=> clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="redirect">
      <div className="card">
      <h1 color="green">{message}</h1>
      <Spinner style={{ display: 'block', margin: 'auto' }} />
      <p>Redirecting home page</p>
      </div>
    </div>
  );
}
