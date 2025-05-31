import React from 'react';
import './AdventureItem.css';
import ToggleFavorites from '../FavoritesIcons/ToggleFavorites';
import { useState } from 'react';


const AdventureItem = ({adventure}) => {

  const [liked, setLiked] = useState(false);

  const handleChangeFavorited = () => {
    setLiked((previousButton) => {
      return !previousButton;
    });
  }

  return (
    <div className='adventure-card'>

        <p>Adventure: {adventure.activity_name}</p>    
        <p>Description: {adventure.description}</p>    
        <p>{adventure.location}</p>   
        <p>Link: {adventure.link}</p>   
        <p>{adventure.difficulty}</p>   
          <ToggleFavorites liked={liked} handleChangeFavorited={handleChangeFavorited} />

        <div className='cost-category-difficulty-container'>
          <div className='cost'>
            <p>{adventure.cost_level}</p>
          </div>
        </div>
        
    </div>
  )
}

export default AdventureItem;
