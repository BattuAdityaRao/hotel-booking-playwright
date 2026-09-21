import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages/ContactPage';

test.describe('Contact Module', () => {

  let contactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.goto();
  });


  // =========================================================
  // TC01 - Valid Contact Form
  // =========================================================

  test('TC01 - Submit contact form with valid data', async () => {

    await contactPage.submitContactForm(
        'Aditya Rao',
        'aditya.rao@gmail.com',
        '07123456789',
        'Booking Enquiry',
        'I would like to know more about room availability.'
    );

    await expect(contactPage.successMessage)
        .toBeVisible({ timeout: 10000 });
  });


  // =========================================================
  // TC02 - Empty Name
  // =========================================================

  test('TC02 - Submit form with empty name', async () => {

    await contactPage.submitContactForm(
        '',
        'aditya.rao@gmail.com',
        '07123456789',
        'Booking Enquiry',
        'Test message'
    );

    // Name should remain empty
    await expect(contactPage.nameInput).toHaveValue('');

    // Successful submission should not occur
    await expect(contactPage.successMessage).not.toBeVisible();
  });


  // =========================================================
  // TC03 - Empty Email
  // =========================================================

  test('TC03 - Submit form with empty email', async () => {

    await contactPage.fillContactForm(
        'Aditya Rao',
        '',
        '07123456789',
        'Booking Enquiry',
        'Test message'
    );

    // Verify email is empty before submission
    await expect(contactPage.emailInput).toHaveValue('');

    // Submit the form
    await contactPage.submitForm();

    // Successful submission should not occur
    await expect(contactPage.successMessage).not.toBeVisible();
  });


  // =========================================================
  // TC04 - Invalid Email
  // =========================================================

  test('TC04 - Submit form with invalid email', async () => {

    await contactPage.submitContactForm(
        'Aditya Rao',
        'invalid-email',
        '07123456789',
        'Booking Enquiry',
        'Test message'
    );

    // Invalid email should remain in the field
    await expect(contactPage.emailInput)
        .toHaveValue('invalid-email');
  });


  // =========================================================
  // TC05 - Invalid Phone
  // =========================================================

  test('TC05 - Submit form with invalid phone number', async () => {

    await contactPage.submitContactForm(
        'Aditya Rao',
        'aditya.rao@gmail.com',
        '123',
        'Booking Enquiry',
        'Test message'
    );

    // Invalid phone should remain in the field
    await expect(contactPage.phoneInput)
        .toHaveValue('123');

    // Successful submission should not occur
    await expect(contactPage.successMessage).not.toBeVisible();
  });


  // =========================================================
  // TC06 - Empty Subject
  // =========================================================

  test('TC06 - Submit form with empty subject', async () => {

    await contactPage.submitContactForm(
        'Aditya Rao',
        'aditya.rao@gmail.com',
        '07123456789',
        '',
        'Test message'
    );

    // Subject should remain empty
    await expect(contactPage.subjectInput).toHaveValue('');

    // Successful submission should not occur
    await expect(contactPage.successMessage).not.toBeVisible();
  });


  // =========================================================
  // TC07 - Empty Message
  // =========================================================

  test('TC07 - Submit form with empty message', async () => {

    await contactPage.submitContactForm(
        'Aditya Rao',
        'aditya.rao@gmail.com',
        '07123456789',
        'Booking Enquiry',
        ''
    );

    // Message should remain empty
    await expect(contactPage.messageInput).toHaveValue('');

    // Successful submission should not occur
    await expect(contactPage.successMessage).not.toBeVisible();
  });


  // =========================================================
  // TC08 - Completely Empty Form
  // =========================================================

  test('TC08 - Submit completely empty form', async () => {

    await contactPage.submitContactForm(
        '',
        '',
        '',
        '',
        ''
    );

    // Verify all fields remain empty
    await expect(contactPage.nameInput).toHaveValue('');
    await expect(contactPage.emailInput).toHaveValue('');
    await expect(contactPage.phoneInput).toHaveValue('');
    await expect(contactPage.subjectInput).toHaveValue('');
    await expect(contactPage.messageInput).toHaveValue('');

    // Successful submission should not occur
    await expect(contactPage.successMessage).not.toBeVisible();
  });


  // =========================================================
  // TC09 - Special Characters
  // =========================================================

  test('TC09 - Submit form with special characters', async () => {

    await contactPage.fillContactForm(
        '@@@ ### $$$',
        'test@example.com',
        '07123456789',
        '!@#$%^',
        '<script>alert("test")</script>'
    );

    // Verify special characters before submission
    await expect(contactPage.nameInput)
        .toHaveValue('@@@ ### $$$');

    await expect(contactPage.subjectInput)
        .toHaveValue('!@#$%^');

    await expect(contactPage.messageInput)
        .toHaveValue('<script>alert("test")</script>');

    // Submit after validating the entered values
    await contactPage.submitForm();
  });

  // =========================================================
  // TC10 - Long Message
  // =========================================================

  test('TC10 - Submit form with long message', async () => {

    const longMessage =
        'This is a test message. '.repeat(100);

    await contactPage.submitContactForm(
        'Aditya Rao',
        'aditya.rao@gmail.com',
        '07123456789',
        'Long Message Test',
        longMessage
    );

    // Verify long message is accepted in the field
    await expect(contactPage.messageInput)
        .toHaveValue(longMessage);
  });

});