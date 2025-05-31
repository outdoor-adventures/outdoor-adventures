import React from 'react';
import './AdventureItem.css';
import ToggleFavorites from '../FavoritesIcons/ToggleFavorites';
import { useState } from 'react';
import axios from 'axios';


const AdventureItem = ({adventure}) => {

  const [like, setLike] = useState(false);

  const handleChangeFavorited = (id) => {
    axios.put(`/api/adventures/${id}`)
    .then((response) => {
      console.log('Adventure Liked');
    })
    .catch((error) => {
      console.log('GET /api/adventures error:', error);
      
    });
  }

  return (
    <div className='adventure-card'>

        <p>Adventure: {adventure.activity_name}</p>    
        <p>Description: {adventure.description}</p>    
        <p>{adventure.location}</p>   
        <p>Link: {adventure.link}</p>   
        <p>{adventure.difficulty}</p>   
          
          <ToggleFavorites like={like} handleChangeFavorited={handleChangeFavorited(adventure.id)} />

        <div className='cost-category-difficulty-container'>
          <div className='cost'>
            <p>{adventure.cost_level}</p>
          </div>
        </div>
        
    </div>
  )
}

export default AdventureItem;
