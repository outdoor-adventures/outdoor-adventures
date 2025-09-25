
import { useEffect, useState }from 'react';
import { NavLink } from "react-router-dom";
import useStore from "../../zustand/store";
import './Footer.css';

const Footer = () => {
  const user = useStore((store) => store.user);
  const logOut = useStore((state) => state.logOut);
  const [pendingCount, setPendingCount] = useState(0);

  console.log('User object:', user);
console.log('User ID:', user.id);
console.log('User rank:', user.user_rank);
console.log('User rank type:', typeof user.user_rank);


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
