import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditAdventureForm = () => {
  const { id } = useParams(); // assuming you're using react-router
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

  // Fetch dropdown options
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
        const { price, category, difficulty, location, link, description } = res.data;
        setFormData({
          price,
          category,
          difficulty,
          location,
          link,
          description,
          photo: null, // don't preload file input
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
    if (formData.photo) {
      form.append('photo', formData.photo);
    }

    form.append('price', formData.price);
    form.append('category', formData.category);
    form.append('difficulty', formData.difficulty);
    form.append('location', formData.location);
    form.append('link', formData.link);
    form.append('description', formData.description);

    try {
      const res = await axios.put(`/api/adventures/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Adventure updated:', res.data);
      setMessage('Adventure updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      setMessage('Failed to update adventure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Edit Adventure</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Photo (optional):
          <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
        </label>
        <br />

        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </label>
        <br />

        <label>
          Link:
          <input type="url" name="link" value={formData.link} onChange={handleChange} />
        </label>
        <br />

        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>
        <br />

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
        <br />

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
        <br />

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
        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Adventure'}
        </button>
      </form>
    </div>
  );
};

export default EditAdventureForm;
