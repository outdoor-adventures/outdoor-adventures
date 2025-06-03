import React, { useState } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import useStore from '../../../zustand/store'

export default function FavoriteButton({  }) {
    // const user = useStore((store) => store.user);
    const [liked, setLiked] = useState(false);
    // console.log('adventure is:', adv.id)
    // console.log('user i is:', user.id);

    const toggleLike = async () => {
      try{
          // await axios.post(`/api/adventures/favorites/${user.id}/${adv.id}`);
          setLiked(prev => !prev);
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