import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import logo from '../../../public/images/OALogo.png';
import prof from '../../../public/images/prof.png';
import './Nav.css';


function Nav({pageTitle}) {
  const user = useStore((store) => store.user);
  const [pendingCount, setPendingCount] = useState(0);
  
  // Fetch pending adventures count when user is admin
  useEffect(() => {
    if (user.id && user.user_rank === '1') {
      fetch('/api/adventures/admin/pending')
        .then(response => response.json())
        .then(data => {
          setPendingCount(data.length);
        })
        .catch(error => {
          console.error('Error fetching pending adventures:', error);
        });
    }
  }, [user.id, user.user_rank]);

  return (
    <>

      <nav className="banner">
  <div className='nav-container'>
    <NavLink to="/" className="logo">
      <img src={logo} alt="" />
    </NavLink>
    
    <h1 className='page-title'>{pageTitle}</h1>
    
    {!user.id && (
      <ul>
        <li><NavLink to="/login">Login</NavLink></li>
        <li><NavLink to="/registration">Register</NavLink></li>
      </ul>
    )}
    
    {user.id && (
      <NavLink to="/user" className="profile-image">
        <img src={prof} alt="Profile" />
      </NavLink>
    )}
  </div>
</nav>
    </>
  );
}


export default Nav;

