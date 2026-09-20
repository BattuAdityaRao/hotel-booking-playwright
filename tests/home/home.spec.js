import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Home Page Tests — Tarun', () => {

  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  // ── Page Loading ───────────────────────────────────────────────────────────

  test.describe('Page Loading', () => {

    test('should load the home page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/automationintesting\.online/);
    });

    test('should have a valid page title', async ({ page }) => {
      const title = await homePage.getTitle();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('should have a visible h1 heading', async () => {
      await expect(homePage.heroHeading).toBeVisible();
    });

    test('should have a non-empty page body', async ({ page }) => {
      // Wait for navbar (React render signal) then check body text
      await page.waitForSelector('nav.navbar', { timeout: 15000 });
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length).toBeGreaterThan(0);
    });

  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  test.describe('Navigation', () => {

    test('should display the navigation bar', async () => {
      await expect(homePage.navbar).toBeVisible();
    });

    test('should display the brand logo', async () => {
      await expect(homePage.brandLogo).toBeVisible();
    });

    test('should have navigable links in the navbar', async () => {
      // Wait for navbar to fully render before counting links
      await homePage.page.waitForSelector('nav.navbar a', { timeout: 10000 });
      const count = await homePage.navLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display the admin link', async () => {
      // Use the specific navbar nav-link to avoid strict mode violation
      await expect(homePage.adminLink).toBeVisible();
    });

    test('should navigate to admin page when admin link is clicked', async ({ page }) => {
      await homePage.adminLink.click();
      await page.waitForURL(/admin/);
      expect(page.url()).toContain('admin');
    });

  });

  // ── Rooms Section & Images ─────────────────────────────────────────────────

  test.describe('Rooms Section and Images', () => {

    test('should display at least one room card', async () => {
      const count = await homePage.getRoomCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should display room images', async () => {
      const imgCount = await homePage.getRoomImageCount();
      expect(imgCount).toBeGreaterThan(0);
    });

    test('all room images should have a non-empty src attribute', async () => {
      await homePage.waitForRooms();
      // Room images use class card-img-top with direct src attributes
      const images = homePage.page.locator('.card-img-top');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const src = await images.nth(i).getAttribute('src');
        expect(src).toBeTruthy();
      }
    });

    test('should display Book Now button for at least one room', async () => {
      await homePage.waitForRooms();
      // "Book now" is an <a> link, not a <button>
      const bookLinks = homePage.page.locator('a.btn-primary:has-text("Book now"), a.btn.btn-primary:has-text("Book now")');
      const count = await bookLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should scroll to the rooms section without errors', async () => {
      await homePage.scrollToRooms();
      await expect(homePage.roomCards.first()).toBeVisible();
    });

  });

  // ── Footer ─────────────────────────────────────────────────────────────────

  test.describe('Footer', () => {

    test('should display the footer', async () => {
      await homePage.scrollToFooter();
      const visible = await homePage.isFooterVisible();
      expect(visible).toBe(true);
    });

    test('should contain at least one link in the footer', async () => {
      await homePage.scrollToFooter();
      const count = await homePage.getFooterLinkCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should display copyright text in the footer', async () => {
      await homePage.scrollToFooter();
      const footerText = await homePage.footer.innerText();
      expect(footerText).toMatch(/©|copyright|shady meadows|booking/i);
    });

    test('footer links should have non-null href attributes', async ({ browserName }) => {
      test.skip(browserName === 'firefox', 'Firefox headless rendering unstable on Windows for scroll operations');
      await homePage.scrollToFooter();
      const links = homePage.footerLinks;
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute('href');
        expect(href).not.toBeNull();
      }
    });

  });

  // ── Responsiveness ─────────────────────────────────────────────────────────

  test.describe('Responsiveness', () => {

    test('should render correctly on desktop viewport (1280x720)', async () => {
      await homePage.setViewport(1280, 720);
      await homePage.navigate();
      await expect(homePage.navbar).toBeVisible();
      await expect(homePage.heroHeading).toBeVisible();
    });

    test('should render correctly on tablet viewport (768x1024)', async ({ page, browserName }) => {
      test.skip(browserName === 'firefox', 'Firefox headless rendering unstable on Windows for viewport changes');
      await homePage.setViewport(768, 1024);
      await homePage.navigate();
      await page.waitForSelector('nav.navbar', { timeout: 15000 });
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length).toBeGreaterThan(0);
    });

    test('should render correctly on mobile viewport (375x667)', async ({ page, browserName }) => {
      test.skip(browserName === 'firefox', 'Firefox headless rendering unstable on Windows for viewport changes');
      await homePage.setViewport(375, 667);
      await homePage.navigate();
      await page.waitForSelector('nav.navbar', { timeout: 15000 });
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length).toBeGreaterThan(0);
    });

    test('should not show horizontal scroll on mobile viewport', async ({ page, browserName }) => {
      test.skip(browserName === 'firefox', 'Firefox headless rendering unstable on Windows for viewport changes');
      await homePage.setViewport(375, 667);
      await homePage.navigate();
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

    test('should display rooms on all viewports', async ({ page, browserName }) => {
      test.skip(browserName === 'firefox', 'Firefox headless rendering unstable on Windows for viewport changes');
      for (const [width, height] of [[1280, 720], [768, 1024], [375, 667]]) {
        await homePage.setViewport(width, height);
        await homePage.navigate();
        const count = await homePage.getRoomCount();
        expect(count).toBeGreaterThan(0);
      }
    });

  });

});
