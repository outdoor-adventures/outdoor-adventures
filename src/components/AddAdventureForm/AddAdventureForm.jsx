import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddAdventureForm.css';

const AddAdventureForm = () => {
    const [formData, setFormData] = useState({
      price: '',
      category: '',
      difficulty: '',
      location: '',
      link: '',
      description: '',
      photo: null,
    });
    
    const [options, setOptions] = useState({
        price: [],
        category: [],
        difficulty: [],
      });

      const [loading, setLoading] = useState(false);

      const [message, setMessage] = useState('');

      useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [priceRes, categoryRes, difficultyRes] = await Promise.all([
                    axios.get('/api/adventures/options/price'),
                    axios.get('/api/adventures/options/category'),
                    axios.get('/api/adventures/options/difficulty'),
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
    form.append('photo', formData.photo);
    form.append('price', formData.price); 
    form.append('category', formData.category);
    form.append('difficulty', formData.difficulty); 
    form.append('location', formData.location);
    form.append('link', formData.link);
    form.append('description', formData.description);

    try {
        const response = await axios.post('/api/adventures', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Handle successful form submission
      console.log('Adventure submitted:', response.data);
      setMessage('Adventure submitted successfully!');
      setFormData({
        price: '',          
        category: '',
        difficulty: '',
        location: '',
        link: '',
        description: '',
        photo: null,      
      });
    } catch (error) {
        // Handle any errors during form submission
        console.error('Submit failed:', error);
        setMessage('Failed to submit adventure.'); // Show error message
      } finally {
        setLoading(false); 
      }
    };
    return (
        <div className="add-adventure-page">
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
            <label>
              Location:
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </label>
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
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
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
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
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
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
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
              location: '',
              link: '',
              description: '',
              photo: null
            })}>
              Cancel
            </button>
            </div>
          </form>
        </div>
      );
    };
    
    export default AddAdventureForm;