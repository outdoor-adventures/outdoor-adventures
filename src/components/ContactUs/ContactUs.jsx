import axios from 'axios';
import './ContactUs.css'
import Nav from '../Nav/Nav';
import useStore from '../../zustand/store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, Button } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ContactUs = () => {

    const user = useStore((store) => store.user);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        reason: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id) {
            setShowLoginPrompt(true);
            return;
        }

        try {
            await axios.post(`/api/contact/${user.id}`, {
                name: formData.name,
                email: formData.email,
                reason: formData.reason,
                message: formData.message
            });

            setIsSubmitted(true);
            setFormData({ name: '', email: '', reason: '', message: '' });
        } catch (error) {
            alert('Failed to send message. Please try again.');
            console.error('Error submitting form:', error);
        }
    };

    const handleCloseModal = () => {
        if (isSubmitted) {
            setIsSubmitted(false);
            navigate('/');
        } else if (showLoginPrompt) {
            navigate('/');
        }
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', reason: '', message: '' });
    };

    const handleLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
        if (!user || !user.id) {
            setShowLoginPrompt(true);
        } else {
            setShowLoginPrompt(false);
        }
    }, [user]);

    return (
        <>
            <Nav pageTitle="Contact our Team" />
            <div className="contact-container">
                {showLoginPrompt ? (
                    <div className="login-prompt">
                        <p>Please login or create an account to contact our team.</p>
                        <div className="form-buttons">
                            <button type="button" onClick={handleLogin}>Log in / Register</button>
                        </div>
                    </div>
                ) : isSubmitted ? (
                    <div className="success-message">
                        <span className="success-icon">✅</span>
                        <p>Your message was sent successfully! We'll get back to you as soon as possible.</p>
                        <button className="success-button" onClick={handleReset}>Close</button>
                    </div>
                ) : (
                    <div className="contact-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason">Reason for Contacting</label>
                                <input
                                    type="text"
                                    name="reason"
                                    placeholder="Experiencing Issues? Support? Anything Else?"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message:</label>
                                <textarea
                                    name="message"
                                    placeholder="Enter your message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit">Send Message</button>
                        </form>
                    </div>
                    )}


       {/* Login Prompt Modal */}

                <Modal open={showLoginPrompt} onClose={handleCloseModal}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" component="h2">
                            Login Required
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            Please login or create an account before sending a message.
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleLogin}>
                                Log in / Register
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Success Modal */}
                <Modal open={isSubmitted} onClose={handleCloseModal}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" component="h2">
                            Message Sent! ✅
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            Your message was sent successfully! We'll get back to you as soon as possible.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Modal>    
            </div>
        </>
    );
};

export default ContactUs;
