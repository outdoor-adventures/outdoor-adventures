import './ContactUs.css'
import Nav from '../Nav/Nav';

const ContactUs = () => {
    return (
        <>
            <Nav pageTitle="Contact Us" />
            <div className="contact-container">
                <h1>Contact Us</h1>
                <div className="contact-form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input 
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email" 
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message:</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Enter your message"
                                rows="5"
                            />
                        </div>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ContactUs;
