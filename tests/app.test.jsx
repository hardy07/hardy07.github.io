// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App.jsx';
import { posts } from '../src/lib/posts.js';

const renderAt = (url) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  );

const versionControl = posts.find((p) => p.slug.includes('version-control'));
const ml = posts.find((p) => p.slug.includes('ml-101'));

beforeEach(() => {
  window.scrollTo = vi.fn();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});
afterEach(cleanup);

describe('client-side behaviour', () => {
  it('navigates from the home page to a post and updates <title> and meta tags', async () => {
    renderAt('/');
    fireEvent.click(screen.getByRole('link', { name: ml.title }));

    await waitFor(() => expect(document.title).toBe(`${ml.title} | Sakthivel's Blog`));
    expect(document.querySelector('meta[name="description"]').content).toBe(ml.description);
    expect(document.querySelector('link[rel="canonical"]').href).toBe(`https://hardy07.github.io${ml.url}`);
    expect(document.querySelector('meta[property="og:type"]').content).toBe('article');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('shows the formatted date exactly as written in the front matter', () => {
    renderAt('/');
    // Minecraft post is dated 2025-05-15 01:15 +0530; must not slip to May 14 in other timezones
    expect(screen.getByText('May 15, 2025')).toBeTruthy();
    expect(screen.getByText('Jul 31, 2023')).toBeTruthy();
  });

  it('mounts the Utterances comment widget with the right settings', () => {
    const { container } = renderAt(versionControl.url);
    const script = container.querySelector('#comments script');
    expect(script).toBeTruthy();
    expect(script.getAttribute('src')).toBe('https://utteranc.es/client.js');
    expect(script.getAttribute('repo')).toBe('hardy07/hardy07.github.io');
    expect(script.getAttribute('issue-term')).toBe('pathname');
    expect(script.getAttribute('theme')).toBe('github-dark');
  });

  it('copy button copies the code and shows feedback', async () => {
    const { container } = renderAt(versionControl.url);
    const button = container.querySelector('.copy-code-button');
    const code = button.nextElementSibling.textContent; // the <pre> right after the button
    fireEvent.click(button);
    await waitFor(() => expect(button.textContent).toBe('Copied!'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code);
  });

  it('prev/next links move between posts', async () => {
    renderAt(ml.url);
    // ml is the middle post: older = version control, newer = minecraft
    fireEvent.click(screen.getByTitle(versionControl.title));
    await waitFor(() => expect(document.title).toContain(versionControl.title));
    expect(screen.getByText('No Previous Post')).toBeTruthy(); // oldest post
  });

  it('remounts comments per post so each page gets its own thread', async () => {
    const { container } = renderAt(ml.url);
    const first = container.querySelector('#comments script');
    fireEvent.click(screen.getByTitle(versionControl.title));
    await waitFor(() => expect(document.title).toContain(versionControl.title));
    const second = container.querySelector('#comments script');
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);
    expect(container.querySelectorAll('#comments script').length).toBe(1);
  });

  it('archive pages link to posts', () => {
    const { container } = renderAt('/archive.html');
    expect(container.querySelectorAll('.post-content li a').length).toBe(posts.length);
    fireEvent.click(screen.getByText('Sort by date'));
    expect(screen.getByText('2025 May')).toBeTruthy();
  });

  it('shows a 404 page for unknown URLs', () => {
    renderAt('/2020/01/01/nothing-here.html');
    expect(screen.getByText('Page not found')).toBeTruthy();
  });
});
