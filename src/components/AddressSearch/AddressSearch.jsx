import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, Circle, StandaloneSearchBox, OverlayView } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import './AddressSearch.css';
import BasicModal from '../BasicModal/BasicModal';
import FavoriteButton from './FavoriteButton/FavoriteButton';


// Map container style sets size of map component
const mapContainerStyle = {
  width: '60%',
  height: '70vh'
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
  const [userLocation, setUserLocation] = useState(null); //stores user's current location
  const [adventures, setAdventures] = useState([]); //stores nearby adventures
  const [selectedRadius, setSelectedRadius] = useState(100); // selected radius in miles
  const [isLoading, setIsLoading] = useState(false); //indicates loading state
  const searchBoxRef = useRef(null); //references the google maps api autocomplete search bar
  const centerRef = useRef(center); //looks weird but using to try and prevent google maps marker re-render
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  // Helper function to get correct image URL
  const getImageUrl = (photo) => {
    if (!photo) return '';
    // If it's already a full URL (starts with http), use it directly
    if (photo.startsWith('http')) {
      return photo;
    }
    // If it starts with /uploads, it's already a relative path
    if (photo.startsWith('/uploads/')) {
      return photo;
    }
    // Otherwise, it's a legacy filename, use local path
    return `/uploads/${photo}`;
  };

  //FILTERS
  //handle selected filter
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAbilityLevel, setSelectedAbilityLevel] = useState('');
  const [selectedCostLevel, setSelectedCostLevel] = useState('');
  //hold data from get request
  const [categories, setCategories] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [costs, setCosts] = useState([]);

  const radiusOptions = [5, 10, 20, 30, 40, 50, 100, 150, 200, 250, 300];

  const [hoveredAdventure, setHoveredAdventure] = useState(null);
  const [selectedAdventure, setSelectedAdventure] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);

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
  
    // Get user's location on component mount
  getUserLocation();
}, []);

 useEffect(() => {
  const handleClickOutside = (event) => {
    if (showFiltersDropdown && !event.target.closest('.filters-dropdown') && !event.target.closest('.filters-button')) {
      setShowFiltersDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showFiltersDropdown]);

// Function to get user's current location
const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(userPos);
        setCenter(userPos);
        centerRef.current = userPos;
        
        // Automatically search for adventures around user's location
        await searchAdventures(userPos);
      },
      (error) => {
        console.log('Geolocation error:', error);
        // Keep default center if geolocation fails
      }
    );
  }
};

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


  
  // Function to search for adventures near a specific location
  const searchAdventures = async (location = center) => {
    setIsLoading(true);
    
    try {
      console.log('Searching with coordinates:', location);
      const adventuresResponse = await axios.get(`/api/adventures/nearby?lat=${location.lat}&lng=${location.lng}&radius=${selectedRadius}&category=${selectedCategory}&abilityLevel=${selectedAbilityLevel}&costLevel=${selectedCostLevel}`);
      console.log('Response:', adventuresResponse.data);
      setAdventures(adventuresResponse.data);
    } catch (error) {
      console.error('Error searching adventures:', error);
      setAdventures([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to search for adventures near the selected location
  const handleSearch = async (e) => {
    e.preventDefault();
    await searchAdventures();
  };

  return (
    <div className="location-search">
        <div className="search-box-container">
          <div className="search-input-group">
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
        <div style={{ position: 'relative' }}></div>
        <button 
          className="filters-button"
          onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
        > Filters </button>

        {/* Filters Dropdown */}
        <div className={`filters-dropdown ${showFiltersDropdown ? 'show' : ''}`}>
          <div className='radius-filter'>
            <select onChange={(e) => setSelectedRadius(parseInt(e.target.value))} value={selectedRadius}>
              {radiusOptions.map(radius => (
                <option key={radius} value={radius}>{radius} Miles</option>
              ))}
            </select>
          </div>
         {/*END RADIUS FILTER*/}
        
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
          </div>
          </div>
  

          <button //on click api call to get adventures
            onClick={handleSearch} 
            disabled={isLoading}
            className="search-button"
          >
            {isLoading ? 'Searching...' : 'Find Adventures'}
          </button>
        </div>

        <div className='map-list-container'>
          <div className='map-container'>
            <div className='google-map'>
        <GoogleMap //actual map component
          mapContainerStyle={mapContainerStyle}
          center={centerRef.current} //center map on selected address
          zoom={8} //zoom in a lil so u can see
          className="google-map-component"
          options={{
            clickableIcons: false,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          }}
        >
            
          {/* sets center marker */}
          <Marker position={centerRef.current} />
          
          {/* User location marker */}
          {userLocation && (
            <Marker 
              position={userLocation}
              icon={{
                url: 'data:image/svg+xml;base64,' + btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                  </svg>
                `),
                scaledSize: { width: 20, height: 20 }
              }}

            />
          )}
          
          {/* radius circle */}
          <Circle
            center={center} //center circle on selected address
            radius={selectedRadius * 1609.34} //convert miles to meters
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
              icon={{
                url: 'data:image/svg+xml;base64,' + btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="40" viewBox="0 0 25 40">
                    <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 27.5 12.5 27.5s12.5-15 12.5-27.5C25 5.6 19.4 0 12.5 0z" fill="#053570"/>
                    <circle cx="12.5" cy="12.5" r="6" fill="white"/>
                  </svg>
                `),
                scaledSize: { width: 25, height: 40 }
              }}
              onMouseOver={() => {
                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                setHoveredAdventure(adventure);
              }}
              onMouseOut={() => {
                hoverTimeoutRef.current = setTimeout(() => {
                  setHoveredAdventure(null);
                }, 100);
              }}
              onClick={() => {
                setSelectedAdventure(adventure);
                setModalOpen(true);
              }}
            />
          ))}
          
          {/* Custom overlay on hover */}
          {hoveredAdventure && (
            <OverlayView
              position={{ lat: hoveredAdventure.latitude, lng: hoveredAdventure.longitude }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div 
                className='map-pin-info' 
                style={{ 
                  width: '180px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
                  transform: 'translate(-50%, -100%)',
                  marginTop: '-12px',
                  overflow: 'hidden',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                }}
                onMouseLeave={() => {
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredAdventure(null);
                  }, 100);
                }}
                onClick={() => {
                  setSelectedAdventure(hoveredAdventure);
                  setModalOpen(true);
                }}
              >
                <img 
                  src={getImageUrl(hoveredAdventure.photo)} 
                  alt={hoveredAdventure.activity_name}
                  style={{ 
                    width: '100%', 
                    height: '90px', 
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{ padding: '10px' }}>
                  <h3 style={{ 
                    margin: '0', 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: '#2c3e50',
                    lineHeight: '1.3'
                  }}>
                    {hoveredAdventure.activity_name}
                  </h3>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid #f8f9fa'
                }} />
              </div>
            </OverlayView>
          )}
        </GoogleMap>
        </div>
        </div>
        

      
      <div className='list-column'>
      {/* SAMPLE MAPPED OUT ADVENTURES */}
      <div className='list-section'>
      {adventures.length > 0 && (
        <div className="adventure-list">
          <h3>Adventures within {selectedRadius} miles</h3>

            {adventures.map(adventure => (
              
              <div key={adventure.id} className='adventure-card'>
                {/* <AdventureItem adventure={adventure}/> */}
                <div className='adventure-info' style={{minWidth: '50%', width: '100%'}}>


                <p>
                      <img src={getImageUrl(adventure.photo)}
                      alt={adventure.activity_name}
                      className='browse-adventure-image'
                      style={{ height: '100%', minWidth: '17vh', maxHeight: '30vh', objectFit: 'cover' }} />
                    </p>

                    <div className="title-favorite-container">
                      <p className='browse-title'>{adventure.activity_name}</p>
                      <FavoriteButton adventureId={adventure.id} />
                    </div>
                    <p>Category: {adventure.category_name}</p>
                    <p>Cost: {adventure.cost_level}</p>
                    <p>Ability Level: {adventure.ability_level}</p>
                    <p>{adventure.address}</p>
                    <div className="link-button-container">
                      <p className="adventure-link">{adventure.link}</p>
                      <div className="modal-button-container">
                        <BasicModal adv={adventure} />
                      </div>
                    </div>
                    

                </div>
              </div>
            ))}
        </div>
      )}
    </div>
    </div>
    </div>
    
    {/* Modal for map marker clicks */}
    {modalOpen && selectedAdventure && (
      <BasicModal 
        adv={selectedAdventure} 
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAdventure(null);
        }}
      />
    )}
    </div>
  );
}

export default AddressSearch;