import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.locator('h1').waitFor();
if (!await page.getByRole('heading', { level: 1, name: '木马' }).isVisible()) throw new Error('Homepage profile missing');
if (!await page.getByRole('heading', { level: 2, name: '最近文章' }).isVisible()) throw new Error('Recent article cards missing');
if (await page.locator('.article-row').count() !== 8) throw new Error('Expected eight recent articles');
if (!await page.locator('html').evaluate((el) => el.classList.contains('dark'))) throw new Error('Permanent dark mode missing');
if (await page.locator('[data-theme-toggle]').count()) throw new Error('Theme switcher should be removed');
if (await page.getByText('知识地图').count()) throw new Error('Knowledge map should be removed');

await page.locator('[data-search-open]').click();
await page.locator('.search-dialog[open]').waitFor();
await page.locator('.pagefind-ui__search-input').fill('CPU');
await page.locator('.pagefind-ui__result').first().waitFor();
await page.locator('[data-search-close]').click();

await page.goto('http://127.0.0.1:4321/note/', { waitUntil: 'networkidle' });
if (!await page.locator('.article-row').filter({ hasText: '计算机科学' }).isVisible()) throw new Error('Note directory missing');
await page.locator('.article-row').filter({ hasText: '计算机科学' }).click();
await page.waitForURL('**/note/computerscience/');
if (!await page.locator('.article-row').filter({ hasText: '深入理解计算机系统' }).isVisible()) throw new Error('Nested directory missing');

await page.goto('http://127.0.0.1:4321/note/mathematics/analysis/一元函数的微积分/', { waitUntil: 'networkidle' });
if (!await page.getByRole('heading', { level: 1, name: '一元函数的微积分' }).isVisible()) throw new Error('Migrated title missing');
if (await page.locator('.katex').count() === 0) throw new Error('KaTeX output missing');
if (await page.locator('.note-sidebar').count() === 0) throw new Error('Note sidebar missing');

await page.goto('http://127.0.0.1:4321/note/computerscience/csapp/cpu/', { waitUntil: 'networkidle' });
if (!await page.getByRole('heading', { level: 1, name: 'CPU(RISC-V)' }).isVisible()) throw new Error('CPU note missing');

await page.goto('http://127.0.0.1:4321/note/computerscience/dsaa/树/', { waitUntil: 'networkidle' });
if (!await page.getByRole('heading', { level: 1, name: '树' }).isVisible()) throw new Error('DSAA note page missing');

await page.goto('http://127.0.0.1:4321/create/novel/no.1001/', { waitUntil: 'networkidle' });
if (!await page.getByRole('heading', { level: 1, name: 'No.1001' }).isVisible()) throw new Error('Dotted canonical URL missing');

await page.goto('http://127.0.0.1:4321/create/', { waitUntil: 'networkidle' });
if (!await page.locator('.article-row').filter({ hasText: '小说' }).isVisible()) throw new Error('Novel parent hierarchy missing');
await page.locator('.article-row').filter({ hasText: '小说' }).click();
await page.waitForURL('**/create/novel/');
if (await page.locator('.article-row').count() < 5) throw new Error('Novel listing missing');

await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.locator('[data-menu]').click();
if (!await page.locator('[data-menu-panel]').isVisible()) throw new Error('Mobile menu did not open');
await page.locator('[data-menu-panel] a[href="/create/"]').click();
await page.waitForURL('**/create/');

const relevantErrors = errors.filter((message) => !message.includes('giscus') && !message.includes('Failed to fetch'));
if (relevantErrors.length) throw new Error(`Browser errors: ${relevantErrors.join(' | ')}`);
await mkdir('.screenshots', { recursive: true });
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '.screenshots/home-desktop.png', fullPage: true });
await page.setViewportSize({ width: 900, height: 1100 });
await page.goto('http://127.0.0.1:4321/note/mathematics/analysis/一元函数的微积分/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '.screenshots/article-tablet.png', fullPage: false });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '.screenshots/home-mobile.png', fullPage: false });
console.log('Browser verification passed: homepage, indexes, desktop, mobile, dark mode, search, content, math, and hierarchy.');
await browser.close();
