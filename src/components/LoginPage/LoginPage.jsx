import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';



function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const logIn = useStore((state) => state.logIn)
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);
  const navigate = useNavigate();
  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    }
  }, [])

  const handleLogIn = (event) => {
    event.preventDefault();
    logIn({
      username: username,
      password: password,
    });
  };
  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <>
      <div className="banner">
        <h1>Outdoor Adventures</h1>
      </div>
      <div className="banner-transparent-strip"></div>
      <div className="login-container">
      <form className="login-box" onSubmit={handleLogIn}>
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
        <button className="button-login" type="submit">
          Log In
        </button>
        <div className="register-link">
          <p>Don't have an account?</p>
          <button className="button-register" onClick={handleRegisterClick}>
            Register
            </button>
            </div>
      </form>
      { // Conditionally render login error:
        errorMessage && (
          <h3>{errorMessage}</h3>
        )
      }
       
      </div>
    </>
  );
}


export default LoginPage;
