import React from 'react';
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

//declares center (this can be aything)
const center = { lat: 47.2000, lng: -91.3670 } //example: slit rock lighthouse minnesota

function MapExample() {

    return (
        <>
            <h1>Map view example</h1>
                {/* APIprovider sends the api key stored in your env file to google to verify with every request */}
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    {/* Div size can be changed to whatever you want the map size to be */}
                    <div style={{ height: '400px', width: '100%'}}>
                        <Map
                        // Sets a default center
                        defaultCenter={center}
                        // Sets default zoom
                        defaultZoom={13}
                        //this makes the actual map the same size as the div
                        style={{ width: '100$%', height: '100%' }}
                        >
                            <Marker position={center} />
                        </Map>
                    </div>
                </APIProvider>
           </>
    );
}

    //TO USE THE MAP, FOLLOW INSTRUCTIONS BELOW
        /* in order for the map to function you MUST have the api key stored 
        LOCALLY in your .env file. the key name must be VITE_GOOGLE_MAPS_API_KEY for it to work. */
            // MAP EXAMPLE
            // import the MapExample component and use as shown
            // This div can be resized however needed and it will resize the map as well
                //COPY AND PASTE CODE BELOW TO SEE MAP
                    // <div style={{ height: '400px', width: '100%' }}>
                    // <MapExample />
                    // </div>

export default MapExample;