import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import logo from '../../../public/images/HomeIcon.png';
import prof from '../../../public/images/prof.png';
import './Nav.css';


function Nav({pageTitle}) {
  const user = useStore((store) => store.user);
  const [pendingCount, setPendingCount] = useState(0);
  
  // Fetch pending adventures count when user is admin
  useEffect(() => {
    if (user.id && user.user_rank === 1) {
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

        <div className="nav-left">
          {/* <NavLink to="/" className='logo'><a href="" className="logo"><img src={logo} alt="" style={{width: '100px', marginTop: '10px'  }} /></a></NavLink> */}
          <NavLink to="/" className="logo" >
            <img src={logo} alt="" style={{width: '113px', marginTop: '20px'}} />
          </NavLink>
        </div>

          <div className="nav-center">
            <h1 className='page-title'>{pageTitle}</h1>
          </div>

      <div className='nav-right'>
      { // User is not logged in, render these links:
        !user.id && (
          <ul>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/registration">Register</NavLink>
            </li>
          </ul>
        )
      }
      { // User is logged in, render these links:
          user.id && (
            <div className="nav-user-controls">
              <NavLink to="/user" className="profile-image">
                <img src={prof} alt="Profile" style={{width: '120px', marginTop: '0'}} />
              </NavLink>
            </div>
          )
        }
      </div>
      </div>
    </nav>
    </>
  );
}


export default Nav;

