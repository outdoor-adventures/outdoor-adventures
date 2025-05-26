import React, { useState, useEffect } from 'react';
import './PendingAdventure.css';

const PendingAdventure = () => {
    // State for adventures, loading, and error
    const [adventures, setAdventures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch pending adventures when component mounts
    // TODO! verify endpoint with the backend team
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

    //Render loading state
    if (loading) {
        return (
            <div className="pending-page">
                <header className="pending-header">
                    <h1>Pending Adventures</h1>
                </header>
                <p>Loading pending adventures…</p>
            </div>
        );
    }

    //Render error state
    if (error) {
        return (
            <div className="pending-page">
                <header className="pending-header">
                    <h1>Pending Adventures</h1>
                </header>
                <p>Error loading adventures: {error}</p>
            </div>
        );
    }
    //Render empty state
    if (adventures.length === 0) {
        return (
            <div className="pending-page">
                <header className="pending-header">
                    <h1>Pending Adventures</h1>
                </header>
                <p>No pending adventures at the moment.</p>
            </div>
        );
    }
    // Page Layout - Render the grid of pending cards
    return (
        <>
            <div>PendingAdventure</div>
            <div></div>
        </>
    );
};

export default PendingAdventure;
