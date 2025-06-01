import React, { useState } from 'react';
import { GoogleMap, } from '@react-google-maps/api';

//mapContainerStyle can be used to change size of map 
const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

function StaticMap() {
    const [center, setCenter] = useState({ lat: 44.977753, lng: -93.265011 }); //default minneapolis

    return (
        <div className='static-map-div'>
                <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={4}
                >
                </GoogleMap>
        </div>
    )

} //end StaticMap

export default StaticMap;