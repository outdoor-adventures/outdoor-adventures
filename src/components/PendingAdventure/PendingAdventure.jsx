import React, { useState, useEffect } from 'react';
import './PendingAdventure.css';

const PendingAdventure = () => {
    // State for adventures, loading, and error
    const [adventures, setAdventures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [abilities, setAbilities] = useState([]);
    const [costLevels, setCostLevels] = useState([]);

    // Unified data loader
    const loadData = () => {
        setLoading(true);

        Promise.all([
            fetch('/api/adventures/admin/pending').then((res) => {
                if (!res.ok) throw new Error(`Error: ${res.status}`);
                return res.json();
            }),
            fetch('/api/dropdown/category').then((res) => res.json()),
            fetch('/api/dropdown/ability').then((res) => res.json()),
            fetch('/api/dropdown/cost').then((res) => res.json()),
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
                alert(`Failed to load data: ${err.message}`);
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handler for Accept
    const handleAccept = (id) => {
        fetch(`/api/adventures/${id}/accept`, { method: 'PUT' })
            .then((res) => {
                if (!res.ok) throw new Error(`Accept failed: ${res.status}`);
                loadData();
            })
            .catch((err) => {
                console.error(err);
                alert(`Accept action failed: ${err.message}`);
            });
    };

    // Handler for Delete
    const handleDelete = (id) => {
        fetch(`/api/adventures/${id}`, { method: 'DELETE' })
            .then((res) => {
                if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
                loadData();
            })
            .catch((err) => {
                console.error(err);
                alert(`Delete action failed: ${err.message}`);
            });
    };

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

    // Main render
    return (
        <section className="pending-page">
            <span></span>
            <header className="pending-header">
                <h1>Pending Adventures</h1>
            </header>
            <div className="pending-stripe" />
            <ul className="pending-grid">
                {adventures.map((adv) => (
                    <li key={adv.id}>
                        <article className="pending-card">
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
                                                {costLevels.map((c) => (
                                                    <option
                                                        key={c.id}
                                                        value={
                                                            c.level || c.label
                                                        }
                                                    >
                                                        {c.level || c.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="field">
                                            <label
                                                htmlFor={`category-${adv.id}`}
                                            >
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
                                        <div className="field">
                                            <label
                                                htmlFor={`difficulty-${adv.id}`}
                                            >
                                                Difficulty
                                            </label>
                                            <select
                                                id={`difficulty-${adv.id}`}
                                                defaultValue={adv.difficulty}
                                            >
                                                {abilities.map((a) => (
                                                    <option
                                                        key={a.id}
                                                        value={
                                                            a.level || a.name
                                                        }
                                                    >
                                                        {a.level || a.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label>Location</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={adv.location}
                                />
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
                                <button
                                    className="btn accept"
                                    onClick={() => handleAccept(adv.id)}
                                >
                                    Accept
                                </button>
                                {/* Return for Revision button removed (stretch goal) */}
                                <button
                                    className="btn delete"
                                    onClick={() => handleDelete(adv.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default PendingAdventure;
