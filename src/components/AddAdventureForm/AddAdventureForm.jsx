import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store'
import './AddAdventureForm.css';
import Nav from '../Nav/Nav';

//GOOGLE MAPS
import { StandaloneSearchBox } from '@react-google-maps/api';
//end

const AddAdventureForm = () => {
    const user = useStore((store) => store.user);
    const [formData, setFormData] = useState({
      price: '',
      category: '',
      difficulty: '',
      address: '',
      link: '',
      name: '',
      description: '',
      photo: '',
      latitude: '',
      longitude: '',
    });
    
    const [options, setOptions] = useState({
        price: [],
        category: [],
        difficulty: [],
      });

      const [loading, setLoading] = useState(false);

      const [message, setMessage] = useState('');

      //GOOGLE MAPS
      const searchBoxRef = useRef(null);
      //end

      useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [priceRes, categoryRes, difficultyRes] = await Promise.all([
                    axios.get('/api/dropdown/cost'),
                    axios.get('/api/dropdown/category'),
                    axios.get('/api/dropdown/ability'),
                  ]);
                  //updated the fetch option 
                  setOptions({
                    price: priceRes.data,
                    category: categoryRes.data,
                    difficulty: difficultyRes.data,
                  });
                } catch (error) {
                    console.error('Error loading dropdown options:', error);
                  }
                };
                fetchOptions(); 
            }, []);
            //updates the form data 

            const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData((prev) => ({ ...prev, [name]: value }));
            };
            //update the photos when user select photo
            const handleFileChange = (e) => {
                setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };
// sends the data to backend when submit is pushed
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    setLoading(true);
    setMessage('');   
// formData for submission 
    const form = new FormData();
    form.append('category_id', formData.category);
    form.append('ability_level_id', formData.difficulty); 
    form.append('cost_level_id', formData.price);
    form.append('photo', formData.photo); 
    form.append('link', formData.link);
    form.append('activity_name', formData.name);
    form.append('description', formData.description);
    form.append('latitude', formData.latitude);
    form.append('longitude', formData.longitude);
    form.append('address', formData.address)

    try {
        const response = await axios.post(`/api/adventures/${user.id}`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Handle successful form submission
      console.log('Adventure submitted:', response.data, form);
      setMessage('Adventure submitted successfully!');
      setFormData({
        price: '',          
        category: '',
        difficulty: '',
        address: '',
        link: '',
        name: '',
        description: '',
        photo: null, 
        latitude: '',
        longitude: '',     
      });
    } catch (error) {
        // Handle any errors during form submission
        console.error('Submit failed:', error);
        setMessage('Failed to submit adventure.'); // Show error message
      } finally {
        setLoading(false); 
      }
    };

    //GOOGLE MAPS
    const onPlacesChanged = () => {
      if (searchBoxRef.current) {
        const places = searchBoxRef.current.getPlaces();
        if (places && places.length > 0) {
          const place = places[0];
        
          if (place.geometry && place.geometry.location) {
            setFormData(prev => ({
              ...prev,
              address: place.formatted_address,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            }))
          } else {
            console.log('ERROR: places geometry is missing', place)
          }
        }
      }
    }
    //end

    return (
        <div className="add-adventure-page">
          <Nav pageTitle="Add New Adventure" />

          {/* <h2>Add New Adventure</h2> */}
          
          {/* Display success or error message */}
          {message && <p>{message}</p>}
          
          <form className="add-adventure-form" onSubmit={handleSubmit} encType="multipart/form-data">
            {/* File input for photo */}
            <div className="photo-section">
            <label className="custom-file-label">
              Add Photo
              <input type="file" name="photo" accept="image/*" onChange={handleFileChange} required />
            </label>
            </div>
            {/* <br /> */}
    
            {/* Input for location */}
            <div className="form-section location-section">
              <StandaloneSearchBox
              onLoad={ref => searchBoxRef.current = ref}
              onPlacesChanged={onPlacesChanged}
              >
                <label>
                  Location:
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </label>
              </StandaloneSearchBox>
            </div>
            {/* <br /> */}
    
            {/* Input for link */}
            <div className="form-section link-section">
            <label>
              Link:
              <input type="url" name="link" value={formData.link} onChange={handleChange} />
            </label>
            </div>
            {/* <br /> */}

            <div className="activity-name-section">
            <label>
              Adventure Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            </div>
    
            {/* Text area for description */}
            <div className="description-dropdowns">
            <div className="description-box">
            <label>
              Description:
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </label>
            </div>
            {/* <br /> */}
    
            {/* Dropdown for price */}
            <div className="dropdowns-box">
            <label>
              Price:
              <select name="price" value={formData.price} onChange={handleChange} required>
                <option value="">Select Price</option>
                {options.price.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.cost_level}
                  </option>
                ))}
              </select>
            </label>
            {/* </div>
            </div>
            <br /> */}
    
            {/* Dropdown for category */}
            {/* <div> */}
            <label>
              Category:
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {options.category.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.category_name}
                  </option>
                ))}
              </select>
            </label>
            {/* </div>
            <br /> */}
    
            {/* Dropdown for difficulty */}
            {/* <div> */}
            <label>
              Difficulty:
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} required>
                <option value="">Select Difficulty</option>
                {options.difficulty.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.ability_level}
                  </option>
                ))}
              </select>
            </label>
            </div>
            </div>
            {/* <br /> */}
    
            {/* Submit button (disables when loading) */}
            <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
    
            {/* Cancel button: Clears the form */}
            <button type="button" onClick={() => setFormData({
              price: '',
              category: '',
              difficulty: '',
              address: '',
              link: '',
              name: '',
              description: '',
              photo: '',
              latitude: '',
              longitude: '',
            })}>
              Cancel
            </button>
            </div>
          </form>
        </div>
      );
    };
    
    export default AddAdventureForm;