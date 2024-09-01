import {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import { Alert, Spinner} from 'reactstrap';
import LoggedInContext from '../components/LoggedInContext';
import MyMap  from '../components/map';
import BarChart from '../components/barchart';
import '../css/volcanoe.css'


// Page for individual volcano details
export default function Volcano() {
  // Context variable for loggedIn status
  const [loggedIn, setLoggedIn] = useContext(LoggedInContext);

  // State variables for handling fetch
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Extracting volcanoId from URL params
  const { volcanoId } = useParams();
  const url = `http://4.237.58.241:3000/volcano/${volcanoId}`;

  useEffect(() => {
    setLoading(true);
    // Configuring headers for fetch request
    const headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Adding Authorization header if user is logged in
    if (loggedIn) {
      headers.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }

    // Fetching volcano data
    fetch(url, headers)
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message); // Throw an Error with the error message from the response
          });
        }
        return response.json();
      })
      .then(response => setData(response))
      .catch(error => {
        // Changes the error message to be more informative when token expires
        if (error.message === 'JWT token has expired') {
          error.message = 'JWT token has expired. Please try logging in again.';
        }
        // Logs out user if token is expired
        setLoggedIn(false);
        // Sets error to be displayed
        setError(error);
      })
      .finally(() => setLoading(false));
  }, [url, loggedIn, setLoggedIn]);

  // Render error message if an error occurs
  if(error !== null)
  {
    return(
      <div className='volcanoe'>
        <div style={{ width: '300px', margin: 'auto', textAlign: "center"}}>
            <Alert color="danger" className="mb-2">
                {error.message}
            </Alert>
        </div>
    </div>
    );
  }


  return (     
    <div className='volcanoe'>

      {/* Div for information available to users without logging in */}
      <div className='freeInfo'>

          <div className="volcanoeInformation">
            {loading ? 
              <Spinner/>:
              <div>
              <h1>{data.name}</h1>
              <p><b>Country: </b>{data.country}</p>
              <p><b>Region: </b>{data.region}</p>
              <p><b>Subregion: </b>{data.subregion}</p>
              <p><b>Last Eruption: </b>{data.last_eruption}</p>
              <p><b>Summit: </b>{data.summit}</p>
              <p><b>Elevation: </b>{data.elevation}</p>
            </div>
              }
          </div>
          {/* Div for displaying map, displays a spinner if in loading state */}
          <div className='map'>
            {loading ?            
            <Spinner />
            :             
            <>
              <h2>Map of {data.name}</h2>
              <MyMap latitude={data.latitude} longitude={data.longitude} loading={loading}/>
            </>}
          </div>
        </div>
        {/* Div for displaying authenticated data */}
        <div className='extraInfo'>
          <>
              {
                loggedIn ? loading ? 
                <div className='chart'>
                  <Spinner/>
                </div>: 
                <BarChart 
                population_5km={data.population_5km} 
                population_10km={data.population_10km} 
                population_30km={data.population_30km} 
                population_100km={data.population_100km}/>
                : <></>
              }
          </>
          </div>
      </div>
  );
}