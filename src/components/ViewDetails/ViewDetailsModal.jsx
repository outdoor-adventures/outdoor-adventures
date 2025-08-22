import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';


const ViewDetailsModal = ({ adventure, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    price: adventure.price || '',
    category: adventure.category || '',
    difficulty: adventure.difficulty || '',
    location: adventure.location || '',
    link: adventure.link || '',
    description: adventure.description || '',
    photo: null,
  });

  const [options, setOptions] = useState({
    price: [],
    category: [],
    difficulty: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [priceRes, categoryRes, difficultyRes] = await Promise.all([
          axios.get('/api/adventures/options/price'),
          axios.get('/api/adventures/options/category'),
          axios.get('/api/adventures/options/difficulty'),
        ]);
        setOptions({
          price: priceRes.data,
          category: categoryRes.data,
          difficulty: difficultyRes.data,
        });
      } catch (err) {
        console.error('Error fetching options:', err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      setMessage('Only image files allowed.');
      return;
    }
    setFormData((prev) => ({ ...prev, photo: file }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const form = new FormData();
    if (formData.photo) form.append('photo', formData.photo);
    form.append('price', formData.price);
    form.append('category', formData.category);
    form.append('difficulty', formData.difficulty);
    form.append('location', formData.location);
    form.append('link', formData.link);
    form.append('description', formData.description);

    try {
      const response = await axios.put(`/api/adventures/${adventure.id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Adventure updated successfully!');
      onUpdated(response.data); // Update parent
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      await axios.post(`/api/favorites/${adventure.id}`);
      setMessage('Adventure favorited!');
    } catch (err) {
      console.error('Failed to favorite:', err);
      setMessage('Failed to favorite adventure.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Edit Adventure Details</h2>
        {message && <p className="status-message">{message}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>
            New Photo:
            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          <label>
            Price:
            <select name="price" value={formData.price} onChange={handleChange} required>
              <option value="">Select</option>
              {options.price.map((opt) => (
                <option key={opt.id} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label>
            Category:
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select</option>
              {options.category.map((opt) => (
                <option key={opt.id} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label>
            Difficulty:
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} required>
              <option value="">Select</option>
              {options.difficulty.map((opt) => (
                <option key={opt.id} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label>
            Location:
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </label>

          <label>
            Link:
            <input type="url" name="link" value={formData.link} onChange={handleChange} />
          </label>

          <label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>

          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Pending...' : 'Submit'}
            </button>
            <button type="button" onClick={handleFavorite}>Add to Favorites</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewDetailsModal;

