export class AdminBookingPage {
  constructor(page) {
    this.page = page;

    // ── Navigation ────────────────────────────────────────────────────────────
    this.adminUrl  = '/admin';
    this.roomsUrl  = '/admin/rooms';
    this.reportUrl = '/admin/report';

    // ── Login form ────────────────────────────────────────────────────────────
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton   = page.locator('#doLogin');

    // ── Admin nav ─────────────────────────────────────────────────────────────
    this.reportNavLink = page.locator('#reportLink');
    this.logoutButton  = page.locator('button.btn-outline-danger');

    // ── Rooms list ────────────────────────────────────────────────────────────
    // Each room row in /admin/rooms
    this.roomListings = page.locator('[data-testid="roomlisting"]');

    // ── Booking rows inside a room detail panel ───────────────────────────────
    // After clicking a room row the detail panel renders booking rows as:
    // <div class="detail booking-{roomid}"> … </div>
    this.bookingRows = page.locator('.detail[class*="booking-"]');

    // ── Booking row action icons ──────────────────────────────────────────────
    this.editBookingIcon   = page.locator('.fa-pencil.bookingEdit');
    this.deleteBookingIcon = page.locator('.fa-trash.bookingDelete');
    this.confirmEditIcon   = page.locator('.fa-check.confirmBookingEdit');
    this.cancelEditIcon    = page.locator('.fa-remove.exitBookingEdit');

    // ── Inline booking edit form inputs ──────────────────────────────────────
    this.editFirstnameInput = page.locator('input[name="firstname"]');
    this.editLastnameInput  = page.locator('input[name="lastname"]');
    this.editDepositSelect  = page.locator('select[name="depositpaid"]');
    // Date pickers inside the edit row (.dateWrapper wrappers: first=checkin, last=checkout)
    this.editCheckinInput   = page.locator('.dateWrapper input').first();
    this.editCheckoutInput  = page.locator('.dateWrapper input').last();

    // ── Report / calendar page ────────────────────────────────────────────────
    this.calendar       = page.locator('.rbc-calendar');
    this.calendarEvents = page.locator('.rbc-event-content');
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navigate to the admin rooms dashboard.
   * Requires an authenticated session (call login() first, or rely on storageState).
   */
  async navigate() {
    await this.page.goto(this.roomsUrl);
    await this.page.waitForLoadState('networkidle');
    // Wait for at least one room listing to be rendered
    await this.roomListings.first().waitFor({ state: 'visible' });
  }

  /**
   * Navigate to the admin report/calendar page that visualises all bookings.
   */
  async navigateToReport() {
    await this.page.goto(this.reportUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform a full admin login via the UI login form.
   * Safe to call even if already logged in — detects the login page first.
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.page.goto(this.adminUrl);
    await this.page.waitForLoadState('networkidle');
    // If the session is still valid the server redirects straight to /admin/rooms
    if (this.page.url().includes('/admin/rooms')) {
      await this.roomListings.first().waitFor({ state: 'visible' });
      return;
    }
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/admin/rooms');
    // Wait for room listings to render before returning
    await this.roomListings.first().waitFor({ state: 'visible' });
  }

  /**
   * Ensure the current page is authenticated. If the session has expired and
   * the page has drifted back to the login screen, re-login automatically.
   * Call this at the start of any method that navigates to an admin page.
   * @param {string} username
   * @param {string} password
   */
  async ensureLoggedIn(username, password) {
    const url = this.page.url();
    if (!url.includes('/admin/') || url.includes('/admin') && !url.includes('/admin/rooms') && !url.includes('/admin/report') && !url.includes('/admin/branding') && !url.includes('/admin/message')) {
      await this.login(username, password);
    }
  }

  // ── View bookings ────────────────────────────────────────────────────────────

  /**
   * Return the count of room listing rows visible on /admin/rooms.
   * @returns {Promise<number>}
   */
  async getRoomCount() {
    return await this.roomListings.count();
  }

  /**
   * Click a room row by zero-based index to expand the booking detail panel.
   * Waits for at least one booking row OR the booking table header to render.
   * @param {number} [index=0]
   */
  async openRoomBookings(index = 0) {
    await this.roomListings.nth(index).click();
    // Wait for the booking table headers (First name, Last name, …) to render
    await this.page.locator('.rowHeader').first().waitFor({ state: 'visible' });
  }

  /**
   * Click the room row whose room name matches the given number (e.g. '101').
   * This is more robust than using a zero-based index when room ordering may vary.
   * Waits for at least one booking row to render before returning.
   * @param {string} roomName  e.g. '101', '102', '103'
   */
  async openRoomBookingsByName(roomName) {
    // Each room row has a <p id="roomName{roomName}"> inside it
    const row = this.page.locator(`[data-testid="roomlisting"]:has(#roomName${roomName})`);
    await row.click();
    // Wait for booking rows to render (they load async after the click)
    await this.bookingRows.first().waitFor({ state: 'visible' });
  }

  /**
   * Return the count of booking rows currently visible in the detail panel.
   * @returns {Promise<number>}
   */
  async getBookingRowCount() {
    return await this.bookingRows.count();
  }

  /**
   * Read the text cells of a booking row by zero-based index.
   * Columns (left→right): firstname, lastname, price, depositpaid, checkin, checkout.
   * @param {number} [index=0]
   * @returns {Promise<{firstname:string, lastname:string, price:string, depositpaid:string, checkin:string, checkout:string}>}
   */
  async getBookingDetails(index = 0) {
    const row = this.bookingRows.nth(index);
    const cells = row.locator('p');
    const texts = await cells.allTextContents();
    return {
      firstname:   texts[0],
      lastname:    texts[1],
      price:       texts[2],
      depositpaid: texts[3],
      checkin:     texts[4],
      checkout:    texts[5],
    };
  }

  // ── Create booking (via API) ──────────────────────────────────────────────

  /**
   * Create a booking via the REST API using the authenticated browser context.
   * The auth cookie is inherited automatically from the browser session.
   *
   * @param {{roomid:number, firstname:string, lastname:string,
   *           depositpaid:boolean, checkin:string, checkout:string,
   *           email:string, phone:string}} bookingData
   * @returns {Promise<object>} Created booking object (includes bookingid)
   */
  async createBookingViaApi(bookingData) {
    const response = await this.page.request.post(
      'https://automationintesting.online/api/booking',
      {
        data: {
          roomid:      bookingData.roomid,
          firstname:   bookingData.firstname,
          lastname:    bookingData.lastname,
          depositpaid: bookingData.depositpaid ?? false,
          bookingdates: {
            checkin:  bookingData.checkin,
            checkout: bookingData.checkout,
          },
          email: bookingData.email,
          phone: bookingData.phone,
        },
      }
    );
    const body = await response.json();
    return body;
  }

  /**
   * Fetch all bookings for a given room via the REST API.
   * @param {number} roomId
   * @returns {Promise<Array>}
   */
  async getBookingsForRoomViaApi(roomId) {
    const response = await this.page.request.get(
      `https://automationintesting.online/api/booking?roomid=${roomId}`
    );
    const data = await response.json();
    return data.bookings ?? [];
  }

  /**
   * Fetch a single booking by id via the REST API.
   * @param {number} bookingId
   * @returns {Promise<object>}
   */
  async getBookingByIdViaApi(bookingId) {
    const response = await this.page.request.get(
      `https://automationintesting.online/api/booking/${bookingId}`
    );
    const text = await response.text();
    if (!text || text.trim() === '') return {};
    return JSON.parse(text);
  }

  // ── Edit booking ────────────────────────────────────────────────────────────

  /**
   * Click the edit (pencil) icon on a booking row, update the inline form
   * fields, and confirm.
   *
   * NOTE: The underlying API (PUT /api/booking/:id) returns 409 when the
   * submitted dates overlap with any OTHER booking for the same room. To avoid
   * this, pass `checkin` / `checkout` with non-conflicting dates.
   *
   * @param {number} bookingIndex  Zero-based index of the booking row to edit.
   * @param {{firstname?:string, lastname?:string, depositpaid?:string,
   *           checkin?:string, checkout?:string}} updates
   *           Dates should be in DD/MM/YYYY format as the datepicker expects.
   */
  async editBooking(bookingIndex, updates) {
    await this.editBookingIcon.nth(bookingIndex).click();
    await this.editFirstnameInput.waitFor({ state: 'visible' });

    if (updates.firstname !== undefined) {
      await this.editFirstnameInput.clear();
      await this.editFirstnameInput.fill(updates.firstname);
    }
    if (updates.lastname !== undefined) {
      await this.editLastnameInput.clear();
      await this.editLastnameInput.fill(updates.lastname);
    }
    if (updates.depositpaid !== undefined) {
      await this.editDepositSelect.selectOption(String(updates.depositpaid));
    }
    if (updates.checkin !== undefined) {
      await this.editCheckinInput.clear();
      await this.editCheckinInput.fill(updates.checkin);
      await this.editCheckinInput.press('Tab');
    }
    if (updates.checkout !== undefined) {
      await this.editCheckoutInput.clear();
      await this.editCheckoutInput.fill(updates.checkout);
      await this.editCheckoutInput.press('Tab');
    }

    await this.confirmEditIcon.click();
    // Wait for the inline form inputs to disappear, confirming the save completed
    await this.editFirstnameInput.waitFor({ state: 'hidden' });
  }

  /**
   * Update a booking via the REST API (PUT).
   * NOTE: The API returns 409 if the new dates overlap with any other booking
   * for the same room. Use dates that do not conflict.
   *
   * @param {number} bookingId
   * @param {{roomid:number, firstname:string, lastname:string,
   *           depositpaid:boolean, checkin:string, checkout:string,
   *           email:string, phone:string}} bookingData
   * @returns {Promise<object>} Response body (includes booking.bookingid on success)
   */
  async updateBookingViaApi(bookingId, bookingData) {
    const response = await this.page.request.put(
      `https://automationintesting.online/api/booking/${bookingId}`,
      {
        data: {
          roomid:      bookingData.roomid,
          firstname:   bookingData.firstname,
          lastname:    bookingData.lastname,
          depositpaid: bookingData.depositpaid ?? false,
          bookingdates: {
            checkin:  bookingData.checkin,
            checkout: bookingData.checkout,
          },
          email: bookingData.email,
          phone: bookingData.phone,
        },
      }
    );
    const text = await response.text();
    if (!text || text.trim() === '') return { status: response.status() };
    return JSON.parse(text);
  }

  // ── Delete booking ────────────────────────────────────────────────────────────

  /**
   * Click the delete (trash) icon on a specific booking row.
   * The UI removes the row immediately with no confirmation dialog.
   * @param {number} [bookingIndex=0]
   */
  async deleteBookingByIndex(bookingIndex = 0) {
    const countBefore = await this.bookingRows.count();
    await this.deleteBookingIcon.nth(bookingIndex).click();
    // Wait until the row count decreases
    await this.page.waitForFunction(
      (expected) => document.querySelectorAll('.detail[class*="booking-"]').length < expected,
      countBefore,
      { timeout: 10000 }
    );
  }

  /**
   * Delete a booking via the REST API.
   * @param {number} bookingId
   * @returns {Promise<number>} HTTP status (202 = deleted, 404 = not found)
   */
  async deleteBookingViaApi(bookingId) {
    const response = await this.page.request.delete(
      `https://automationintesting.online/api/booking/${bookingId}`
    );
    return response.status();
  }

  // ── Verify booking status / report ──────────────────────────────────────────

  /**
   * Navigate to the report calendar and return whether a booking event
   * containing the given text is visible this month.
   * @param {string} eventText  Partial text to match inside the event label.
   * @returns {Promise<boolean>}
   */
  async isBookingVisibleOnCalendar(eventText) {
    await this.navigateToReport();
    await this.calendar.waitFor({ state: 'visible' });
    const matchingEvent = this.calendarEvents.filter({ hasText: eventText });
    return (await matchingEvent.count()) > 0;
  }

  /**
   * Return the count of all booking events shown on the report calendar.
   * @returns {Promise<number>}
   */
  async getCalendarEventCount() {
    await this.navigateToReport();
    await this.calendar.waitFor({ state: 'visible' });
    return await this.calendarEvents.count();
  }

  /**
   * Check whether a booking row containing the given first name is present
   * in the currently-open room detail panel.
   * Returns immediately without waiting — use toBeVisible assertions for
   * time-sensitive checks.
   * @param {string} firstname
   * @returns {Promise<boolean>}
   */
  async isBookingPresentByName(firstname) {
    const rows = this.page.locator('.detail[class*="booking-"]', { hasText: firstname });
    return (await rows.count()) > 0;
  }
}
