import React from 'react'
// import FavoriteIcon from './FavoriteIcon';
// import FavoritedIcon from './FavoritedIcon';
import Liked from "../../../../liked.png"
import Like from "../../../../like.png"

export default function ToggleFavorites(liked) {
  return (
    <>
    <div className='toggle-wrapper'>
        {/* <FavoriteIcon className="not-liked"/>
        <FavoritedIcon className="liked" /> */}
        {liked ? (
        <img className='like' src={Like} alt="like-button" style={{width: '6vw'}} />

        ) : (

        <img className='liked' src={Liked} alt="liked-button" style={{width: '6vw'}} />

        )}

    </div>
    </>
  )
}
