import React from 'react'
import liked from '../../../../liked.png'

export default function FavoritedIcon() {
  return (
    <div>
        <img src={liked} alt="favorited" className='favorited-icon' style={{ width: '3vw'}}></img>
    </div>
  )
}
