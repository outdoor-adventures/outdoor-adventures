import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';
import './NewsletterModal.css';

// Modal component for newsletter subscription
const NewsletterModal = ({ isOpen, onClose }) => {
    // Get current user from global state
    const user = useStore((store) => store.user);
    
    // Form data state for name and email inputs
    const [formData, setFormData] = useState({
        email: '',
        name: '',
    });
    
    // Track if user has successfully subscribed
    const [isSubscribed, setIsSubscribed] = useState(false);
    
    // Track if user is already subscribed
    const [alreadySubscribed, setAlreadySubscribed] = useState(false);
    
    // Track if showing login prompt
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    
    // Navigation hook
    const navigate = useNavigate();

    // Check subscription status when modal opens and user is logged in
    useEffect(() => {
        if (isOpen && user && user.id) {
            checkSubscriptionStatus();
        }
    }, [isOpen, user]);

    // Check if user is already subscribed
    const checkSubscriptionStatus = async () => {
        try {
            const response = await axios.get(`/api/newsletter/${user.id}`);
            setAlreadySubscribed(response.data.isSubscribed);
        } catch (error) {
            console.error('Error checking subscription status:', error);
        }
    };

    // Update form data when user types in inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        if (!user || !user.id) {
            setShowLoginPrompt(true);
            return;
        }

        try {
            // Send subscription data to server
            await axios.post(`/api/newsletter/${user.id}`, {
                email: formData.email,
                name: formData.name
            });
            // Show success message and clear form
            setIsSubscribed(true);
            setFormData({ email: '', name: '' });
        } catch (error) {
            alert('Failed to subscribe to newsletter. Please try again.');
            console.error('Error submitting newsletter:', error);
        }
    };

    // Reset state and close modal
    const handleClose = () => {
        setIsSubscribed(false);
        setAlreadySubscribed(false);
        setShowLoginPrompt(false);
        onClose();
    };
    
    // Navigate to register page
    const handleLogin = () => {
        handleClose();
        navigate('/login');
    };

    // Don't render if modal is closed
    if (!isOpen) return null;

    return (
        // Overlay that closes modal when clicked
        <div className="modal-overlay" onClick={handleClose}>
            {/* Modal content - prevent closing when clicked */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header with dynamic title and close button */}
                <div className="modal-header">
                    <h2>
                        {alreadySubscribed ? 'Newsletter Subscription' :
                         isSubscribed ? 'Welcome to Our Newsletter!' : 
                         showLoginPrompt ? 'Login Required' : 
                         'Join Our Newsletter'}
                    </h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                
                {/* Show success message, login prompt, already subscribed message, or subscription form */}
                {alreadySubscribed ? (
                    // Already subscribed message
                    <div className="success-message">
                        <span className="success-icon">✓</span>
                        <p>You are already subscribed to our newsletter!</p>
                        <button className="success-button" onClick={handleClose}>Close</button>
                    </div>
                ) : showLoginPrompt ? (
                    // Login prompt for non-authenticated users
                    <div className="login-prompt">
                        <p>Please login or create an account before subscribing to our newsletter.</p>
                        <div className="form-buttons">
                            <button type="button" onClick={handleClose}>Cancel</button>
                            <button type="button" onClick={handleLogin}>Log in / Register</button>
                        </div>
                    </div>
                ) : isSubscribed ? (
                    // Success state after subscription
                    <div className="success-message">
                        <span className="success-icon">✅</span>
                        <p>Thank you for subscribing!</p>
                        <button className="success-button" onClick={handleClose}>Close</button>
                    </div>
                ) : (
                    // Subscription form
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            <input 
                                type="email" 
                                placeholder="E-Mail Address" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-buttons">
                            <button type="button" onClick={handleClose}>Cancel</button>
                            <button type="submit">Subscribe</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default NewsletterModal;