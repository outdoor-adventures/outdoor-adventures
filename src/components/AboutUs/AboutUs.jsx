import React from 'react';
import Nav from '../Nav/Nav';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <>
            <Nav pageTitle="About Us" />
            <div className="about-container">

                <div className="about-content">
                    <section>
                        <h2>Application Overview</h2>
                        <p>
                            Outdoor Adventures is a web platform that helps families, especially those less 
                            experienced in outdoor activities, discover them with ease. The site brings together 
                            hiking, camping, water sports and other outdoor adventures in one searchable hub. 
                            Users can explore what's nearby, add their own adventures, and be part of a community 
                            that inspires getting outside!!
                        </p>
                    </section>

                    <section>
                        <h2>Key Features</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <h3>Browse & Search</h3>
                                <p>Search adventures by location with filters for category, difficulty, and price. Interactive map view shows nearby activities.</p>
                            </div>
                            <div className="feature-card">
                                <h3>Add Adventures</h3>
                                <p>Registered users can submit their own outdoor adventures with photos, descriptions, and location details.</p>
                            </div>
                            <div className="feature-card">
                                <h3>Save Favorites</h3>
                                <p>Create your personal collection of favorite adventures to revisit and plan future trips.</p>
                            </div>
                            <div className="feature-card">
                                <h3>👥 Community Driven</h3>
                                <p>All adventures are shared by fellow outdoor enthusiasts, creating a trusted community resource.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>How It Works</h2>
                        <div className="steps-container">
                            <div className="step">
                                <div className="step-number">1</div>
                                <h3>Search</h3>
                                <p>Enter your city, state, or zip code to find adventures within your area</p>
                            </div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <h3>Filter</h3>
                                <p>Use category, difficulty, and price filters to find the perfect adventure</p>
                            </div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <h3>Explore</h3>
                                <p>View details, save favorites, and start your outdoor adventure</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>User Features</h2>
                        <p>
                            <strong>For All Users:</strong> Browse adventures, view details, and use interactive maps to discover outdoor activities.
                        </p>
                        <p>
                            <strong>For Registered Users:</strong> Save favorite adventures, submit new activities, manage your submissions, and track approval status.
                        </p>
                        <p>
                            <strong>For Administrators:</strong> Review and approve submitted adventures to maintain quality and safety standards.
                        </p>
                    </section>

                    {/* <section>
                        <h2>Technologies Used</h2>
                        <div className="tech-grid">
                            <div className="tech-item">React</div>
                            <div className="tech-item">Node.js</div>
                            <div className="tech-item">Express</div>
                            <div className="tech-item">PostgreSQL</div>
                            <div className="tech-item">Google Maps API</div>
                            <div className="tech-item">AWS S3</div>
                        </div>
                    </section> */}

                    <section className="get-started">
                        <h2>Start Your Adventure Today</h2>
                        <p>
                            Whether you're a seasoned outdoor enthusiast or just beginning to explore nature, 
                            Outdoor Adventures connects you with amazing experiences in your area. Join our 
                            community and discover the great outdoors!
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AboutUs;
