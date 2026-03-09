import Beliefs from '@/components/beliefs';
import BioFacts from '@/components/bio-facts';
import Footer from '@/components/footer';
import Hero from '@/components/hero';
import Inspirations from '@/components/inspirations';
import PersonSchema from '@/components/person-schema';
import Personal from '@/components/personal';

const Home = () => (
  <div className="flex min-h-screen items-start justify-center">
    <PersonSchema />
    <main className="w-full max-w-3xl space-y-16 px-6 py-20 sm:py-28">
      <Hero />
      <BioFacts />
      <Beliefs />
      <Inspirations />
      <Personal />
      <Footer />
    </main>
  </div>
);

export default Home;
