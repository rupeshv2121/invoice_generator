
import BenefitsSection from './components/BenefitsSection';
import CTASection from './components/CTASection';
import DemoSection from './components/DemoSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import Navigation from './components/Navigation';
import PricingSection from './components/PricingSection';
import SocialProofSection from './components/SocialProofSection';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            <main>
                <HeroSection />
                <FeaturesSection />
                <SocialProofSection />
                <BenefitsSection />
                <DemoSection />
                <PricingSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;