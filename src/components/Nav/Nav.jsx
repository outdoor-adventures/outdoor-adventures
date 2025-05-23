import { NavLink } from 'react-router-dom';
import useStore from '../../zustand/store';
import logo from '../../../public/images/HomeIcon.png';
import prof from '../../../public/images/prof.png';
import './Nav.css';


function Nav({pageTitle}) {
  const user = useStore((store) => store.user);

  return (
    <nav>

      <div className='nav-container'>
        <li>
          {/* <NavLink to="/" className='logo'><a href="" className="logo"><img src={logo} alt="" style={{width: '100px', marginTop: '10px'  }} /></a></NavLink> */}
          <NavLink to="/" className="logo" >
            <img src={logo} alt="" style={{width: '113px', marginTop: '20px'}} />
          </NavLink>
        </li>

          <div className="nav-title">
            <h1 className='page-title'>{pageTitle}</h1>
          </div>

      <div className='nav-buttons'>
      <ul>
      { // User is not logged in, render these links:
        !user.id && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/registration">Register</NavLink>
            </li>
          </>
        )
      }
      { // User is logged in, render these links:
        user.id && (
          <>
            <NavLink to="/profile" className="profile-image" >
            <img src={prof} alt="" style={{width: '113px', marginTop: '20px'}} />
            </NavLink>
          </>
        )
      }
      </ul>
      </div>
    </div>
    </nav>
  );
}


export default Nav;

