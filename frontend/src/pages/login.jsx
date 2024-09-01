import { useState, useContext } from "react";
import {Link} from 'react-router-dom'
import { Form, Button, Alert, FormGroup, Label, Input} from "reactstrap";
import RedirectComponent from "./redirect";
import delay from "../helper/delay";
import LoggedInContext from "../components/LoggedInContext";
import '../css/login.css';

// Logins page
export default function Login(){
  // Context variables for loggedIn status
  const [loggedIn, setLoggedIn] = useContext(LoggedInContext);

  // State variables to store username and password for controlled input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State variables for handling error and loading status from fetch
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // A custom function which returns a custom promise given username and password
  const login = (username, password) =>
  {
      return new Promise((resolve, reject)=>
      {
        fetch(`http://4.237.58.241:3000/user/login`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: username, password: password }),
          })
          .then((response) => {
            if(!response.ok){
              return response.json().then(error => {
                  throw new Error(error.message); 
              });     
            }
            return response.json(); 
          })
          .then(response => {
            setLoggedIn(true);
            localStorage.setItem("token", response.token);
            localStorage.setItem("username", username);
            resolve();
          })
          .catch((error) => {
            reject(error);
          })
        }
      );
  }

    // Function for handling submit
    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      // Waits 500ms before actually sending the POST request
      await delay(500);
      login(username, password)
        .catch(error=>{setError(error)})
        .finally(setLoading(false));
    
    };

    // Handlers for password and username
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
      };

      const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    // If user sucessfully logs in, redirects to homepage
    if(loggedIn)
    {
      return(
        <RedirectComponent message={`Sucessfully logged in as: ${username}`}/>
      );
    }
  
    return(
      <div className="login">
        <Form className="shadow p-4" onSubmit={handleSubmit}>
        <div className="h4 mb-2 text-center white-text"><label>Login</label></div>
        {/* Displays error if error occurs */}
            {error !== null &&            
            <Alert
                color="danger"
                className="mb-2"
                isOpen={error !== null}
                toggle={() => setError(null)}
            >
              {error.message}
            </Alert>}
            {/* FormGroup for username */}
          <FormGroup className="mb-2" id="username">
            <Label className="loginLabel">Username</Label>
            {/* Displays invalid input if error occurs */}
            <Input
             invalid={error !== null}
              type="text"
              value={username}
              placeholder="Username"
              onChange={handleUsernameChange}
              required
            />
          </FormGroup>
          {/* FormGroup for password */}
          <FormGroup className="mb-2" id="password">
            <Label className="loginLabel">Password</Label>
            <Input
             invalid={error !== null}
              type="password"
              value={password}
              placeholder="Password"
              onChange={handlePasswordChange}
              required
            />
          </FormGroup>
          {/* Different states for button to accomodate loading states */}
          {loading ? (
                <Button className="w-100" color="primary" type="submit" disabled aria-label="Loading...">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                    </Button>
                ) : (
                    <Button className="w-100" color="primary" type="submit" aria-label="Loading">
                    Log In
                    </Button>
                )}
            <div className="d-grid justify-content-end">
                <Label className="loginLabel">Not a member? <Link to="/register">Register</Link>
                </Label>
            </div>
        </Form>
      </div>
    );
  };
  
