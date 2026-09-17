export class AdminBookingPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/#/admin');
  }
}
