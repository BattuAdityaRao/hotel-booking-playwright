import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages/ContactPage';

test.describe('Contact Form Tests', () => {
  test('should submit contact message successfully', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.navigate();
  });
});
