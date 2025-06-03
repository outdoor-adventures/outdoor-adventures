import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Nav/Nav';
import './UserPage.css';
import useStore from '../../zustand/store'

const UserPage = () => {
    const user = useStore((store) => store.user);
    const [myAdventures, setMyAdventures] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // fetch both my-adventures and favorites in parallel
        Promise.all([
            fetch(`/api/adventures/my/${user.id}`),
            fetch(`/api/adventures/my/favorites/${user.id}`),
        ])
            .then(async ([resMy, resFav]) => {
                if (!resMy.ok || !resFav.ok) {
                    throw new Error('Failed to load adventures');
                }
                const myData = await resMy.json();
                const favData = await resFav.json();
                setMyAdventures(myData);
                setFavorites(favData);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="user-page">
                <p>Loading your adventures…</p>
            </section>
        );
    }
    if (error) {
        return (
            <section className="user-page">
                <p>Error: {error}</p>
            </section>
        );
    }

    return (
        <section className="user-page">
            <span></span>
            <Nav pageTitle="My Adventure Page" />

            {/* My Adventures */}
            <article className="user-section">

                <header className="section-header">
                    <Link to="/my-adventures" className="view-list">
                        View List →
                    </Link>
                </header>

                <div className="cards-container">
                    {myAdventures.map((adv) => (
                        <div key={adv.id} className="card">
                            <img src={`http://localhost:5001/uploads/${adv.photo}`}
                      alt={adv.photo}
                      className='adventure-image' />

                            <h3 className="card-category">{adv.category}</h3>
                            <p className="card-location">{adv.location}</p>
                            <p className="card-status">Status: {adv.status}</p>
                            <Link
                                to={`/adventures/${adv.id}`}
                                className="btn details"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </article>

            {/* Favorite Adventures */}
            <article className="user-section">
                <header className="section-header">
                    <h2>Favorite Adventures</h2>
                    <Link to="/favorites" className="view-list">
                        View List →
                    </Link>
                </header>
                <div className="cards-container">
                    {favorites.map((adv) => (
                        <div key={adv.id} className="card">
                            <img src={`http://localhost:5001/uploads/${adv.photo}`}
                                alt={adv.photo}
                                className='adventure-image' />

                            <h3 className="card-category">{adv.category_name}</h3>
                            <p className="card-location">{adv.address}</p>
                            <Link
                                to={`/adventures/${adv.id}`}
                                className="btn details"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </article>
        </section>
    );
};

export default UserPage;
