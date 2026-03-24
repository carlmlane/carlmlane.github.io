import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PersonSchema } from './person-schema';

afterEach(cleanup);

describe('PersonSchema', () => {
  const getSchema = () => {
    const { container } = render(<PersonSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    return JSON.parse(script?.textContent ?? '{}');
  };

  it('renders a JSON-LD script tag', () => {
    const { container } = render(<PersonSchema />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeInTheDocument();
  });

  it('has correct @type and @context', () => {
    const schema = getSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Person');
  });

  it('has core identity fields', () => {
    const schema = getSchema();
    expect(schema.name).toBe('Carl M. Lane');
    expect(schema.givenName).toBe('Carl');
    expect(schema.familyName).toBe('Lane');
    expect(schema.url).toBe('https://carlmlane.com');
  });

  it('has worksFor organization', () => {
    const schema = getSchema();
    expect(schema.worksFor).toEqual({ '@type': 'Organization', name: 'Marqii', url: 'https://www.marqii.com' });
  });

  it('has sameAs social profiles', () => {
    const schema = getSchema();
    expect(schema.sameAs).toContain('https://github.com/carlmlane');
    expect(schema.sameAs).toContain('https://linkedin.com/in/carlmlane');
  });

  it('has nationality', () => {
    const schema = getSchema();
    expect(schema.nationality).toEqual({ '@type': 'Country', name: 'United States' });
  });

  it('has gender', () => {
    const schema = getSchema();
    expect(schema.gender).toBe('Male');
  });

  it('has homeLocation', () => {
    const schema = getSchema();
    expect(schema.homeLocation['@type']).toBe('City');
    expect(schema.homeLocation.name).toBe('San Francisco');
  });

  it('has knowsAbout skills', () => {
    const schema = getSchema();
    expect(schema.knowsAbout).toContain('TypeScript');
    expect(schema.knowsAbout).toContain('Engineering Leadership');
    expect(schema.knowsAbout.length).toBeGreaterThan(5);
  });
});
