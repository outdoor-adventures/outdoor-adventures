import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, Circle, StandaloneSearchBox } from '@react-google-maps/api';

// places library 
const libraries = ["places"];

// Map container style sets size of map component
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

// Circle options for 20-mile radius IN PROGRESS
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
  const [address, setAddress] = useState(''); //stores entered address
  const [center, setCenter] = useState({ lat: 44.977753, lng: -93.265011 }); // Default to Minneapolis
  const [adventures, setAdventures] = useState([]); //stores nearby adventures
  const [radius] = useState(32187); // 20 miles in meters
  const [isLoading, setIsLoading] = useState(false); //indicates loading state
  const searchBoxRef = useRef(null); //references the google maps api autocomplete search bar

  //FILTERS
  //handle selected filter
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAbilityLevel, setSelectedAbilityLevel] = useState('');
  const [selectedCostLevel, setSelectedCostLevel] = useState('');
  //hold data from get request
  const [categories, setCategories] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [costs, setCosts] = useState([]);

useEffect(() => {
  axios.get('/api/dropdown/category')
        .then(response => {console.log('category data:', response.data)
          setCategories(response.data)});

  axios.get('/api/dropdown/ability')
        .then(response => {console.log('ability data:', response.data)
          setAbilities(response.data)});

  axios.get('/api/dropdown/cost')
        .then(response => {console.log('cost data:', response.data)
          setCosts(response.data)});
}, []);

  //YOU ARE NOT INSANE THIS IS SUPPOSED TO BE HERE
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Handles selection from autocomplete library
  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces(); //gets selected places
      if (places && places.length > 0) {
        const place = places[0]; //gets first result from autocomplete section
        setAddress(place.formatted_address); //update the useState with the formatted address
        
        // Get lat and lng from selected place/address
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        //changes center to selected location
        setCenter({ lat, lng });
      }
    }
  };
  
  // Function to search for adventures near the selected location
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true); //shows loading indicator while getting data

    
    try {
      console.log('Searching with coordinates:', center);
      // Fetch adventures within radius using the current center coordinates
      const adventuresResponse = await axios.get(`/api/adventures/nearby?lat=${center.lat}&lng=${center.lng}&radius=20&category=${selectedCategory}&abilityLevel=${selectedAbilityLevel}&costLevel=${selectedCostLevel}`);
      console.log('Response:', adventuresResponse.data);
      setAdventures(adventuresResponse.data); //update useState with retrieved data
    } catch (error) {
      console.error('Error searching adventures:', error); //testing console.error cuz ive never used it before
      // Show empty results with error
      setAdventures([]);
    } finally {
      setIsLoading(false); //stop loading indicator at the end of try
    }
  };

  return (
    <div className="location-search">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <div className="search-box-container">
          <StandaloneSearchBox //allows user to enter an address
            onLoad={ref => searchBoxRef.current = ref}
            onPlacesChanged={onPlacesChanged} //handle place selection
          >
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter an address"
              className="autocomplete-input"
            />
          </StandaloneSearchBox>

          {/* FILTERS  */}
          <div className='category-filter'>
            <select onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value=''>All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.category_name}</option>
              ))}
            </select>
          </div> {/*END CATEGORY FILTER*/}

          <div className='ability-filter'>
            <select onChange={(e) => setSelectedAbilityLevel(e.target.value)}>
              <option value=''>All Ability Levels</option>
              {abilities.map(ability => (
                <option key={ability.id} value={ability.id}>{ability.ability_level}</option>
              ))}
            </select>
          </div> {/*END ABILITY FILTER*/}

          <div className='cost-filter'>
            <select onChange={(e) => setSelectedCostLevel(e.target.value)}>
              <option value=''>All Cost Levels</option>
              {costs.map(cost => (
                <option key={cost.id} value={cost.id}>{cost.cost_level}</option>
              ))}
            </select>
          </div> {/*END COST FILTER*/}

          <button //on click api call to get adventures
            onClick={handleSearch} 
            disabled={isLoading}
            className="search-button"
          >
            {isLoading ? 'Searching...' : 'Find Adventures'}
          </button>
        </div>
        <GoogleMap //actual map component
          mapContainerStyle={mapContainerStyle}
          center={center} //center map on selected address
          zoom={10} //zoom in a lil so u can see
        >
          {/* sets center marker */}
          <Marker position={center} />
          
          {/* 20-mile radius circle */}
          <Circle
            center={center} //center circle on selected address
            radius={radius} //set radius to pre-determined radius size
            options={circleOptions} //sets circle options STILL IN PROGRESS
          />
          
          {/* adventure markers mapped out on the map */}
          {adventures.map(adventure => (
            <Marker
              key={adventure.id}
              position={{ lat: adventure.latitude, lng: adventure.longitude }}
              title={adventure.activity_name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      
      {/* SAMPLE MAPPED OUT ADVENTURES */}
      {adventures.length > 0 && (
        <div className="adventure-list">
          <h3>Adventures within 20 miles</h3>
          <ul>
            {adventures.map(adventure => (
              <li key={adventure.id}>
                {adventure.activity_name} - {adventure.address},
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