import React, { useState, useRef } from 'react';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';

function AutoCompleteInput() {
    const [address, setAddress] = useState(''); //store selected address
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; //import api key 
    const libraries = ["places"]; //select places library from google places api
    const searchBoxRef = useRef(null); //references the google maps autocomplete search bar

    const onPlacesChanged = () => {
        if (searchBoxRef.current) {
            const places = searchBoxRef.current.getPlaces(); //gets selected places
            if (places && places.length > 0) {
                const place = places [0]; //gets the first result from autocomplete
                setAddress(place.formatted_address); //sets the address useState to the address of the selected place

                // now get lat and lng from the selected place
                const location = place.geometry.location; //this gets the full location of the selected place
                const lat = location.lat(); //this sets our nee varibale "lat" to the lat value of the full location
                const lng = location.lng(); //this does the same as one above but for lng
            }
        }
    } //end onPlacesChanged

    return (
        <div>
            <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                <div className="address-autocomplete-input">
                    <StandaloneSearchBox
                    onLoad={ref => searchBoxRef.current = ref}
                    onPlacesChanged={onPlacesChanged} //handle place selection
                    >
                        <input 
                        type="text"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Enter an Address"
                        className="autocomplete-input"/>
                        
                    </StandaloneSearchBox>
                </div>
            </LoadScript>
        </div>
    );

} //end AutoCompleteFunction

export default AutoCompleteInput;