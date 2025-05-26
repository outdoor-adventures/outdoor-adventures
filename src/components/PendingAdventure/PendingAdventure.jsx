
import React, { useState, useEffect } from 'react';
import './PendingAdventure.css';


const PendingAdventure = () => {
    const [adventures, setAdventures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    return (
        <>
            <div>PendingAdventure</div>
        </>
    );
};

export default PendingAdventure;
