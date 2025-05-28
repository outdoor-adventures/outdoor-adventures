import React, { useState, useEffect } from 'react';
import './PendingAdventure.css';

const PendingAdventure = () => {
    // State for adventures, loading, and error
    const [adventures, setAdventures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch pending adventures when component mounts
    // TODO: verify endpoint with the backend team
    useEffect(() => {
        fetch('/api/adventures/pending')
            .then((res) => {
                if (!res.ok) throw new Error(`Error: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setAdventures(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Loading state
    if (loading) {
        return (
            <section className="pending-page">
                <header className="pending-header">
                    <h1>Pending Adventures</h1>
                </header>
                <p>Loading pending adventures…</p>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="pending-page">
                <header className="pending-header">
                    <h1>Pending Adventures</h1>
                </header>
                <p>Error loading adventures: {error}</p>
            </section>
        );
    }

    // Empty state
    if (adventures.length === 0) {
        return (
            <section className="pending-page">
                <header className="pending-header">
                    <h1>Pending Adventures</h1>
                </header>
                <p>No pending adventures at the moment.</p>
            </section>
        );
    }

    // Main grid
    return (
        <section className="pending-page">
            <header className="pending-header">
                <h1>Pending Adventures</h1>
            </header>
            <div className="pending-stripe" />
            <div className="pending-grid">
                {adventures.map((adv) => (
                    <div className="pending-card" key={adv.id}>
                        <div className="card-title">{adv.title}</div>

                        <div className="card-top">
                            <div className="card-top-left">
                                <img src={adv.photo} alt={adv.title} />
                            </div>
                            <div className="card-top-right">
                                <div className="card-top-right-box">
                                    <div className="field">
                                        <label htmlFor={`price-${adv.id}`}>
                                            Price
                                        </label>
                                        <select
                                            id={`price-${adv.id}`}
                                            defaultValue={adv.price}
                                        >
                                            <option>{adv.price}</option>
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label htmlFor={`category-${adv.id}`}>
                                            Category
                                        </label>
                                        <select
                                            id={`category-${adv.id}`}
                                            defaultValue={adv.category}
                                        >
                                            <option>{adv.category}</option>
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label htmlFor={`difficulty-${adv.id}`}>
                                            Difficulty
                                        </label>
                                        <select
                                            id={`difficulty-${adv.id}`}
                                            defaultValue={adv.difficulty}
                                        >
                                            <option>{adv.difficulty}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label>Location</label>
                            <input type="text" readOnly value={adv.location} />
                        </div>
                        <div className="field">
                            <label>Link (Optional)</label>
                            <input type="text" readOnly value={adv.link} />
                        </div>
                        <div className="field description">
                            <label>Description</label>
                            <textarea
                                readOnly
                                rows="3"
                                value={adv.description}
                            />
                        </div>

                        <div className="card-buttons">
                            <button className="btn accept">Accept</button>
                            <button className="btn return">
                                Return for Revision
                            </button>
                            <button className="btn delete">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PendingAdventure;
