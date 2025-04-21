// Utility to strip markdown from a string (basic version)
export default function stripMarkdown(markdown: string): string {
    // Remove code blocks, inline code, images, links, emphasis, headings, blockquotes, lists, etc.
    return markdown
      .replace(/`{3}[\s\S]*?`{3}/g, '') // code blocks
      .replace(/`[^`]*`/g, '') // inline code
      .replace(/!\[[^\]]*\]\([^\)]*\)/g, '') // images
      .replace(/\[[^\]]*\]\([^\)]*\)/g, '') // links
      .replace(/[#*_>~\-]+/g, '') // headings, emphasis, blockquotes, strikethrough, lists
      .replace(/\d+\. /g, '') // numbered lists
      .replace(/\n{2,}/g, '\n') // multiple newlines
      .replace(/\n/g, ' ') // single newline to space
      .trim();
  }
  