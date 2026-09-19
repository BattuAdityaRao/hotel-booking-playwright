export class AvailabilityPage {
  constructor(page) {
    this.page = page;

    // ── Date picker inputs (inside react-datepicker wrappers) ──────────────
    // The site renders two unlabelled <input class="form-control"> elements
    // inside .react-datepicker__input-container — first = Check In, second = Check Out.
    this.checkInInput  = page.locator('.react-datepicker__input-container input').first();
    this.checkOutInput = page.locator('.react-datepicker__input-container input').nth(1);

    // ── Check Availability button ──────────────────────────────────────────
    this.checkAvailabilityBtn = page.getByRole('button', { name: 'Check Availability' });

    // ── Room results ───────────────────────────────────────────────────────
    // Each room is a .room-card; "Book now" links live in its card-footer.
    this.roomCards    = page.locator('.room-card');
    this.bookNowLinks = page.locator('.room-card a.btn-primary');
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  /** Navigate to the home page (where the availability search widget lives). */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Date helpers ──────────────────────────────────────────────────────────

  /**
   * Fill a date picker input.
   * Triple-click selects all existing text, then type() replaces it.
   * Date format expected by the site: dd/MM/yyyy (e.g. "25/11/2026").
   */
  async #fillDate(locator, ddMMYYYY) {
    await locator.click({ clickCount: 3 });
    await locator.type(ddMMYYYY);
  }

  /** Select the check-in date. Format: "dd/MM/yyyy". */
  async selectCheckIn(ddMMYYYY) {
    await this.#fillDate(this.checkInInput, ddMMYYYY);
  }

  /** Select the check-out date. Format: "dd/MM/yyyy". */
  async selectCheckOut(ddMMYYYY) {
    await this.#fillDate(this.checkOutInput, ddMMYYYY);
  }

  /** Select both dates and click Check Availability in one call. */
  async searchAvailability(checkIn, checkOut) {
    await this.selectCheckIn(checkIn);
    await this.selectCheckOut(checkOut);
    await this.clickCheckAvailability();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async clickCheckAvailability() {
    await this.checkAvailabilityBtn.click();
  }

  // ── Assertions / Queries ──────────────────────────────────────────────────

  /** Returns the current value of the check-in input (as shown in the field). */
  async getCheckInValue() {
    return this.checkInInput.inputValue();
  }

  /** Returns the current value of the check-out input (as shown in the field). */
  async getCheckOutValue() {
    return this.checkOutInput.inputValue();
  }

  /** Returns the number of room cards displayed. */
  async getRoomCount() {
    return this.roomCards.count();
  }

  /** True if at least one "Book now" link is visible. */
  async hasBookNowLinks() {
    return (await this.bookNowLinks.count()) > 0;
  }

  /**
   * Returns the href of the first "Book now" link.
   * The site encodes dates as ISO strings: checkin=YYYY-MM-DD&checkout=YYYY-MM-DD
   */
  async getFirstBookNowHref() {
    return this.bookNowLinks.first().getAttribute('href');
  }

  /**
   * Converts a dd/MM/yyyy string to its YYYY-MM-DD ISO equivalent so we can
   * verify that the dates fed into the search appear correctly in the href.
   */
  static toIso(ddMMYYYY) {
    const [dd, mm, yyyy] = ddMMYYYY.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * Verify that the "Book now" links carry exactly the dates entered.
   * This confirms the search wired the selected dates through to the
   * reservation links — not just that any link happens to exist.
   */
  async bookNowLinksCarryDates(checkIn, checkOut) {
    const href = await this.getFirstBookNowHref();
    const isoIn  = AvailabilityPage.toIso(checkIn);
    const isoOut = AvailabilityPage.toIso(checkOut);
    return href.includes(`checkin=${isoIn}`) && href.includes(`checkout=${isoOut}`);
  }
}
