import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store'
import './AddAdventureForm.css';
import Nav from '../Nav/Nav';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

//GOOGLE MAPS
import { StandaloneSearchBox } from '@react-google-maps/api';
//end

const AddAdventureForm = () => {
    const user = useStore((store) => store.user);
    const navigate = useNavigate();
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
    
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    
    const [options, setOptions] = useState({
        price: [],
        category: [],
        difficulty: [],
      });

      const [loading, setLoading] = useState(false);
      const [alert, setAlert] = useState({ show: false, type: '', message: '' });
      const [validLocation, setValidLocation] = useState(false);

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

            useEffect(() => {
              if (alert.show) {
                const timer = setTimeout(() => {
                  setAlert({ show: false, type: '', message: '' });
                }, 3000);
                return () => clearTimeout(timer);
              }
            }, [alert.show]);
            //updates the form data 

            const handleChange = (e) => {
                const { name, value } = e.target;
                if (name === 'address') {
                  setValidLocation(false);
                }
                setFormData((prev) => ({ ...prev, [name]: value }));
            };
            //update the photos when user select photo
            const handleFileChange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    setFormData((prev) => ({ ...prev, photo: file }));
                    const reader = new FileReader();
                    reader.onload = (e) => setImagePreview(e.target.result);
                    reader.readAsDataURL(file);
                }
            };
            
            const handleImageClick = () => {
                fileInputRef.current?.click();
            };
// sends the data to backend when submit is pushed
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!formData.photo) {
      // console.log('Setting alert for missing photo');
      setAlert({ show: true, type: 'error', message: 'Please select an image before submitting' });
      return;
    }

    if (!validLocation || !formData.latitude || !formData.longitude) {
      setAlert({ show: true, type: 'error', message: 'Please select a location from the dropdown suggestions' });
      return;
    }

    setLoading(true);   
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

      setAlert({ show: true, type: 'success', message: 'Adventure Submitted Successfully' });

      // Handle successful form submission
      // console.log('Adventure submitted:', response.data, form);

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
      setImagePreview(null);
    } catch (error) {
        // Handle any errors during form submission
        console.error('Submit failed:', error);
        setAlert({ show: true, type: 'error', message: 'Failed to Submit Adventure' });
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
            setValidLocation(true);
          } else {
            // console.log('ERROR: places geometry is missing', place)
          }
        }
      }
    }
    //end

    return (
        <div className="add-adventure-page">
          <Nav pageTitle="Add New Adventure" />

          {alert.show && (
            <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
              <Alert severity={alert.type}>
                {alert.message}
              </Alert>
            </div>
          )}
          
          <form className="add-adventure-form" onSubmit={handleSubmit} encType="multipart/form-data">
            {/* File input for photo */}
            <div className="photo-section">
              {imagePreview ? (
                <div className="image-preview" onClick={handleImageClick}>
                  <img src={imagePreview} alt="Preview" />
                  <div className="image-overlay">
                    <span>Click to change image</span>
                  </div>
                </div>
              ) : (
                <label className="custom-file-label" onClick={handleImageClick}>
                  Add Photo
                </label>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                name="photo" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />
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
                  <input type="text" placeholder="Enter an Address" name="address" value={formData.address} onChange={handleChange} required />
                </label>
              </StandaloneSearchBox>
            </div>
            {/* <br /> */}
    
            {/* Input for link */}
            <div className="form-section link-section">
            <label>
              Link:
              <input type="url" placeholder="Enter a Link (Optional)" name="link" value={formData.link} onChange={handleChange} />
            </label>
            </div>
            {/* <br /> */}

            <div className="form-section activity-name-section">
            <label>
              Adventure Name:
              <input type="text" placeholder="Example: Yellowstone National Park" name="name" value={formData.name} onChange={handleChange} />
            </label>
            </div>
    
            {/* Text area for description */}
            <div className="description-dropdowns">
            <div className="description-box">
            <label>
              Description:
              <textarea placeholder="Tips for other adventurers:" name="description" value={formData.description} onChange={handleChange} />
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
    
            {/* Cancel button: Navigate to home */}
            <button type="button" onClick={() => navigate('/')}>
              Cancel
            </button>
            </div>
          </form>
        </div>
      );
    };
    
    export default AddAdventureForm;