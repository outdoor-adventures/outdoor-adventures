import React, { useState, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, Circle, StandaloneSearchBox } from '@react-google-maps/api';

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

// Circle options for 20-mile radius
const circleOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

function AddressSearch() {
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState({ lat: 44.977753, lng: -93.265011 }); // Default to Minneapolis
  const [adventures, setAdventures] = useState([]);
  const [radius] = useState(32187); // 20 miles in meters
  const [isLoading, setIsLoading] = useState(false);
  const searchBoxRef = useRef(null);

  // Google Maps API Key 
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Libraries to load with Google Maps
  const libraries = ["places"];
  
  // Handle place selection from autocomplete
  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        setAddress(place.formatted_address);
        
        // Get location from the first place
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        setCenter({ lat, lng });
      }
    }
  };
  
  // Function to search for adventures near the selected location
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Searching with coordinates:', center);
      // Fetch adventures within radius using the current center coordinates
      const adventuresResponse = await axios.get(`/api/adventures/nearby?lat=${center.lat}&lng=${center.lng}&radius=20`);
      console.log('Response:', adventuresResponse.data);
      setAdventures(adventuresResponse.data);
    } catch (error) {
      console.error('Error searching adventures:', error);
      // Show empty results instead of error
      setAdventures([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="location-search">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <div className="search-box-container">
          <StandaloneSearchBox
            onLoad={ref => searchBoxRef.current = ref}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter an address"
              className="autocomplete-input"
            />
          </StandaloneSearchBox>
          <button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="search-button"
          >
            {isLoading ? 'Searching...' : 'Find Adventures'}
          </button>
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        >
          {/* Center marker */}
          <Marker position={center} />
          
          {/* 20-mile radius circle */}
          <Circle
            center={center}
            radius={radius}
            options={circleOptions}
          />
          
          {/* Adventure markers */}
          {adventures.map(adventure => (
            <Marker
              key={adventure.id}
              position={{ lat: adventure.latitude, lng: adventure.longitude }}
              title={adventure.activity_name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      
      {adventures.length > 0 && (
        <div className="adventure-list">
          <h3>Adventures within 20 miles</h3>
          <ul>
            {adventures.map(adventure => (
              <li key={adventure.id}>
                {adventure.activity_name} - {adventure.city}, {adventure.state}
                {adventure.distance && ` - ${adventure.distance.toFixed(1)} miles`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddressSearch;