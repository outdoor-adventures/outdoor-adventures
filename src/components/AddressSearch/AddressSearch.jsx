import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, Circle, StandaloneSearchBox, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import './AddressSearch.css';
import BasicModal from '../UserPage/BasicModal/BasicModal';
import FavoriteButton from './FavoriteButton/FavoriteButton';


// Map container style sets size of map component
const mapContainerStyle = {
  width: '60vw',
  height: '40vw'
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
  const centerRef = useRef(center); //looks weird but using to try and prevent google maps marker re-render

  //FILTERS
  //handle selected filter
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAbilityLevel, setSelectedAbilityLevel] = useState('');
  const [selectedCostLevel, setSelectedCostLevel] = useState('');
  //hold data from get request
  const [categories, setCategories] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [costs, setCosts] = useState([]);

  //used for infoOpen
  const [infoOpen, setInfoOpen] = useState({});

  //navigation
  const navigate = useNavigate();

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
        
        const newCenter = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };

        setCenter(newCenter); //update state
        centerRef.current = newCenter; //updates the ref
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

        <div className='map-list-container'>
        <GoogleMap //actual map component
          mapContainerStyle={mapContainerStyle}
          center={centerRef.current} //center map on selected address
          zoom={8} //zoom in a lil so u can see
        >
            
          {/* sets center marker */}
          <Marker position={centerRef.current} />
          
          {/* 20-mile radius circle */}
          <Circle
            center={center} //center circle on selected address
            radius={radius} //set radius to pre-determined radius size
            options={circleOptions} //sets circle options STILL IN PROGRESS
          />
          
          {/* adventure markers mapped out on the map */}
          {adventures.map(adventure => (

            // RETURN

            //onMouseOver makes changes when a mouse is over the component its added too
            //onMouseOut makes changes when the mouse moves off of the component its added too

            <Marker
              key={adventure.id}
              position={{ lat: adventure.latitude, lng: adventure.longitude }}
              title={adventure.activity_name}

              onMouseOver={() => {
                setInfoOpen(prev => ({ ...prev, [adventure.id]: true }))}}
              onMouseOut={() => setInfoOpen(prev => ({ ...prev, [adventure.id]: false }))}
              onClick={() => navigate(`/adventures/${adventure.id}`)}
            >
            {/* INFO BOX */}
                {infoOpen[adventure.id] && (
                  <InfoWindow>
                    <div className='map-pin-info'>
                      {adventure.activity_name} <br />
                      {adventure.description} <br />
                      {adventure.address}
                    </div>
                  </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>

      
      <div className='list-column'>
      {/* SAMPLE MAPPED OUT ADVENTURES */}
      <div className='list-section'>
      {adventures.length > 0 && (
        <div className="adventure-list">
          <h3>Adventures within 20 miles</h3>

            {adventures.map(adventure => (
              
              <div key={adventure.id} className='adventure-card'>
                {/* <AdventureItem adventure={adventure}/> */}
                <div className='adventure-info'>


                <p>
                      <img src={`http://localhost:5001/uploads/${adventure.photo}`}
                      alt={adventure.photo}
                      className='browse-adventure-image' />

                    </p>

                    <p className='browse-title'>{adventure.activity_name}</p>
                    <p>Category: {adventure.category_name}</p>
                    <p>Cost: {adventure.cost_level}</p>
                    <p>Ability Level: {adventure.ability_level}</p>
                    <p>{adventure.link}</p>
                    <p>{adventure.address}</p>
                    <FavoriteButton />
                    <BasicModal adv={adventure.id} />
                    
                    
                    {/* Rendering the adventure image using Multer */}

                    
                    {/* <ToggleFavorites /> */}
                    {/* - {adventure.address},
                    {adventure.distance && ` - ${adventure.distance.toFixed(1)} miles`} */}

                </div>
              </div>
            ))}
        </div>
      )}
    </div>
    </div>
    </div>
    </div>
  );
}

export default AddressSearch;