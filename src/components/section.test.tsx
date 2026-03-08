import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AnimatedSection, Section } from './section';

afterEach(cleanup);

describe('Section', () => {
  it('renders children', () => {
    const { getByText } = render(<Section>Content</Section>);
    expect(getByText('Content')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    const { getByText } = render(<Section label="// test">Content</Section>);
    expect(getByText('// test')).toBeInTheDocument();
  });

  it('does not render label when omitted', () => {
    const { container } = render(<Section>Content</Section>);
    const labelElement = container.querySelector('p.font-mono');
    expect(labelElement).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Section className="custom-class">Content</Section>);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
    expect(section).toHaveClass('space-y-6');
  });

  it('renders as a section element', () => {
    const { container } = render(<Section>Content</Section>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

describe('AnimatedSection', () => {
  it('renders children within a FadeIn wrapper', () => {
    const { getByText, container } = render(<AnimatedSection>Animated content</AnimatedSection>);
    expect(getByText('Animated content')).toBeInTheDocument();
    // FadeIn renders a div with opacity-0 class by default
    const fadeWrapper = container.querySelector('div.opacity-0');
    expect(fadeWrapper).toBeInTheDocument();
  });

  it('passes label through to Section', () => {
    const { getByText } = render(<AnimatedSection label="// labeled">Content</AnimatedSection>);
    expect(getByText('// labeled')).toBeInTheDocument();
  });
});
