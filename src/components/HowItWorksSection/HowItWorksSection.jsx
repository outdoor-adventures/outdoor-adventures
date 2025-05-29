import React from 'react';
import StaticMap from '../StaticMap/StaticMap';
import './HowItWorksSection.css';


const HowItWorksSection = () => {
    return (
        // Top‐level section wrapper
        <section className="how-it-works">
            {/* Section heading */}
            <h2 className="section-header">How it Works</h2>

            {/* Flex container: holds the info cards on the left and the map on the right */}
            <div className="hiw-content">
                {/* Left column: stack of info cards */}
                <div className="hiw-cards">
                    {/* Card 1: Browse Local Activities */}
                    <div className="hiw-card">
                        <h3 className="hiw-card-title">
                            Browse Local Activities
                        </h3>
                        <p className="hiw-card-desc">
                            Use your location to search for outdoor activities
                            in your area.
                        </p>
                    </div>

                    {/* Card 2: Add Your Own Adventure */}
                    <div className="hiw-card">
                        <h3 className="hiw-card-title">
                            Add Your Own Adventure
                        </h3>
                        <p className="hiw-card-desc">
                            Found an adventure? Share it with the community!
                        </p>
                    </div>
                </div>

                {/* Right column: static map preview */}
                <div className="hiw-map">
                    <img src="#" alt="Map preview" className="hiw-map-img" />
                    <StaticMap />
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
