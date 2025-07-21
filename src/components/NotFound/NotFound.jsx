import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Nav/Nav';
import './NotFound.css';

const NotFound = () => {
  return (
    <>
      <Nav pageTitle="Page Not Found" />
      <div className="not-found-container">
        <div className="error-code">404</div>
        <h2>Looks like you don't have access to this page.</h2>
        <p>Sorry, the page you are looking for does not exist or you don't have permission to access it.</p>
        <Link to="/" className="home-link">Return to Home</Link>
      </div>
    </>
  );
};

export default NotFound;