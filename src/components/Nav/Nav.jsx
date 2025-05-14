import { NavLink } from 'react-router-dom';
import useStore from '../../zustand/store';
import logo from '../../../public/images/HomeIcon.png';
import './Nav.css';

function Nav() {
  const user = useStore((store) => store.user);

  return (
    <nav>
      <div className='nav-container'>
        <img src={logo} className='nav-logo' style={{width: '10%', marginTop: '20px'  }}/>
      </div>
    </nav>
  );
}


export default Nav;
