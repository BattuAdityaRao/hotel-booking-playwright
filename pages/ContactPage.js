export class ContactPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/#contact');
  }
}
