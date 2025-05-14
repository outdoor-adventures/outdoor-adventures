
import './MapView.css';
import React from 'react';
import { useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

//this is for testing. this will be updated when we have more setup.
const MapView = () => {
    const [markerLocation, setMarkerLocation] = useState({
        latitude: 51.509865,
        longitude: -0.118092
    });

    return (

        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <div className='map-container'>
                <Map
                style={{ height: "500px", width: "100% ", borderRadius: "20px" }}
                defaultZoom={13}
                defaultCenter={markerLocation}
                gestureHandling={"greedy"}
                disableDefaultUI
                >
                    <Marker position={markerLocation} />
                </Map>
            </div>
        </APIProvider>
    );
};

export default MapView;