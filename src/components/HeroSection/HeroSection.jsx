import { Link } from 'react-router-dom';
import { useState } from 'react';
import NewsletterModal from '../NewsletterModal/NewsletterModal';
import './HeroSection.css';

const HeroSection = () => {
    const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

    return (
        <section className="hero-section">
            <div className="cta-container">
                {/* ----------- == NEXT ADVENTURE == --------------*/}

                <Link to="/browse" className="cta-card">
                    <span className="cta-icon">🧭</span>
                    <h2 className="cta-title">Find Your Next Adventure</h2>
                    <p className="cta-sub">
                        Browse trails & hidden gems in your area.
                    </p>
                </Link>

                {/* ----------- == NEWS LETTER == --------------*/}
                {/* Un-Comment to enable newsletter signup */}
                {/* <div className="cta-card" onClick={() => setIsNewsletterModalOpen(true)}>
                    <span className="cta-icon">📰</span>
                    <h2 className="cta-title">
                        Stay Informed: Join the Newsletter
                    </h2>
                    <p className="cta-sub">
                        Never miss local events, deals & safety updates.
                    </p>
                </div> */}

                {/* ----------- == ADD ADVENTURE --------------*/}

                <Link to="/add-adventure" className="cta-card">
                    <span className="cta-icon">📍</span>
                    <h2 className="cta-title">Add Your Own Adventure</h2>
                    <p className="cta-sub">
                        Share your own adventures so others can enjoy them too!
                    </p>
                </Link>
            </div>

            {/* ----------- == SUBTITLE SCROLL DOWN --------------*/}
            <div className="scroll-indicator">↓</div>
            
            <NewsletterModal 
                isOpen={isNewsletterModalOpen} 
                onClose={() => setIsNewsletterModalOpen(false)} 
            />
        </section>
    );
};

export default HeroSection;
