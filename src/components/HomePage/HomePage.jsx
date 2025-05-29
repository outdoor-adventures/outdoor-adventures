import HeroSection from '../HeroSection/HeroSection';
import HowItWorksSection from '../HowItWorksSection/HowItWorksSection';
import RecentActivitySection from '../RecentActivitySection/RecentActivitySection';
import Nav from '../Nav/Nav';
import './HomePage.css';

function HomePage() {
    return (
        <>

        <div className="home-background">
              <Nav pageTitle="Outdoor Adventures" />
       
            <button onClick={logOut}>Log Out</button>



            {/* Home Page Sections (Components) */}
            <HeroSection />
            <HowItWorksSection />
            <RecentActivitySection />
        </div>
        </>
    );
}

export default HomePage;
