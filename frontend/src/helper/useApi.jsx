import {useState, useEffect} from 'react';


// A custom hook for fetching data on a given url
export default function useApi(url)
{
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=>
  {
    // Set error and loading 
    setError(null);
    setLoading(true);
    fetch(url)
    .then(response=> {
      // If response is not ok, throw error 
      if(!response.ok){
        return response.json().then(error => {
          throw new Error(error.message); // Throw an Error with the error message from the response
        });
      }
      return response.json()
    })
    .then(res=> setData(res))
    .catch(error=> setError(error))
    .finally(()=> setLoading(false))
  }, [url])

  return{
    loading,
    data,
    error,
  };
}