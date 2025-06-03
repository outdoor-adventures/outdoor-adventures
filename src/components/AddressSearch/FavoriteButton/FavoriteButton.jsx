import React, { useState } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function FavoriteButton() {
    const [liked, setLiked] = useState(false);

    const toggleLike = () => {
        setLiked(prev => !prev);
    };

  return (
    <div onClick={toggleLike}>

        {liked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}

    </div>
  )
}
