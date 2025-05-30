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
