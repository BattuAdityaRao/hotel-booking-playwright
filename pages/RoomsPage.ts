import { Locator, Page } from '@playwright/test';

export class RoomsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openHome(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');

    // Wait until room cards are loaded
    await this.page.locator('.room-card').first().waitFor();
  }

  async openRoom(roomId: number = 1): Promise<void> {
    // Use future dates so the reservation page loads its booking information
    const checkin = '2026-09-22';
    const checkout = '2026-09-23';

    await this.page.goto(
        `/reservation/${roomId}?checkin=${checkin}&checkout=${checkout}`
    );

    await this.page.waitForLoadState('domcontentloaded');
  }

  getRoomCards(): Locator {
    return this.page.locator('.room-card');
  }

  getRoomName(): Locator {
    return this.page.getByRole('heading', {
      name: 'Single Room'
    });
  }

  getRoomImage(): Locator {
    return this.page.locator('img').first();
  }

  getRoomDescription(): Locator {
    return this.page.getByText(
        'Room Description',
        { exact: true }
    );
  }

  getRoomFeatures(): Locator {
    return this.page.getByText(
        'Room Features',
        { exact: true }
    );
  }

  getPrice(): Locator {
    return this.page.locator('text=/£100.*per night/i').first();
  }

  getReserveButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Reserve Now'
    });
  }

  async clickReserve(): Promise<void> {
    await this.getReserveButton().click();
  }
}