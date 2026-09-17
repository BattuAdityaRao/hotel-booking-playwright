export class AdminRoomPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/#/admin');
  }
}
