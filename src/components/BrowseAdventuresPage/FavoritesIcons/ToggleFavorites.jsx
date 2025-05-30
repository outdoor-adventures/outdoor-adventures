import React from 'react'
import FavoriteIcon from './FavoriteIcon';
import FavoritedIcon from './FavoriteIcon';

export default function ToggleFavorites() {
  return (
    <>
    <div className='toggle-wrapper'>
        <img className="favorite-icon" src={FavoriteIcon} alt='unfavorited' />

        <img className="favorited-icon" src={FavoritedIcon} alt='favorited' />
    </div>
    </>
  )
}
