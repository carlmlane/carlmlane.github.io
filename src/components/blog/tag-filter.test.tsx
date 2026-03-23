import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import TagFilter from './tag-filter';

afterEach(cleanup);

describe('TagFilter', () => {
  it('renders "All" chip and all tags', () => {
    const { getByText } = render(<TagFilter tags={['react', 'nextjs']} />);
    expect(getByText('All')).toBeInTheDocument();
    expect(getByText('react')).toBeInTheDocument();
    expect(getByText('nextjs')).toBeInTheDocument();
  });

  it('has nav with aria-label', () => {
    const { getByRole } = render(<TagFilter tags={['react']} />);
    expect(getByRole('navigation')).toHaveAttribute('aria-label', 'Filter posts by tag');
  });

  it('"All" has active styling when no activeTag', () => {
    const { getByText } = render(<TagFilter tags={['react']} />);
    expect(getByText('All').className).toContain('bg-accent');
  });

  it('"All" has inactive styling when activeTag is set', () => {
    const { getByText } = render(<TagFilter tags={['react']} activeTag="react" />);
    expect(getByText('All').className).toContain('bg-subtle');
  });
});
