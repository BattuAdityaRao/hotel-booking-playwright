export class RoomsPage {
  constructor(page) {
    this.page = page;
  }

  async openHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');

    // Wait until room cards are loaded
    await this.page.locator('.room-card').first().waitFor();
  }

  async openRoom(roomId = 1) {
    // Use future dates so the reservation page loads its booking information
    const checkin = '2026-09-22';
    const checkout = '2026-09-23';

    await this.page.goto(
        `/reservation/${roomId}?checkin=${checkin}&checkout=${checkout}`
    );

    await this.page.waitForLoadState('domcontentloaded');
  }

  getRoomCards() {
    return this.page.locator('.room-card');
  }

  getRoomName() {
    return this.page.getByRole('heading', {
      name: 'Single Room'
    });
  }

  getRoomImage() {
    return this.page.locator('img').first();
  }

  getRoomDescription() {
    return this.page.getByText(
        'Room Description',
        { exact: true }
    );
  }

  getRoomFeatures() {
    return this.page.getByText(
        'Room Features',
        { exact: true }
    );
  }

  getPrice() {
    return this.page.locator('text=/£100.*per night/i').first();
  }

  getReserveButton() {
    return this.page.getByRole('button', {
      name: 'Reserve Now'
    });
  }

  async clickReserve() {
    await this.getReserveButton().click();
  }
}