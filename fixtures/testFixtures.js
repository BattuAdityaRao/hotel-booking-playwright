import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RoomsPage } from '../pages/RoomsPage';
import { AvailabilityPage } from '../pages/AvailabilityPage';
import { BookingPage } from '../pages/BookingPage';
import { ContactPage } from '../pages/ContactPage';
import { LoginPage } from '../pages/LoginPage';
import { AdminRoomPage } from '../pages/AdminRoomPage';
import { AdminBookingPage } from '../pages/AdminBookingPage';

export const test = base.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  roomsPage: async ({ page }, use) => {
    await use(new RoomsPage(page));
  },
  availabilityPage: async ({ page }, use) => {
    await use(new AvailabilityPage(page));
  },
  bookingPage: async ({ page }, use) => {
    await use(new BookingPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  adminRoomPage: async ({ page }, use) => {
    await use(new AdminRoomPage(page));
  },
  adminBookingPage: async ({ page }, use) => {
    await use(new AdminBookingPage(page));
  },
});

export { expect } from '@playwright/test';
