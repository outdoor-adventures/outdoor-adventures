import React, { useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

//mapContainerStyle can be used to change size of map 
const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

function StaticMap() {
    const [center, setCenter] = useState({ lat: 44.977753, lng: -93.265011 }); //default minneapolis
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <div className='static-map-div'>
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={4}
                >
                </GoogleMap>
            </LoadScript>
        </div>
    )

} //end StaticMap

export default StaticMap;