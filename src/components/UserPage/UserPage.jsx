import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Nav/Nav';
import './UserPage.css';
import useStore from '../../zustand/store'
import BasicModal from './BasicModal/BasicModal';

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
            fetch(`/api/adventures/my/${user.id}`),
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
                <Nav pageTitle="My Adventure Page" />
                <p>Loading your adventures…</p>
            </section>
        );
    }
    if (error) {
        return (
            <section className="user-page">
                <Nav pageTitle="My Adventure Page" />
                <p>Error: {error}</p>
            </section>
        );
    }

    return (
        <section className="user-page">
            <span></span>
            <Nav pageTitle="My Adventure Page" />
            <div className="user-page__home">
                <Link to="/" aria-label="Home" className="home-button">
                    🏠
                </Link>
            </div>

            {/* My Adventures */}
            <article className="user-section">
                <header className="section-header">
                    <h2>My Adventures</h2>
                    <Link to="/my-adventures" className="view-list">
                        View List →
                    </Link>
                </header>
                <div className="cards-container">
                    {myAdventures.map((adv) => (
                        <div key={adv.id} className="card">
                      
                      <div key={adv.id} className="my-adventure-image">
                        <img src={`http://localhost:5001/uploads/${adv.photo}`}
                      alt={adv.photo}
                      className='recent-adventure-image' />

                    </div>

                            <h3 className="card-category">{adv.category_name}</h3>
                            <p className="card-location">{adv.address}</p>
                            <p className="card-status">Status: {adv.status}</p>
                            
                            
                            <BasicModal adv={adv} />
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
                      className='recent-adventure-image' />
                            <p className="card-location">{adv.activity_name}</p>
                            <h3 className="card-category">{adv.category_name}</h3>
                            <p className="card-location">{adv.address}</p>
                            <BasicModal adv={adv} />
                        </div>
                    ))}
                </div>
            </article>
        </section>
    );
};

export default UserPage;
