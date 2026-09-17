import { test, expect } from '@playwright/test';
import { AdminBookingPage } from '../../pages/AdminBookingPage';

test.describe('Admin Booking Management Tests', () => {
  test('should manage bookings in admin dashboard', async ({ page }) => {
    const adminBookingPage = new AdminBookingPage(page);
    await adminBookingPage.navigate();
  });
});
