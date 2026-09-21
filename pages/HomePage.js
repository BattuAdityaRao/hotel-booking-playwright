export class HomePage {
  constructor(page) {
    this.page = page;

    // ── Header / Navigation ──────────────────────────────────────────────────
    this.navbar          = page.locator('nav.navbar');
    this.brandLogo       = page.locator('a.navbar-brand');
    // Nav links inside the navbar only
    this.navLinks        = page.locator('nav.navbar a');
    // Use the exact navbar "Admin" link (nav-link class) to avoid strict mode violation
    this.adminLink       = page.locator('nav.navbar a.nav-link[href*="admin"]');

    // ── Hero / Banner ────────────────────────────────────────────────────────
    this.heroHeading     = page.locator('h1').first();

    // ── Rooms section ────────────────────────────────────────────────────────
    // Actual class names confirmed from live site DOM inspection
    this.roomCards       = page.locator('.room-card');
    this.roomImages      = page.locator('.room-card .card-img-top, .room-card .room-image');
    // Book button is an <a> tag with class btn-primary and text "Book now"
    this.bookThisRoom    = page.locator('a.btn.btn-primary:has-text("Book now"), a.btn-primary:has-text("Book now")');

    // ── Footer ───────────────────────────────────────────────────────────────
    this.footer          = page.locator('footer');
    this.footerLinks     = page.locator('footer a');
    this.footerCopyright = page.locator('footer').locator('p, span, div').filter({ hasText: /©|copyright|shady meadows|booking/i }).first();

    // ── Admin link ───────────────────────────────────────────────────────────
    this.adminPanelLink  = page.locator('a[href="/admin"]').first();
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigate() {
    await this.page.goto('/');
    await this.waitForPageReady();
  }

  // Wait for the React app to finish rendering
  async waitForPageReady() {
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for at least one hotel-room element OR the navbar to confirm render
    await this.page.waitForSelector('nav.navbar', { timeout: 15000 });
  }

  async getTitle() {
    return this.page.title();
  }

  async getUrl() {
    return this.page.url();
  }

  // ── Rooms ──────────────────────────────────────────────────────────────────

  async waitForRooms() {
    await this.page.waitForSelector('.room-card', { timeout: 20000 });
  }

  async getRoomCount() {
    await this.waitForRooms();
    return this.roomCards.count();
  }

  async getRoomImageCount() {
    await this.waitForRooms();
    return this.roomImages.count();
  }

  async clickFirstBookButton() {
    await this.bookThisRoom.first().click();
  }

  // ── Footer ─────────────────────────────────────────────────────────────────

  async isFooterVisible() {
    return this.footer.isVisible();
  }

  async getFooterLinkCount() {
    return this.footerLinks.count();
  }

  // ── Responsiveness ─────────────────────────────────────────────────────────

  async setViewport(width, height) {
    await this.page.setViewportSize({ width, height });
  }

  async isNavbarVisible() {
    return this.navbar.isVisible();
  }

  // ── Scroll ─────────────────────────────────────────────────────────────────

  async scrollToFooter() {
    await this.footer.scrollIntoViewIfNeeded();
  }

  async scrollToRooms() {
    await this.waitForRooms();
    await this.roomCards.first().scrollIntoViewIfNeeded();
  }

  async isRoomsSectionVisible() {
    await this.waitForRooms();
    return this.roomCards.first().isVisible();
  }
}
