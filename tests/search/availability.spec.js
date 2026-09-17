import { test, expect } from '@playwright/test';
import { AvailabilityPage } from '../../pages/AvailabilityPage';

test.describe('Search and Availability Tests', () => {
  test('should check room availability based on selected dates', async ({ page }) => {
    const availabilityPage = new AvailabilityPage(page);
    await availabilityPage.navigate();
  });
});
