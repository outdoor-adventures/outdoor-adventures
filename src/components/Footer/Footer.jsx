
import { useEffect, useState }from 'react';
import { NavLink } from "react-router-dom";
import useStore from "../../zustand/store";
import './Footer.css';

const Footer = () => {
  const user = useStore((store) => store.user);
  const logOut = useStore((state) => state.logOut);
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

console.log('Footer render - user.id:', user.id);
console.log('Footer render - user.user_rank:', user.user_rank);
console.log('Footer render - comparison result:', user.user_rank === '1');
console.log('Footer render - should show admin:', user.id && user.user_rank === '1');


  return (
    <div className="footer">
      <div className="footer-container">
        <ul className='nav-links'>
            <li>
            <NavLink to="/contact" className="contact-button">Contact</NavLink>
            </li>
            <li>
            <NavLink to="/about" className="about-button">About</NavLink>
            </li>
        </ul>
      

        <div className="dropdown">
          <button className="dropdown-btn">Info</button>
          <div className="dropdown-content">
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>
        </div>
        
{user.id && (
    <ul>
      <li>DEBUG: user_rank is "{user.user_rank}"</li>
      {user.user_rank === '1' && (
        <li>
          <NavLink to="/admin" className="admin-button">
            Pending Advs. {pendingCount > 0 && `(${pendingCount})`} 
          </NavLink>
        </li>
      )}
                <li>
                <button onClick={logOut} className="logout_button">Log Out</button>
                </li>
            </ul>
      )}
      </div>
    </div>
  );
};


export default Footer;
