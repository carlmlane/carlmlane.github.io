// Extracts FAQ question/answer pairs from a post's raw MDX so we can emit
// FAQPage JSON-LD without duplicating the content in frontmatter. Posts author
// FAQs as a single <FAQ> block of <div>s, each with a `###` question heading
// followed by answer prose (see CLAUDE.md "Adding a blog post").

type Faq = {
  readonly question: string;
  readonly answer: string;
};

// Reduce markdown to plain text: drop images, keep link text, remove inline
// code fences and emphasis markers, and collapse whitespace.
const stripInlineMarkdown = (text: string): string =>
  text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const parseDivBlock = (block: string): Faq | null => {
  const heading = block.match(/^\s*#{2,3}\s+(.+?)\s*$/m);
  if (!heading) {
    return null;
  }
  const question = stripInlineMarkdown(heading[1]);
  const answer = stripInlineMarkdown(block.slice(block.indexOf(heading[0]) + heading[0].length));
  if (!question || !answer) {
    return null;
  }
  return { question, answer };
};

const extractFaqs = (raw: string): readonly Faq[] => {
  const faqBlock = raw.match(/<FAQ>([\s\S]*?)<\/FAQ>/);
  if (!faqBlock) {
    return [];
  }
  return [...faqBlock[1].matchAll(/<div>([\s\S]*?)<\/div>/g)]
    .map((match) => parseDivBlock(match[1]))
    .filter((faq): faq is Faq => faq !== null);
};

export type { Faq };
export { extractFaqs, stripInlineMarkdown };
