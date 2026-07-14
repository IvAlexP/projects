import { Hero, Section1, Section2, Section3 } from '@/features/home/components';
import { Header } from '@/components';

function LandingPage() {
  return (
    <div>
      <Header/>
      <Hero/>
      <Section1/>
      <Section2/>
      <Section3/>
    </div>
  );
}

export default LandingPage;