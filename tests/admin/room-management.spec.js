import { test, expect } from '@playwright/test';
import { AdminRoomPage } from '../../pages/AdminRoomPage';

test.describe('Admin Room Management Tests', () => {
  test('should manage room listings', async ({ page }) => {
    const adminRoomPage = new AdminRoomPage(page);
    await adminRoomPage.navigate();
  });
});
