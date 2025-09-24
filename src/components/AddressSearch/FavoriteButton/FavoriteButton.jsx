import React, { useState, useEffect } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import useStore from '../../../zustand/store'

export default function FavoriteButton({ adventureId }) {
    const user = useStore((store) => store.user);
    const [liked, setLiked] = useState(false);

    // Don't render if user is not logged in
    if (!user || !user.id) {
        return null;
    }

    // Check if adventure is already favorited
    useEffect(() => {
        if (!adventureId) return;
        
        const checkFavoriteStatus = async () => {
            try {
                const response = await axios.get(`/api/adventures/favorites/${user.id}/${adventureId}`);
                setLiked(response.data.isFavorited);
            } catch (err) {
                console.error('error checking favorite status:', err);
            }
        };
        
        checkFavoriteStatus();
    }, [user.id, adventureId]);

    const toggleLike = async () => {
        if (!adventureId) {
            console.error('Cannot toggle favorite: adventureId is missing');
            return;
        }
        
        try {
            if (liked) {
                // Remove from favorites
                await axios.delete(`/api/adventures/favorites/${user.id}/${adventureId}`);
            } else {
                // Add to favorites
                await axios.post(`/api/adventures/favorites/${user.id}/${adventureId}`);
            }
            setLiked(prev => !prev);
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

  return (
    <div onClick={toggleLike}>
        {liked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
    </div>
  )
}