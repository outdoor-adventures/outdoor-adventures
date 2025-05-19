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