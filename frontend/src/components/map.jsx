import { Map, Marker } from "pigeon-maps"

// Component for map
export default function MyMap({ latitude, longitude, loading }) {

    // Parses the coordinates from string to float type
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);
  
    // Check for undefined values as the map does not display even after prop changes
    if(loading || latitude === undefined || longitude === undefined)
    {
      return(
        <Map defaultZoom={6}>
        </Map>
      );
    }
    // Returns map comoponent with configured coordinates and settings 
    return (  
        <Map defaultZoom={6} center={[parsedLatitude, parsedLongitude]}>
          <Marker color='red' width={50} anchor={[parsedLatitude, parsedLongitude]}/>
        </Map>
    );
  }