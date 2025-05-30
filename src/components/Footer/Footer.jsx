
import React, { useEffect, useState }from 'react';
import { NavLink } from "react-router-dom";
import useStore from "../../zustand/store";
import './Footer.css';

const Footer = () => {
  const user = useStore((store) => store.user);
  const logOut = useStore((state) => state.logOut);





  return (
    <div className="footer">
        <ul>
            <li>
            <NavLink to="/contact" className="contact-button">Contact</NavLink>
            </li>
            <li>
            <NavLink to="/about" className="about-button">About</NavLink>
            </li>
        </ul>
        
      {!user.id ? (

            <ul className="footer-links">
            {/* <li> */}
            
            {/* <NavLink to="/" className="logout-button">
                <button onClick={logOut} className="logout_button">Log Out</button>
            </NavLink> */}
            
            {/* </li> */}
            </ul>

      ) : (


        <ul>

        <li>
                <button onClick={logOut} className="logout_button">Log Out</button>
        </li>



        </ul>

        
          )}
    
     </div>
  );
};


export default Footer;
