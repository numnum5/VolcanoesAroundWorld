import useApi from '../helper/useApi';
import Table from './table';
import { Alert } from 'reactstrap';

// A component for displaying 
export default function Results({query})
{
  // Deconstructs the values returned from useApi
  const { loading, data, error } = useApi(query.url);

  // Displays an alert message with error when error occurs from fetch
  if(error !== null)
  {
    return(
      <div style={{ width: '300px', margin: 'auto', textAlign: "center"}}>
      <Alert color="danger" className="mb-2">
          {error.message}
      </Alert>
      </div>
    );
  }

  return(
    <div>
      {/* Table displays "loading..." when the state is in loading */}
      {loading ? 
      <Table overlayMessage={'<span class="ag-overlay-no-rows-center">Loading...</span>'} data={[]}/>
      :
      <Table data={data}/>}

    </div>
  );
}