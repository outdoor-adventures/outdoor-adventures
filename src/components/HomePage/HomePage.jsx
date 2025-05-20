import useStore from '../../zustand/store';
import HeroSection from '../HeroSection/HeroSection';
import HowItWorksSection from '../HowItWorksSection/HowItWorksSection';
import RecentActivitySection from '../RecentActivitySection/RecentActivitySection';

function HomePage() {
    const user = useStore((state) => state.user);
    const logOut = useStore((state) => state.logOut);

    return (
        <>
            {/* Home Page Sections (Components) */}
            <HeroSection />
            <HowItWorksSection />
            <RecentActivitySection />
        </>
    );
}

export default HomePage;
