import {Alert, Form, Label, FormGroup, Input, Button, Spinner} from 'reactstrap'
import {useState } from 'react';
import useApi from '../helper/useApi';

// Compoentn for search menu
export default function VolcanoesSearch({setQuery})
{
  // Uses custom hook to fetch data
  const {loading, data, error} = useApi("http://4.237.58.241:3000/countries");

  // State variables for storing different values used for input
  const [selectedPopulatedWithinValue, setSelectedPopulatedWithinValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Possible values for populated within values
  const populatedWithinValues = [5, 10, 30, 100];

  // Handler for submit
  const submitHandler = (e) => 
  {
    e.preventDefault();
    // Sets the url and query depending on the selected populatedwithin value and country
    if(selectedCountry !== "")
    {
      let url = "";
      if(selectedPopulatedWithinValue === "")
      {
        url = `http://4.237.58.241:3000/volcanoes?country=${selectedCountry}`
      }
      else
      {
        url = `http://4.237.58.241:3000/volcanoes?country=${selectedCountry}&populatedWithin=${selectedPopulatedWithinValue}km`
      }
      setQuery({country : selectedCountry, value: selectedPopulatedWithinValue, url: url})
    }
  }
  // Displays an error message if error occurs
  if(error !== null)
  {
    return(<div className="searchEngine">
        <div style={{ width: '300px', margin: 'auto', textAlign: "center"}}>
            <Alert color="danger" className="mb-2">
                {error.message}
            </Alert>
        </div>
      </div>);
  }

  return(
      <div className="searchEngine">
        {loading ? <Spinner color='light'></Spinner>
        : (
          <Form onSubmit={submitHandler}>
          <Label>Country:</Label>
          {/* Drop down menu for displaying list a countries */}
        <FormGroup>
          <Input
            type="select"
            id="countrySelect"
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            
          >
            <option value="" disabled>
              Please select a country:
            </option>
            {data.map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Input>

          {/* Dropdown menu for displaying list of possible populated within values */}
        </FormGroup>
        <Label>Populated within:</Label>
        <FormGroup>
          <Input
            type="select"
            id="populatedWithin"
            value={selectedPopulatedWithinValue}
            onChange={e => setSelectedPopulatedWithinValue(e.target.value)}
          >
            <option value="">All</option>
            {populatedWithinValues.map(value => (
              <option key={value} value={value}>{`${value}km`}</option>
            ))}
          </Input>
        </FormGroup >
        <FormGroup>
        <Button type="submit" color="primary">Search</Button>
        </FormGroup>
      </Form>)}
    
    </div>
  );
}