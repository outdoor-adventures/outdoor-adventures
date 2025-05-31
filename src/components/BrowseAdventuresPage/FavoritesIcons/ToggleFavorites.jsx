import React from 'react'
// import FavoriteIcon from './FavoriteIcon';
// import FavoritedIcon from './FavoritedIcon';
import Liked from "../../../../liked.png"
import Like from "../../../../like.png"

export default function ToggleFavorites({ like, handleChangeFavorited }) {
  return (
    <>
    <div className='toggle-wrapper'>

{/* setting the toggle for button to be liked/unliked. Images will change with onclick */}

        {like ? (

            <img className='liked' 
            src={Liked} 
            alt="liked-button" 
            style={{width: '6vw'}} 
            onClick={() => handleChangeFavorited} />


        ) : (


            <img className='like'
            src={Like} 
            alt="like-button" 
            style={{width: '6vw'}}
            onClick={() => handleChangeFavorited} />

        )}

    </div>
    </>
  )
}
