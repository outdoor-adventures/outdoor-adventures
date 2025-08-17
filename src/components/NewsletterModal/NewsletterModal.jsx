import React, { useState } from 'react';
import axios from 'axios';
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
            alert('Please log in to subscribe to the newsletter.');
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
        onClose();
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
                    <h2>{isSubscribed ? 'Welcome to Our Newsletter!' : 'Join Our Newsletter'}</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                
                {/* Show success message or subscription form */}
                {isSubscribed ? (
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