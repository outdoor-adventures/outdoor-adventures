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
    
    // Helper function to get correct image URL
    const getImageUrl = (photo) => {
        if (!photo) return '';
        // If it's already a full URL (starts with http), use it directly
        if (photo.startsWith('http')) {
            return photo;
        }
        // Otherwise, it's a legacy filename, use local path
        return `http://localhost:5001/uploads/${photo}`;
    };
    

    useEffect(() => {
        // Only fetch if user is loaded
        if (!user || !user.id) {
            setLoading(false);
            return;
        }
        
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
    }, [user]);

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

            {/* My Adventures */}
            <article className="user-section">
                <header className="section-header">
                    <h2>My Adventures</h2>
                    {/* <Link to="/my-adventures" className="view-list">
                        View List →
                    </Link> */}
                </header>
                <div className="cards-container">
                    {myAdventures.map((adv) => (
                        <div key={adv.id} className="card">
                      
                      <div className="my-adventure-image">
                        <img src={getImageUrl(adv.photo)}
                      alt={adv.activity_name}
                      className='recent-adventure-image' />

                    </div>
                    <h3 className="card-adventure-name">{adv.activity_name}</h3>
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
                    {/* <Link to="/favorites" className="view-list">
                        View List →
                    </Link> */}
                </header>
                <div className="cards-container">
                    {favorites.map((adv) => (
                        <div key={adv.id} className="card">
                            <img src={getImageUrl(adv.photo)}
                      alt={adv.activity_name}
                      className='recent-adventure-image' />
                                          <h3 className="card-adventure-name">{adv.activity_name}</h3>
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
