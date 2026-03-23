import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import BlogLayout from './layout';

afterEach(cleanup);

describe('BlogLayout', () => {
  it('renders children', () => {
    const { getByText } = render(
      <BlogLayout>
        <p>Child content</p>
      </BlogLayout>,
    );
    expect(getByText('Child content')).toBeInTheDocument();
  });

  it('wraps children in max-width container', () => {
    const { container } = render(
      <BlogLayout>
        <p>Content</p>
      </BlogLayout>,
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('max-w-3xl');
  });
});
