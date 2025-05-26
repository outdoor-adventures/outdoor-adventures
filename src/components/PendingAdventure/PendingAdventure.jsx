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
    return (
        <>
            <div>PendingAdventure</div>
            <div></div>
        </>
    );
};

export default PendingAdventure;
