import { test, expect } from '@playwright/test';
import { BookingPage } from '../../pages/BookingPage';

test.describe('Booking Tests', () => {
  test('should complete room booking process', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.navigate();
  });
});
