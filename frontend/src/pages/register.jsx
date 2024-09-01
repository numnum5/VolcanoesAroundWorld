import {useState} from "react";
import { Form, Button, Alert, FormGroup, Label, Input } from 'reactstrap';
import {Link} from 'react-router-dom';
import RedirectComponent from "./redirect";
import delay from "../helper/delay";
import '../css/register.css'

export default function Register()
{
    // States for storing username, password
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // A function which returns a customised promise for sending POST login request
    const register = (username, password) =>
    {
        return new Promise((resolve, reject)=>
        {
          // Sends a POST request to user/register endpoint with username and password in payload
          fetch(`http://4.237.58.241:3000/user/register`, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: username, password: password }),
            })
            .then((response) => {
              // Throws an error if response is not ok
              if(!response.ok){
                return response.json().then(errorData => {
                    throw new Error(errorData.message); // Throw an Error with the error message from the response
                });  
              }
              return response.json(); 
            })
            .then(response => {
              setStatus(true);
              resolve();
            })
            .catch((error) => {
              reject(error)
            })
          }
        );
    }

    // Handler functions
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // A function for validating email format, throws an error if invalid
    // Source https://piyush132000.medium.com/mastering-email-validation-in-javascript-multiple-approaches-ae718546160b
    function validateEmail(email) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if(!regex.test(email))
      {
        throw new Error("Username should be in Email format");
      }
     }

    // An ayscnrhnous function for handling submit from the input form
    async function handleSubmit(event)
    {
        // Prevents default occurence
        event.preventDefault();
        // Sets loading true to turn Button state
        setLoading(true);
        // Awaits for 500ms for clear feedback
        await delay(500);
        try{
          validateEmail(username);
          register(username, password)
          .catch(error=>{setError(error)})
          .finally(setLoading(false));
        }
        catch(e)
        {
          setError(e);
          setLoading(false);
        }

    };
    
    // If user is sucessfully registered redirects user to the Redirect page
    if(status)
    {
      return(
        <RedirectComponent message={`Sucessfully registered as user: ${username}`}/>
      )
    }

    return(
      <div
        className="register">
        <Form className="shadow p-4" onSubmit={handleSubmit}>
          <div className="h4 mb-2 text-center white-text"><label>Register</label></div>
          {/* Shows an alert component containing error message when error exists */}
            {error !== null &&            
            <Alert
                color="danger"
                className="mb-2"
                isOpen={error !== null}
                toggle={() => setError(null)}
            >
              {error.message}
            </Alert>}

            {/* Input form for username */}
          <FormGroup className="mb-2" id="username">
            <Label className="registerLabel">Username</Label>
            <Input
             invalid={error !== null}
              type="text"
              value={username}
              placeholder="Username"
              onChange={handleUsernameChange}
              required
            />
          </FormGroup>
            
            {/* Input form for password */}
          <FormGroup className="mb-2" id="password">
            <Label className="registerLabel">Password</Label>
            {/* Input configuration */}
            <Input
             invalid={error !== null}
              type="password"
              value={password}
              placeholder="Password"
              onChange={handlePasswordChange}
              required
            />
          </FormGroup>
          {/* Different states for Buttons */}
          {loading ? (
                <Button className="w-100" color="primary" type="submit" disabled>
                    Processing...
                </Button>
                ) : (
                <Button className="w-100" color="primary" type="submit">
                    Register
                </Button>
                )}
            {/* A link to login page */}
            <div className="d-grid justify-content-end">
                <Label className="registerLabel">Already a member? <Link to="/login">Login</Link>
                </Label>
            </div>
        </Form>
      </div>
    );
}