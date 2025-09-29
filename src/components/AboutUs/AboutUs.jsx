import React from 'react';
import Nav from '../Nav/Nav';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <>
            <Nav pageTitle="Be Out There" />
            <div className="about-container">
                <img src="/images/OALogo.png" alt="Outdoor Adventures Logo" className="about-logo" />
                
                <div className="about-content">
                    <section>
                        <h2>About Outdoor Adventures</h2>
                        <p>
                            Outdoor Adventures helps families discover hiking, camping, water sports and other outdoor activities in one searchable hub. 
                            Join our community-driven platform to explore what's nearby and share your own adventures!
                        </p>
                    </section>

                    <section>
                        <h2>How It Works</h2>
                        <div className="steps-container">
                            <div className="step">
                                <div className="step-number">1</div>
                                <h3>Search</h3>
                                <p>Enter your location to find nearby adventures</p>
                            </div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <h3>Filter</h3>
                                <p>Use filters for category, difficulty, and price</p>
                            </div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <h3>Explore</h3>
                                <p>Save favorites and start your adventure</p>
                            </div>
                        </div>
                    </section>

                    <section className="get-started">
                        <h2>Start Your Adventure Today</h2>
                        <p>
                            Whether you're new to outdoor activities or a seasoned enthusiast, 
                            join our community and discover amazing experiences in your area!
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AboutUs;
