export class RoomsPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/#rooms');
  }
}
