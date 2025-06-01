import React from 'react';
import like from '../../../../like.png'

export default function FavoritedIcon() {
  return (
    <div>
        <img src={like} alt="favorite" className='favorite-icon' style={{ width: '3vw'}}></img>
    </div>
  )
}
