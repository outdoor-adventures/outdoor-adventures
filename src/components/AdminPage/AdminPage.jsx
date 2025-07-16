import React, { useState, useEffect, useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import './AdminPage.css';
import Nav from '../Nav/Nav';

const PendingAdventure = () => {
    // State for adventures, loading, and error
    const [adventures, setAdventures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [abilities, setAbilities] = useState([]);
    const [costLevels, setCostLevels] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const searchBoxRef = useRef(null);


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


    const handleEdit = (id) => {
        if (editingId === id) {
            // Save changes
            const formData = new FormData();
            Object.keys(editData).forEach(key => {
                if (editData[key] !== null && editData[key] !== undefined) {
                    formData.append(key, editData[key]);
                }
            });
            
            fetch(`/api/adventures/${id}`, {
                method: 'PUT',
                body: formData
            })
                .then((res) => {
                    if (!res.ok) throw new Error(`Edit failed: ${res.status}`);
                    setEditingId(null);
                    setEditData({});
                    loadData();
                })
                .catch((err) => {
                    console.error(err);
                    alert(`Edit failed: ${err.message}`);
                });
        } else {
            // Start editing
            const adventure = adventures.find(a => a.id === id);
            setEditingId(id);
            setEditData({
                activity_name: adventure.activity_name,
                address: adventure.address,
                link: adventure.link,
                description: adventure.description,
                cost_level_id: adventure.cost_level_id,
                category_id: adventure.category_id,
                ability_level_id: adventure.ability_level_id,
                photo: adventure.photo,
                latitude: adventure.latitude,
                longitude: adventure.longitude
            });
            console.log('edited data', editData);
        }
    };

    // Handler for Accept
    const handleAccept = (id) => {
        fetch(`/api/adventures/status/${id}`, { method: 'PUT' })
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
            <Nav pageTitle="Pending Adventure" />
            <span></span>
            {/* <header className="pending-header">
                <h1>Pending Adventures</h1>
            </header> */}
            {/* <div className="pending-stripe" /> */}
            <ul className="pending-grid">
                {adventures.map((adv) => (
                    <li key={adv.id}>
                        <article className={`pending-card ${editingId === adv.id ? 'editing' : ''}`}>
                            <div className="card-title">
                                {editingId === adv.id ? (
                                    <input
                                        type="text"
                                        value={editData.activity_name || ''}
                                        onChange={(e) => setEditData({...editData, activity_name: e.target.value})}
                                    />
                                ) : (
                                    adv.activity_name
                                )}
                            </div>

                            <div className="card-top">
                                <div className="card-top-left">
                                    {editingId === adv.id ? (
                                        <>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id={`file-input-${adv.id}`}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setEditData({...editData, photo: file});
                                                    }
                                                }}
                                            />
                                            <img 
                                                src={editData.photo instanceof File ? URL.createObjectURL(editData.photo) : `http://localhost:5001/uploads/${editData.photo || adv.photo}`}
                                                alt={adv.photo}
                                                className='adventure-image'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const input = e.target.parentNode.querySelector(`#file-input-${adv.id}`);
                                                    if (input) input.click();
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </>
                                    ) : (
                                        <img src={`http://localhost:5001/uploads/${adv.photo}`}
                                             alt={adv.photo}
                                             className='adventure-image' />
                                    )}
                                </div>
                                <div className="card-top-right">
                                    <div className="card-top-right-box">
                                        <div className="field">
                                            <label htmlFor={`price-${adv.id}`}>
                                                Price
                                            </label>
                                            <select
                                                id={`price-${adv.id}`}
                                                value={editingId === adv.id ? editData.cost_level_id : adv.cost_level_id}
                                                onChange={editingId === adv.id ? (e) => setEditData({...editData, cost_level_id: e.target.value}) : undefined}
                                                disabled={editingId !== adv.id}
                                            >
                                                {costLevels.map((c) => (
                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.cost_level || c.label}
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
                                                value={editingId === adv.id ? editData.category_id : adv.category_id}
                                                onChange={editingId === adv.id ? (e) => setEditData({...editData, category_id: e.target.value}) : undefined}
                                                disabled={editingId !== adv.id}
                                            >
                                                {categories.map((c) => (
                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.category_name}
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
                                                value={editingId === adv.id ? editData.ability_level_id : adv.ability_level_id}
                                                onChange={editingId === adv.id ? (e) => setEditData({...editData, ability_level_id: e.target.value}) : undefined}
                                                disabled={editingId !== adv.id}
                                            >
                                                {abilities.map((a) => (
                                                    <option
                                                        key={a.id}
                                                        value={a.id}
                                                    >
                                                        {a.ability_level || a.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label>Location</label>
                                {editingId === adv.id ? (
                                    <StandaloneSearchBox
                                        onLoad={ref => searchBoxRef.current = ref}
                                        onPlacesChanged={() => {
                                            if (searchBoxRef.current) {
                                                const places = searchBoxRef.current.getPlaces();
                                                if (places && places.length > 0) {
                                                    const place = places[0];
                                                    const location = place.geometry.location;
                                                    setEditData({
                                                        ...editData,
                                                        address: place.formatted_address,
                                                        latitude: location.lat(),
                                                        longitude: location.lng()
                                                    });
                                                }
                                            }
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={editData.address || ''}
                                            onChange={(e) => setEditData({...editData, address: e.target.value})}
                                            placeholder="Enter an address"
                                        />
                                    </StandaloneSearchBox>
                                ) : (
                                    <input
                                        type="text"
                                        readOnly
                                        value={adv.address}
                                    />
                                )}
                            </div>
                            <div className="field">
                                <label>Link (Optional)</label>
                                <input
                                    type="text"
                                    readOnly={editingId !== adv.id}
                                    value={editingId === adv.id ? editData.link : adv.link}
                                    onChange={editingId === adv.id ? (e) => setEditData({...editData, link: e.target.value}) : undefined}
                                />
                            </div>
                            <div className="field description">
                                <label>Description</label>
                                <textarea
                                    readOnly={editingId !== adv.id}
                                    rows="3"
                                    value={editingId === adv.id ? editData.description : adv.description}
                                    onChange={editingId === adv.id ? (e) => setEditData({...editData, description: e.target.value}) : undefined}
                                />
                            </div>

                            <div className="card-buttons">

                            <button
                                    className="btn edit"
                                    onClick={() => handleEdit(adv.id)}
                                >
                                    {editingId === adv.id ? 'Save' : 'Edit'}
                                </button>

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
