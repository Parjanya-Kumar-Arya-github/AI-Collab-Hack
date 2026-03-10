import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedByTeams from '../components/TrustedByTeams';
import FeaturesSection from '../components/FeaturesSection';
import PlatformPillars from '../components/PlatformPillars';
import WallOfLove from '../components/WallofLove';
import FooterCTA from '../components/FooterCTA';

const Landing = () => {
    return (
        <div className="bg-[#fcfaf9] min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
            <Navbar />
            <Hero />
            <TrustedByTeams />
            <FeaturesSection />
            <PlatformPillars />
            <WallOfLove />
            <FooterCTA />
        </div>
    );
};

export default Landing;
