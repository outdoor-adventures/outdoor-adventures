import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import useStore from '../../zustand/store';
import Nav from '../Nav/Nav';
import HomePage from '../HomePage/HomePage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import BrowseAdventuresPage from '../BrowseAdventuresPage/BrowseAdventuresPage';
import MyAdventuresViews from '../MyAdventuresViews/MyAdventuresViews';
import PendingAdventure from '../PendingAdventure/PendingAdventure';
import ContactUs from '../ContactUs/ContactUs';
import NewsletterSignUp from '../NewsletterSignUp/NewsletterSignUp';
import AboutUs from '../AboutUs/AboutUs';
import AddAdventureForm from '../AddAdventureForm/AddAdventureForm';

function App() {
    const user = useStore((state) => state.user);
    const fetchUser = useStore((state) => state.fetchUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <>
            <Nav />

            <main>
                <Routes>
                    <Route exact path="/" element={<HomePage />} />
                    <Route
                        exact
                        path="/browse"
                        element={<BrowseAdventuresPage />}
                    />

                    <Route
                        exact
                        path="/contact"
                        element={<ContactUs />}
                    />

                    <Route
                        exact
                        path="/add-adventure"
                        element={
                            user.id ? (
                                <AddAdventureForm />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    <Route
                        exact
                        path="/my-adventures"
                        element={
                            user.id ? (
                                <MyAdventuresViews />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        exact
                        path="/admin/pending"
                        element={
                            user.id && user.rank === 'ADMIN' ? (
                                <PendingAdventure />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route exact path="/contact" element={<ContactUs />} />

                    <Route
                        exact
                        path="/newsletter"
                        element={<NewsletterSignUp />}
                    />

                    <Route
                        exact
                        path="/login"
                        element={
                            user.id ? (
                                <Navigate to="/" replace /> // Redirect authenticated user.
                            ) : (
                                <LoginPage /> // Render LoginPage for unauthenticated user.
                            )
                        }
                    />
                    <Route
                        exact
                        path="/registration"
                        element={
                            user.id ? (
                                <Navigate to="/" replace /> // Redirect authenticated user.
                            ) : (
                                <RegisterPage /> // Render RegisterPage for unauthenticated user.
                            )
                        }
                    />
                    {/* ----------- */}
                    <Route exact path="/about" element={<AboutUs />} />

                    <Route path="*" element={<h2>404 Page</h2>} />
                </Routes>
            </main>
        </>
    );
}

export default App;
