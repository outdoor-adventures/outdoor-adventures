import useStore from '../../zustand/store';
import HeroSection from '../HeroSection/HeroSection';
import HowItWorksSection from '../HowItWorksSection/HowItWorksSection';
import RecentActivitySection from '../RecentActivitySection/RecentActivitySection';
import Nav from '../Nav/Nav';

function HomePage(props) {
    const user = useStore((state) => state.user);
    const logOut = useStore((state) => state.logOut);

    return (
        <>

              <Nav pageTitle="Outdoor Adventures" />
            <h1>Home Page Test - Pat</h1>
            <h2>Home Page</h2>
            <p>Your username is: {user.username}</p>
            <p>Your ID is: {user.id}</p>
            <button onClick={logOut}>Log Out</button>


            {/* Home Page Sections (Components) */}
            <HeroSection />
            <HowItWorksSection />
            <RecentActivitySection />
        </>
    );
}

export default HomePage;
