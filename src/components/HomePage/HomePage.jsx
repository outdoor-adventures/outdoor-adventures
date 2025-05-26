import HeroSection from '../HeroSection/HeroSection';
import HowItWorksSection from '../HowItWorksSection/HowItWorksSection';
import RecentActivitySection from '../RecentActivitySection/RecentActivitySection';
import Nav from '../Nav/Nav';

function HomePage() {
    return (
        <>
            <Nav pageTitle="Outdoor Adventures" />

            {/* Home Page Sections (Components) */}
            <HeroSection />
            <HowItWorksSection />
            <RecentActivitySection />
        </>
    );
}

export default HomePage;
