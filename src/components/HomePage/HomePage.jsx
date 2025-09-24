import HeroSection from '../HeroSection/HeroSection';
import HowItWorksSection from '../HowItWorksSection/HowItWorksSection';
import RecentActivitySection from '../RecentActivitySection/RecentActivitySection';
import Nav from '../Nav/Nav';
import './HomePage.css';
import useStore from '../../zustand/store';

function HomePage() {

    const user = useStore((state) => state.user);
    const logOut = useStore((state) => state.logOut);

    return (
        <>

        <div className="home-background">
              <Nav pageTitle="My Outdoor Adventures" />

            {/* Home Page Sections (Components) */}
            <HeroSection />
            <HowItWorksSection />
            <RecentActivitySection />
        </div>
        </>
    );
}

export default HomePage;
