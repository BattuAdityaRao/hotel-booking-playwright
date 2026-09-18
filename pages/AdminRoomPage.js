export class AdminRoomPage {
  constructor(page) {
    this.page = page;

    this.roomNameInput = page.locator('#roomName');
    this.roomTypeSelect = page.locator('#type');
    this.accessibleSelect = page.locator('#accessible');
    this.roomPriceInput = page.locator('#roomPrice');

    this.wifiCheckbox = page.locator('#wifiCheckbox');
    this.tvCheckbox = page.locator('#tvCheckbox');
    this.radioCheckbox = page.locator('#radioCheckbox');
    this.refreshmentsCheckbox = page.locator('#refreshCheckbox');
    this.safeCheckbox = page.locator('#safeCheckbox');
    this.viewsCheckbox = page.locator('#viewsCheckbox');

    this.createButton = page.locator('#createRoom');

    this.deleteButtons = page.locator('button:has-text("×")');
  }

  async navigate() {
    await this.page.goto('/admin/rooms');
  }

  async enterRoomNumber(roomNumber) {
    await this.roomNameInput.fill(roomNumber);
  }

  async selectRoomType(roomType) {
    await this.roomTypeSelect.selectOption(roomType);
  }

  async selectAccessible(value) {
    await this.accessibleSelect.selectOption(value);
  }

  async enterRoomPrice(price) {
    await this.roomPriceInput.fill(price);
  }

  async selectWiFi() {
    await this.wifiCheckbox.check();
  }

  async selectTV() {
    await this.tvCheckbox.check();
  }

  async selectRadio() {
    await this.radioCheckbox.check();
  }

  async selectRefreshments() {
    await this.refreshmentsCheckbox.check();
  }

  async selectSafe() {
    await this.safeCheckbox.check();
  }

  async selectViews() {
    await this.viewsCheckbox.check();
  }

  async clickCreateRoom() {
    await this.createButton.click();
  }

  isRoomDisplayed(roomNumber) {
    return this.page.locator(`#roomName${roomNumber}`).last();
  }

  async deleteRoom(roomNumber) {
    const room = this.page.locator(`#roomName${roomNumber}`).last();

    const roomRow = room.locator(
        'xpath=ancestor::div[contains(@class, "row")][1]'
    );

    await roomRow.locator('.roomDelete').click();
  }
}