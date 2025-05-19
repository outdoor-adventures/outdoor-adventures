import React, { useEffect, useState } from 'react';
import axios from 'axios';

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