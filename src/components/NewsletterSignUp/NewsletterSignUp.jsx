import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store';
import './NewsletterSignUp.css';
import Nav from '../Nav/Nav';

const NewsletterSignUp = () => {
    const user = useStore((store) => store.user);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
    });

    //when an input is changed, update the value of that imput
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    //handle sumbit 
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        //only allow submit if user is logged in
        if (!user || !user.id) {
            console.error('User not logged in');
            return;
        }

        //POST request
        try {
            const response = await axios.post(`/api/newsletter/${user.id}`, {
                email: formData.email,
                name: formData.name
            });
            alert('Newsletter subscription successful!');
            setFormData({
                email: '',
                name: '',
            });
        } catch (error) {
            alert('Failed to subscribe to newsletter. Please try again.');
            console.error('Error submitting newsletter:', error);
        }
    }
    return  (
        <div className='newsletter-signup'>
            <Nav pageTitle='Newsletter Signup'/>
            
            <div style={{ marginTop: '150px', padding: '100px' }}>
                <form className='signup-form' onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className='form-section name-section'>
                        <label >
                            Name:
                            <input type='text' placeholder='Full Name' name='name' value={formData.name} onChange={handleChange} />
                        </label>
                    </div>

                    <div className='form-section email-section'>
                        <label>
                            Email:
                            <input type='text' placeholder='E-Mail Address' name='email' value={formData.email} onChange={handleChange}/>
                        </label>
                    </div>
                    
                    <div className='form-buttons'>
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
    
};

export default NewsletterSignUp;
