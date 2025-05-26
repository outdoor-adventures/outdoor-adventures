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
                <h2 className="ra-title">Recent Activity</h2>
                <p>Loading recent adventures…</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="recent-activity">
                <h2 className="ra-title">Recent Activity</h2>
                <p>Error loading adventures: {error}</p>
            </section>
        );
    }
    // If the list is empty, encourage users to add one
    if (adventures.length === 0) {
        return (
            <section className="recent-activity">
                <h2 className="ra-title">Recent Activity</h2>
                <p>No recent adventures found. Be the first to add one!</p>
            </section>
        );
    }
    // render the grid of adventure cards
    return (
        <section className="recent-activity">
            <h2 className="ra-title">Recent Activity</h2>
            <div className="ra-cards">
                {adventures.map((item) => (
                    <div key={item.id} className="ra-card">
                        <img
                            src={item.img || item.photo}
                            alt={item.title}
                            className="ra-card-img"
                        />
                        <h3 className="ra-card-title">{item.title}</h3>
                        <p className="ra-card-location">{item.location}</p>
                        <Link
                            to={`/adventures/${item.id}`}
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
