import type { Person, ProfilePage, WebSite, WithContext } from 'schema-dts';

const person: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Carl M. Lane',
  givenName: 'Carl',
  familyName: 'Lane',
  jobTitle: 'VP of Engineering & Product Development',
  url: 'https://carlmlane.com',
  image: 'https://carlmlane.com/opengraph-image.png',
  description:
    'Engineering leader building high-performing engineering teams. VP of Engineering & Product Development at Marqii. Based in San Francisco.',
  worksFor: {
    '@type': 'Organization',
    name: 'Marqii',
    url: 'https://www.marqii.com',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Saint Louis University Parks College of Engineering, Aviation and Technology',
  },
  sameAs: ['https://github.com/carlmlane', 'https://linkedin.com/in/carlmlane'],
  knowsAbout: [
    'Software Engineering',
    'Engineering Leadership',
    'Team Building',
    'Product Development',
    'Web Development',
    'TypeScript',
    'Python',
    'Scala',
    'PostgreSQL',
    'AWS',
    'Google Cloud',
    'Functional Programming',
    'Aerospace Engineering',
  ],
  nationality: {
    '@type': 'Country',
    name: 'United States',
  },
  gender: 'Male',
  homeLocation: {
    '@type': 'City',
    name: 'San Francisco',
    containedInPlace: {
      '@type': 'State',
      name: 'California',
    },
  },
};

const profilePage: WithContext<ProfilePage> = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: 'Carl M. Lane — VP of Engineering',
  url: 'https://carlmlane.com',
  mainEntity: {
    '@type': 'Person',
    name: 'Carl M. Lane',
    url: 'https://carlmlane.com',
  },
};

const webSite: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Carl M. Lane',
  url: 'https://carlmlane.com',
  description:
    'Personal site of Carl M. Lane, VP of Engineering & Product Development at Marqii. Based in San Francisco.',
  publisher: {
    '@type': 'Person',
    name: 'Carl M. Lane',
    url: 'https://carlmlane.com',
  },
};

const schemas = [person, profilePage, webSite];

const PersonSchema = () => (
  <>
    {schemas.map((schema) => (
      <script key={schema['@type'] as string} type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    ))}
  </>
);

export { PersonSchema };
