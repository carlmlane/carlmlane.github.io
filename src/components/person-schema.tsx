import type { ProfilePage, WebSite, WithContext } from 'schema-dts';
import { person, personRef } from '@/lib/person';

const profilePage: WithContext<ProfilePage> = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: 'Carl M. Lane — VP of Engineering',
  url: 'https://carlmlane.com',
  mainEntity: personRef,
};

const webSite: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Carl M. Lane',
  url: 'https://carlmlane.com',
  description:
    'Personal site of Carl M. Lane, VP of Engineering & Product Development at Marqii. Based in San Francisco.',
  publisher: personRef,
};

const schemas = [
  { key: 'Person', schema: person },
  { key: 'ProfilePage', schema: profilePage },
  { key: 'WebSite', schema: webSite },
] as const;

const PersonSchema = () => (
  <>
    {schemas.map(({ key, schema }) => (
      <script key={key} type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    ))}
  </>
);

export { PersonSchema };
