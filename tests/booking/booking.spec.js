/*
import { test, expect } from '@playwright/test';
import { BookingPage } from '../../pages/BookingPage';

test.describe('Booking Tests', () => {
  test('should complete room booking process', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.navigate();
  });
});
*/
import { test, expect } from '@playwright/test';
import { BookingPage } from '../../pages/BookingPage';

test.describe.serial('singleRoomBooking', () => {
  let bookingPage;

  const validCustomer = {
    firstname: 'Firstname',
    lastname: 'Lastname',
    email: 'valid@email.com',
    phone: '012345678901',
  };

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    await bookingPage.navigate();
  });
  
  test('validTest', async ({ page }) => {
    // Optional: Log any failed network requests to diagnose the crash
    page.on('response', response => {
      if (response.url().includes('/booking') && response.status() >= 400) {
        console.error(`Booking API failed with status ${response.status()}`);
      }
    });

    await bookingPage.openRoomReservation('1');
    await bookingPage.selectDateRange(22, 24);
    await bookingPage.fillAndSubmitBookingForm(validCustomer);

    await expect(bookingPage.successHeading).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Your booking has been confirmed')).toBeVisible();
    await bookingPage.returnHomeLink.click();
  });

  // Parameterized validation test cases
  const validationTestCases = [
    {
      name: 'missingFirstNameTest',
      updates: { firstname: '' },
      expectedErrors: ['Firstname should not be blank', 'size must be between 3 and 18'],
    },
    {
      name: 'missingLastNameTest',
      updates: { lastname: '' },
      expectedErrors: ['Lastname should not be blank', 'size must be between 3 and 30'],
    },
    {
      name: 'missingEmailTest',
      updates: { email: '' },
      expectedErrors: ['must not be empty'],
    },
    {
      name: 'invalidEmailTest',
      updates: { email: 'invalidemail.com' },
      expectedErrors: ['must be a well-formed email address'],
    },
    {
      name: 'missingPhoneTest',
      updates: { phone: '' },
      expectedErrors: ['must not be empty'],
    },
    {
      name: 'invalidPhoneTest',
      updates: { phone: '12345' },
      expectedErrors: ['size must be between 11 and 21'],
    },
  ];

  validationTestCases.forEach(({ name, updates, expectedErrors }) => {
    test(name, async ({ page }) => {
      await bookingPage.openRoomReservation('1');
      await bookingPage.selectDateRange(22, 24);

      await Promise.all([
        page.waitForResponse(res => res.url().includes('/booking')),
        bookingPage.fillAndSubmitBookingForm({ ...validCustomer, ...updates })
      ]);

      for (const errorText of expectedErrors) {
        await expect(bookingPage.errorAlerts).toContainText(errorText);
      }
    });
  });
});

test.describe.serial('doubleRoomBooking', () => {
  let bookingPage;

  const validCustomer = {
    firstname: 'Firstname',
    lastname: 'Lastname',
    email: 'valid@email.com',
    phone: '012345678901',
  };

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    await bookingPage.navigate();
  });
  
  test('validTest', async ({ page }) => {
    // Optional: Log any failed network requests to diagnose the crash
    page.on('response', response => {
      if (response.url().includes('/booking') && response.status() >= 400) {
        console.error(`Booking API failed with status ${response.status()}`);
      }
    });

    await bookingPage.openRoomReservation('2');
    await bookingPage.selectDateRange(22, 24);
    await bookingPage.fillAndSubmitBookingForm(validCustomer);

    await expect(bookingPage.successHeading).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Your booking has been confirmed')).toBeVisible();
    await bookingPage.returnHomeLink.click();
  });

  // Parameterized validation test cases
  const validationTestCases = [
    {
      name: 'missingFirstNameTest',
      updates: { firstname: '' },
      expectedErrors: ['Firstname should not be blank', 'size must be between 3 and 18'],
    },
    {
      name: 'missingLastNameTest',
      updates: { lastname: '' },
      expectedErrors: ['Lastname should not be blank', 'size must be between 3 and 30'],
    },
    {
      name: 'missingEmailTest',
      updates: { email: '' },
      expectedErrors: ['must not be empty'],
    },
    {
      name: 'invalidEmailTest',
      updates: { email: 'invalidemail.com' },
      expectedErrors: ['must be a well-formed email address'],
    },
    {
      name: 'missingPhoneTest',
      updates: { phone: '' },
      expectedErrors: ['must not be empty'],
    },
    {
      name: 'invalidPhoneTest',
      updates: { phone: '12345' },
      expectedErrors: ['size must be between 11 and 21'],
    },
  ];

  validationTestCases.forEach(({ name, updates, expectedErrors }) => {
    test(name, async ({ page }) => {
      await bookingPage.openRoomReservation('2');
      await bookingPage.selectDateRange(22, 24);

      await Promise.all([
        page.waitForResponse(res => res.url().includes('/booking')),
        bookingPage.fillAndSubmitBookingForm({ ...validCustomer, ...updates })
      ]);

      for (const errorText of expectedErrors) {
        await expect(bookingPage.errorAlerts).toContainText(errorText);
      }
    });
  });
});

test.describe.serial('suiteBooking', () => {
  let bookingPage;

  const validCustomer = {
    firstname: 'Firstname',
    lastname: 'Lastname',
    email: 'valid@email.com',
    phone: '012345678901',
  };

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    await bookingPage.navigate();
  });
  
  test('validTest', async ({ page }) => {
    // Optional: Log any failed network requests to diagnose the crash
    page.on('response', response => {
      if (response.url().includes('/booking') && response.status() >= 400) {
        console.error(`Booking API failed with status ${response.status()}`);
      }
    });

    await bookingPage.openRoomReservation('3');
    await bookingPage.selectDateRange(22, 24);
    await bookingPage.fillAndSubmitBookingForm(validCustomer);

    await expect(bookingPage.successHeading).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Your booking has been confirmed')).toBeVisible();
    await bookingPage.returnHomeLink.click();
  });

  // Parameterized validation test cases
  const validationTestCases = [
    {
      name: 'missingFirstNameTest',
      updates: { firstname: '' },
      expectedErrors: ['Firstname should not be blank', 'size must be between 3 and 18'],
    },
    {
      name: 'missingLastNameTest',
      updates: { lastname: '' },
      expectedErrors: ['Lastname should not be blank', 'size must be between 3 and 30'],
    },
    {
      name: 'missingEmailTest',
      updates: { email: '' },
      expectedErrors: ['must not be empty'],
    },
    {
      name: 'invalidEmailTest',
      updates: { email: 'invalidemail.com' },
      expectedErrors: ['must be a well-formed email address'],
    },
    {
      name: 'missingPhoneTest',
      updates: { phone: '' },
      expectedErrors: ['must not be empty'],
    },
    {
      name: 'invalidPhoneTest',
      updates: { phone: '12345' },
      expectedErrors: ['size must be between 11 and 21'],
    },
  ];

  validationTestCases.forEach(({ name, updates, expectedErrors }) => {
    test(name, async ({ page }) => {
      await bookingPage.openRoomReservation('3');
      await bookingPage.selectDateRange(22, 24);

      await Promise.all([
        page.waitForResponse(res => res.url().includes('/booking')),
        bookingPage.fillAndSubmitBookingForm({ ...validCustomer, ...updates })
      ]);

      for (const errorText of expectedErrors) {
        await expect(bookingPage.errorAlerts).toContainText(errorText);
      }
    });
  });
});