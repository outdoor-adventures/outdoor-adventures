import React, { useState } from 'react'
import Liked from "../../../../liked.png"
import Like from "../../../../like.png"

export default function ToggleFavorites() {

const [like, setLike] = useState(0),
 [isLiked, setLiked] = useState(false), 


handleChangeFavorited = () => {
    setLike (like + (isLiked ? -1 : 1))
    setLiked (!isLiked);
}

  return (
    <>
    <div className='toggle-wrapper'>

{/* setting the toggle for button to be liked/unliked. Images will change with onclick */}


            <img className='liked' 
            src={Liked} 
            alt="liked-button" 
            style={{width: '3vw', minWidth: '60px', position: 'absolute', top: '10px', right: '100px'}} 
            onClick={() => handleChangeFavorited} />

            <br />
            <p>Favorite</p>

    </div>
    </>
  )
}
