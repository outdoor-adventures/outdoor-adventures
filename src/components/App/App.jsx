import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api'; //used in google maps api

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
import UserPage from '../UserPage/UserPage';
import AdminPage from '../AdminPage/AdminPage';
import NotFound from '../NotFound/NotFound';
import Footer from '../Footer/Footer';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; //google mapsi api key
const libraries = ["places"]; //used for google maps api

function App() {
    const user = useStore((state) => state.user);
    const fetchUser = useStore((state) => state.fetchUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <>
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
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

                    <Route
                        exact
                        path="/admin"
                        element={
                          user.id && user.user_rank === 1 ? (
                            <AdminPage />
                          ) : (
                            <Navigate to="/404" replace />
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
                    <Route exact path="/user" element={<UserPage />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </main>
          </LoadScript>
        </>
    );
}

export default App;
