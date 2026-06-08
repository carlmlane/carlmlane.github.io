import type { Metadata } from 'next';
import type { AboutPage as AboutPageSchemaType, WithContext } from 'schema-dts';
import { BreadcrumbSchema } from '@/components/blog/blog-schema';
import FormattedDate from '@/components/formatted-date';
import AboutContent, { metadata as frontmatter } from '@/content/about.mdx';
import { PERSON_ID } from '@/lib/person';
import { postMetadataSchema } from '@/lib/schemas';

const meta = postMetadataSchema.parse(frontmatter);

const title = 'About Carl M. Lane — VP of Engineering';
const url = 'https://carlmlane.com/about';

export const metadata: Metadata = {
  title,
  description: meta.description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description: meta.description,
    url,
    type: 'profile',
    ...(meta.image ? { images: [{ url: meta.image }] } : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: meta.description,
    ...(meta.image ? { images: [meta.image] } : {}),
  },
};

const aboutSchema: WithContext<AboutPageSchemaType> = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: title,
  url,
  description: meta.description,
  mainEntity: { '@id': PERSON_ID },
};

const About = () => (
  <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
    <script type="application/ld+json">{JSON.stringify(aboutSchema)}</script>
    <BreadcrumbSchema
      items={[
        { name: 'Home', url: 'https://carlmlane.com' },
        { name: 'About', url },
      ]}
    />
    <article className="animate-rise">
      <header className="mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{meta.title}</h1>
        {meta.lastUpdated ? (
          <p className="font-mono text-sm text-muted">
            Last updated <FormattedDate dateStr={meta.lastUpdated} />
          </p>
        ) : null}
      </header>
      <div className="prose prose-lg max-w-none">
        <AboutContent />
      </div>
    </article>
  </div>
);

export default About;
