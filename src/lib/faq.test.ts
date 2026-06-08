import { describe, expect, it } from 'vitest';
import { extractFaqs, stripInlineMarkdown } from './faq';

const faqMdx = `## Some Heading

Intro paragraph.

<FAQ>
<div>
### Doesn't "speak last" make the leader seem disengaged?

It does the opposite. [Project Aristotle](https://example.com/aristotle) found psychological safety mattered most (Google, 2015).
</div>
<div>
### Won't written-first formats slow things down?

Research shows it speeds things up. Meetings get shorter.
</div>
</FAQ>

## After

More body text.`;

describe('extractFaqs', () => {
  it('returns an empty array when there is no FAQ block', () => {
    expect(extractFaqs('# Just a post\n\nNo questions here.')).toEqual([]);
  });

  it('extracts each question and answer from the FAQ block', () => {
    const faqs = extractFaqs(faqMdx);
    expect(faqs).toHaveLength(2);
    expect(faqs[0].question).toBe('Doesn\'t "speak last" make the leader seem disengaged?');
    expect(faqs[1].question).toBe("Won't written-first formats slow things down?");
  });

  it('strips markdown links from answers, keeping the visible text', () => {
    const faqs = extractFaqs(faqMdx);
    expect(faqs[0].answer).toContain('Project Aristotle found');
    expect(faqs[0].answer).not.toContain('https://example.com');
    expect(faqs[0].answer).not.toContain('[');
  });

  it('ignores divs without a question heading', () => {
    const raw =
      '<FAQ>\n<div>\nNo heading, just text.\n</div>\n<div>\n### Real question?\n\nReal answer.\n</div>\n</FAQ>';
    const faqs = extractFaqs(raw);
    expect(faqs).toHaveLength(1);
    expect(faqs[0].question).toBe('Real question?');
  });
});

describe('stripInlineMarkdown', () => {
  it('removes emphasis markers and collapses whitespace', () => {
    expect(stripInlineMarkdown('this is **bold** and _italic*   spaced')).toBe('this is bold and italic spaced');
  });

  it('drops images entirely', () => {
    expect(stripInlineMarkdown('before ![alt text](/img.jpg) after')).toBe('before after');
  });
});
