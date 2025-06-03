import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecentActivitySection.css';

const RecentActivitySection = () => {
    // State for the list of adventures
    const [adventures, setAdventures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the 3 most recent adventures when component mounts
    useEffect(() => {
        fetch('/api/adventures/recents/recent')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setAdventures(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="recent-activity">
                <h2 className="section-header">Recent Activity</h2>
                <p>Loading recent adventures…</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="recent-activity">
                <h2 className="section-header">Recent Activity</h2>
                <p>Error loading adventures: {error}</p>
            </section>
        );
    }
    // If the list is empty, encourage users to add one
    if (adventures.length === 0) {
        return (
            <section className="recent-activity">
                <h2 className="section-header">Recent Activity</h2>
                <p>No recent adventures found. Be the first to add one!</p>
            </section>
        );
    }
    // render the grid of adventure cards
    return (
        <section className="recent-activity">
            <h2 className="section-header">Recent Activity</h2>
            <div className="ra-cards">
                {adventures.map((adventure) => (
                    <div key={adventure.id} className="ra-card">
                        <img src={`http://localhost:5001/uploads/${adventure.photo}`}
                      alt={adventure.photo}
                      className='recent-adventure-image' />

                        <h3 className="ra-card-title">{adventure.activity_name}</h3>
                        <p className="ra-card-location">{adventure.location}</p>
                        <Link
                            to={`/adventures/${adventure.id}`}
                            className="ra-card-btn"
                        >
                            View More
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecentActivitySection;
