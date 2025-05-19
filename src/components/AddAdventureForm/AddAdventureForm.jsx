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
    