import type { Person, WithContext } from 'schema-dts';

// Canonical identifier for the single Person entity across the whole site.
// Every schema that refers to Carl points at this @id so search engines
// resolve one consistent entity (strengthens E-E-A-T attribution).
const PERSON_ID = 'https://carlmlane.com/#person';
const PERSON_NAME = 'Carl M. Lane';
const PERSON_URL = 'https://carlmlane.com';

// Lightweight reference used on pages where the full Person node is present.
const personRef = { '@id': PERSON_ID } as const;

// Self-contained author node for pages (e.g. blog posts) that do not render
// the full Person node but still need to attribute content to the canonical entity.
const personNode = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: PERSON_NAME,
  url: PERSON_URL,
} as const;

const person: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@id': PERSON_ID,
  '@type': 'Person',
  name: PERSON_NAME,
  givenName: 'Carl',
  familyName: 'Lane',
  jobTitle: 'VP of Engineering & Product Development',
  url: PERSON_URL,
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

export { PERSON_ID, PERSON_NAME, PERSON_URL, person, personNode, personRef };
