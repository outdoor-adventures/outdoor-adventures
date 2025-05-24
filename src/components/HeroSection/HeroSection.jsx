import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
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
                <Link to="/newsletter" className="cta-card">
                    <span className="cta-icon">📰</span>
                    <h2 className="cta-title">
                        Stay Informed: Join the Newsletter
                    </h2>
                    <p className="cta-sub">
                        Never miss local events, deals & safety updates.
                    </p>
                </Link>

                {/* ----------- == ADD ADVENTURE --------------*/}

                <Link to="/add-adventure" className="cta-card">
                    <span className="cta-icon">📍</span>
                    <h2 className="cta-title">Add Your Own Adventure</h2>
                    <p className="cta-sub">
                        Never miss local events, deals & safety updates.
                    </p>
                </Link>
            </div>

            {/* ----------- == SUBTITLE SCROLL DOWN --------------*/}
            <div className="scroll-indicator">↓</div>
        </section>
    );
};

export default HeroSection;
