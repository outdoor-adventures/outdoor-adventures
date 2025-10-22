import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

//GOOGLE MAPS
import { StandaloneSearchBox } from '@react-google-maps/api';
//end

const EditAdventureForm = () => {
  const { id } = useParams(); // assuming you're using react-router
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

  // Fetch dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [priceRes, categoryRes, difficultyRes] = await Promise.all([
          axios.get('/api/dropdown/cost'),
          axios.get('/api/dropdown/category'),
          axios.get('/api/dropdown/ability'),
        ]);
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

  // Fetch adventure data
  useEffect(() => {
    const fetchAdventure = async () => {
      try {
        const res = await axios.get(`/api/adventures/${id}`);
        const { price, category, difficulty, address, link, name, description, photo, latitude, longitude } = res.data;
        setFormData({
          price,
          category,
          difficulty,
          address,
          link,
          name,
          description,
          photo, // don't preload file input
          latitude,
          longitude,
        });
      } catch (error) {
        console.error('Error fetching adventure:', error);
      }
    };
    fetchAdventure();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const form = new FormData();
    // if (formData.photo) {
    //   form.append('photo', formData.photo);
    // }

    form.append('category_id', formData.category);
    form.append('ability_level_id', formData.difficulty);
    form.append('cost_level_id', formData.price);
    form.append('link', formData.link);
    form.append('activity_name', formData.name);
    form.append('description', formData.description);
    form.append('latitude', formData.latitude);
    form.append('longitude', formData.longitude);
    form.append('address', formData.address);

    try {
      const res = await axios.put(`/api/adventures/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      //console.log('Adventure updated:', res.data);
      setMessage('Adventure updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      setMessage('Failed to update adventure.');
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
          //console.log('ERROR: places geometry is missing', place)
        }
      }
    }
  }
  //end

  return (
    <div className="edit-adventure-page">
      {/* <h2>Edit Adventure</h2> */}
      {message && <p>{message}</p>}

      <form className="edit-adventure-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="photo-section">
        <label className="custom-file-label">
          Photo (optional):
          <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
        </label>
        </div>
        {/* <br /> */}

        {/*GOOGLE MAPS ADDITIONS*/}
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
          {/*END GOOGLE MAPS ADDITION*/}

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

        <div className="description-dropdowns">
        <div className="description-box">
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>
        </div>
        {/* <br /> */}

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
        {/* <br /> */}

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
        {/* <br /> */}

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
        <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Adventure'}
        </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdventureForm;
