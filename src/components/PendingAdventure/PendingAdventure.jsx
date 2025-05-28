import React, { useState, useEffect } from 'react';
import './PendingAdventure.css';

const PendingAdventure = () => {
    // State for adventures, loading, and error
    const [adventures, setAdventures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for dropdown options
    const [categories, setCategories] = useState([]);
    const [abilities, setAbilities] = useState([]);
    const [costLevels, setCostLevels] = useState([]);

    useEffect(() => {
        // 1) Fetch pending adventures
        const fetchAdventures = fetch('/api/adventures/pending').then((res) => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        });

        // 2) Fetch lookup tables in parallel
        const fetchCategories = fetch('/api/category_table').then((res) =>
            res.json()
        );
        const fetchAbilities = fetch('/api/ability_table').then((res) =>
            res.json()
        );
        const fetchCostLevels = fetch('/api/cost_table').then((res) =>
            res.json()
        );

        Promise.all([
            fetchAdventures,
            fetchCategories,
            fetchAbilities,
            fetchCostLevels,
        ])
            .then(([advs, cats, abils, costs]) => {
                setAdventures(advs);
                setCategories(cats);
                setAbilities(abils);
                setCostLevels(costs);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Render loading, error, and empty states
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

    // Main grid render
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
                                    {/* Price dropdown */}
                                    <div className="field">
                                        <label htmlFor={`price-${adv.id}`}>
                                            Price
                                        </label>
                                        <select
                                            id={`price-${adv.id}`}
                                            defaultValue={adv.price}
                                        >
                                            {costLevels.map((c) => (
                                                <option
                                                    key={c.id}
                                                    value={c.level || c.label}
                                                >
                                                    {c.level || c.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Category dropdown */}
                                    <div className="field">
                                        <label htmlFor={`category-${adv.id}`}>
                                            Category
                                        </label>
                                        <select
                                            id={`category-${adv.id}`}
                                            defaultValue={adv.category}
                                        >
                                            {categories.map((c) => (
                                                <option
                                                    key={c.id}
                                                    value={c.name}
                                                >
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Difficulty dropdown */}
                                    <div className="field">
                                        <label htmlFor={`difficulty-${adv.id}`}>
                                            Difficulty
                                        </label>
                                        <select
                                            id={`difficulty-${adv.id}`}
                                            defaultValue={adv.difficulty}
                                        >
                                            {abilities.map((a) => (
                                                <option
                                                    key={a.id}
                                                    value={a.level || a.name}
                                                >
                                                    {a.level || a.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom fields */}
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

                        {/* Action buttons */}
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
