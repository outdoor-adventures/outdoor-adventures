import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import Nav from '../Nav/Nav';
import './RegisterPage.css';

function RegisterPage(pageTitle) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const register = useStore((state) => state.register)
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    }
  }, [])

  const handleRegister = (event) => {
    event.preventDefault();

    register({
      username: username,
      password: password,
    })
  };

  return (
    <>
    <div className="banner">
      <Nav pageTitle="Register Page" />
      </div>
      <div className="banner-transparent-strip"></div>
      <div className="register-container">
      {/* <h2>Register Page</h2> */}
      <form className="register-box" onSubmit={handleRegister}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button-register2" type="submit">
          Register 
        </button>
      </form>
      </div>
      { // Conditionally render registration error:
        errorMessage && (
          <h3>{errorMessage}</h3>
        )
      }
    </>
  );
}


export default RegisterPage;
