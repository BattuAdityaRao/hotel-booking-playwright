/*
export class BookingPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/');
  }
}
*/
export class BookingPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators
    this.firstnameInput = page.locator("input[name='firstname']");
    this.lastnameInput = page.locator("input[name='lastname']");
    this.emailInput = page.locator("input[name='email']");
    this.phoneInput = page.locator("input[name='phone']");
    this.reserveNowButton = page.locator('#doReservation');
    this.submitBookingButton = page.getByRole('button', { name: 'Reserve Now' });
    this.successHeading = page.getByRole('heading', { name: 'Booking Confirmed' });
    this.returnHomeLink = page.getByRole('link', { name: 'Return home' });
    this.errorAlerts = page.locator('.alert-danger');
    this.calendarDays = page.locator('.rbc-day-bg:not(.rbc-off-range-bg)');
  }

  async navigate() {
    await this.page.goto('https://automationintesting.online/');
  }

  async openRoomReservation(roomId = '1') {
    const bookBtn = this.page.locator(`a.btn-primary[href*='/reservation/${roomId}']`).first();
    await bookBtn.scrollIntoViewIfNeeded();
    await bookBtn.click();
  }

  async selectDateRange(startIndex = 12, endIndex = 14) {
    await this.calendarDays.first().waitFor();

    const startDay = this.calendarDays.nth(startIndex);
    const endDay = this.calendarDays.nth(endIndex);

    const startBox = await startDay.boundingBox();
    const endBox = await endDay.boundingBox();

    if (startBox && endBox) {
      await this.page.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2);
      await this.page.mouse.down();
      await this.page.waitForTimeout(200);

      await this.page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2, { steps: 10 });
      await this.page.waitForTimeout(200);

      await this.page.mouse.up();
    }
  }

  async fillAndSubmitBookingForm(details) {
    await this.reserveNowButton.scrollIntoViewIfNeeded();
    await this.reserveNowButton.click();

    await this.firstnameInput.fill(details.firstname ?? '');
    await this.lastnameInput.fill(details.lastname ?? '');
    await this.emailInput.fill(details.email ?? '');
    await this.phoneInput.fill(details.phone ?? '');

    await this.submitBookingButton.click();
  }

  async getErrorAlertText() {
    const errorList = this.errorAlerts.first().locator('li');
    let errorsText = '';
    const count = await errorList.count();
    for (let i = 0; i < count; i++) {
      errorsText += (await errorList.nth(i).textContent()) + '; ';
    }
    return errorsText;
  }
}