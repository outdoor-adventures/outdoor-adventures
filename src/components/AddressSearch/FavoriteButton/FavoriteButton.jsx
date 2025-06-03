import React, { useState } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import useStore from '../../../zustand/store'

export default function FavoriteButton({ adventure }) {
    const user = useStore((store) => store.user);
    const [liked, setLiked] = useState(false);
    console.log('adventure is:', adventure.id)
    console.log('user i is:', user.id);

    const toggleLike = async () => {
      try{
        setLiked(prev => !prev);
          await axios.post(`/api/adventures/favorites/${user.id}/${adventure.id}`);
        } catch (err) {
          console.error('Failed to favorite:', err);
        }
    };

  return (
    <div onClick={toggleLike}>

        {liked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}

    </div>
  )
}
