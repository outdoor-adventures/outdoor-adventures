import './MapView.css';
import react from 'react';
import { useState } from 'react';
import { Map, Marker } from '@vis.gl/react-google-maps';

//this is for testing. this will be updated when I (charlotte) understand the maps api better.
const MapView = () => {
    const [markerLocation, setMarkerLocation] = useState({
        latitude: 51.509865,
        longitude: -0.118092
    });

    return (
        <div className='map-container'>
            <Map
            style={{ borderRadius: "20px" }}
            defaultZoom={13}
            defaultCenter={markerLocation}
            gestureHandling={"greedy"}
            disableDefaultUI
            >
                <Marker position={markerLocation} />
            </Map>
        </div>
    );
}

export default MapView;