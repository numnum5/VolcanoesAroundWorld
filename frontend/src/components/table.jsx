import {useNavigate} from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; 


// Component for displaying data in AG-grid table
export default function Table({overlayMessage, data})
{

  const navigate = useNavigate();
  // Handler for when row is clicked, navigates the user to individual volcano page
  const onRowClicked = (row)=>navigate(`/volcanoe/${row.data.id}`)
  
  // Configuration for columns
  const columns = [
    {
      headerName: "Id",
      field: "id",
      sortable: true,
      filter: "agNumberColumnFilter"
    },
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: true
    },
    {
      headerName: "Region",
      field: "region",
      sortable: true,
      filter: true
    },
    {
      headerName: "Subregion",
      field: "subregion",
      sortable: true,
      filter: true
    }]

  return(
    <div className="results">
      <div className="ag-theme-quartz" style={{ height: "600px", width: "800px"}}>
        <AgGridReact
            rowData={data}
            columnDefs={columns}
            overlayNoRowsTemplate={overlayMessage}
            pagination={true}
            paginationPageSize={20}
            onRowClicked={onRowClicked}
        />
      </div>
    </div>
  );
}