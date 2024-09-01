import Table from '../components/table';
import VolcanoesSearch from '../components/searchenginer';
import { useState } from 'react';
import Results from '../components/results';
import "../css/volcanoes.css"

// Volcanoes search page
export default function Volcanoes()
{
  const [query, setQuery] = useState(null);
  return(
    <div className='volcanoes'>
      <h1>Search Volcanoes</h1>
      <VolcanoesSearch setQuery={setQuery}/>
      {
        // If query is not set, displays the below message in the table
        query === null ? <Table overlayMessage={'<span class="ag-overlay-no-rows-center">Please select a country</span>'} data={[]}/>
        :
        <Results query={query}/>
      }
    </div>
  );
}



