import Beliefs from '@/components/beliefs';
import BioFacts from '@/components/bio-facts';
import Hero from '@/components/hero';
import Inspirations from '@/components/inspirations';
import Personal from '@/components/personal';
import Writing from '@/components/writing';

const Home = () => (
  <div className="flex min-h-screen items-start justify-center">
    <main className="w-full max-w-2xl space-y-24 px-6 py-20 sm:py-32">
      <Hero />
      <BioFacts />
      <Beliefs />
      <Inspirations />
      <Writing />
      <Personal />
      <footer className="pt-8 font-mono text-xs text-muted/50">&copy; {new Date().getFullYear()} Carl M. Lane</footer>
    </main>
  </div>
);

export default Home;
