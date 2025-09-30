import React from 'react';
import Nav from '../Nav/Nav';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <>
            <Nav pageTitle="About Us" />
            <div className="about-container">                
                <div className="about-content">
                    <section className="about-hero-section">
                        <h1>My Outdoor Adventures</h1>
                        <h2>Helping Families Discover the Joy of the Outdoors</h2>
                        <p>
                            At My Outdoor Adventures, we believe that some of life's best memories happen under an 
                            open sky. Our mission is simple: help parents—especially those with young, school-aged 
                            children—find fun, approachable ways to get outside together.
                        </p>
                    </section>

                    <div className="two-column-section">
                        <section>
                            <h2>Why We Exist</h2>
                            <p>
                                We know that busy families often struggle to plan outdoor activities. Whether it's lack of time, 
                                uncertainty about where to start, or simply not knowing what's nearby, those hurdles can keep 
                                you indoors. We're here to remove those barriers and make nature feel welcoming and easy.
                            </p>
                        </section>

                        <section>
                            <h2>Our Promise</h2>
                            <p>
                                We design every resource with parents in mind—short, practical, and fun. You don't need 
                                expensive gear or advanced skills; just a little curiosity and a willingness to step outside.
                            </p>
                        </section>
                    </div>

                    <section>
                        <h2>What We Offer</h2>
                        <div className="about-offerings">
                            <div className="about-offering-item">
                                <h3>Family-Friendly Ideas</h3>
                                <p>Seasonal guides, quick-start activity lists, and local recommendations that fit into real-life schedules.</p>
                            </div>
                            <div className="about-offering-item">
                                <h3>Digital Downloads</h3>
                                <p>Checklists, trail maps, and kid-friendly adventure plans you can access anytime.</p>
                            </div>
                            <div className="about-offering-item">
                                <h3>Inspiration & Community</h3>
                                <p>Tips, stories, and encouragement from parents just like you who've found the magic of outdoor time.</p>
                            </div>
                        </div>
                    </section>

                    <section className="about-get-started">
                        <h2>Join the Adventure</h2>
                        <p>
                            Whether it's a Saturday morning hike, a backyard stargazing night, or a spontaneous picnic at a 
                            local park, we'll help you create moments your family will treasure.
                        </p>
                        <p><strong>Let's make the outdoors part of your everyday life.</strong></p>
                        <p><em>Your next adventure starts here; Be Out There!</em></p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AboutUs;
