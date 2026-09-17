import { test, expect } from '@playwright/test';
import { RoomsPage } from '../../pages/RoomsPage';

test.describe('Rooms Page Tests', () => {
  test('should display available rooms and details', async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    await roomsPage.navigate();
  });
});
