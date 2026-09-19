import { test, expect } from '@playwright/test';
import { AvailabilityPage } from '../../pages/AvailabilityPage.js';

/**
 * Search / Availability tests — assigned to Jaswanth
 *
 * Covers:
 *  AVAIL-001  Valid date selection — rooms returned with correct dates in links
 *  AVAIL-002  Multi-night stay — rooms returned across multiple nights
 *  AVAIL-003  Dates wired through — Book now href carries exact selected dates
 *  AVAIL-004  All 3 rooms displayed — site always shows all available rooms
 *  AVAIL-005  Check-in date visible in field after selection
 *  AVAIL-006  Check-out date visible in field after selection
 *  AVAIL-007  Boundary: end-of-month → start-of-next-month
 *  AVAIL-008  Boundary: far-future dates (2028) — site accepts and returns rooms
 *  AVAIL-009  Same check-in / check-out date — site accepts it and links carry the date
 *  AVAIL-010  Reversed dates (checkout before checkin) — site still returns rooms
 *             with the values as entered (no client-side block)
 *
 * NOTE: automationintesting.online does NOT validate dates client-side.
 * It always returns all 3 room cards regardless of date range.
 * Date validation is enforced on the /reservation page (out of scope here).
 * Tests therefore assert what the availability widget *actually does* rather
 * than what would be desirable in a production system.
 */

test.describe('Search / Availability', () => {

  // Each test gets a fresh page with the availability page already loaded.
  let availabilityPage;

  test.beforeEach(async ({ page }) => {
    availabilityPage = new AvailabilityPage(page);
    await availabilityPage.goto();
  });

  // ── AVAIL-001 ─────────────────────────────────────────────────────────────
  test('AVAIL-001: valid date selection shows room cards', async () => {
    await availabilityPage.searchAvailability('10/09/2026', '12/09/2026');

    const roomCount = await availabilityPage.getRoomCount();
    expect(roomCount).toBeGreaterThan(0);
    expect(await availabilityPage.hasBookNowLinks()).toBe(true);
  });

  // ── AVAIL-002 ─────────────────────────────────────────────────────────────
  test('AVAIL-002: multi-night stay (5 nights) returns room listings', async () => {
    await availabilityPage.searchAvailability('05/11/2026', '10/11/2026');

    expect(await availabilityPage.getRoomCount()).toBeGreaterThan(0);
    expect(await availabilityPage.hasBookNowLinks()).toBe(true);
  });

  // ── AVAIL-003 ─────────────────────────────────────────────────────────────
  test('AVAIL-003: Book now links carry the exact selected dates', async () => {
    const checkIn  = '20/10/2026';
    const checkOut = '25/10/2026';

    await availabilityPage.searchAvailability(checkIn, checkOut);

    expect(await availabilityPage.bookNowLinksCarryDates(checkIn, checkOut)).toBe(true);
  });

  // ── AVAIL-004 ─────────────────────────────────────────────────────────────
  test('AVAIL-004: all 3 room types are displayed after a search', async () => {
    await availabilityPage.searchAvailability('15/11/2026', '18/11/2026');

    expect(await availabilityPage.getRoomCount()).toBe(3);
  });

  // ── AVAIL-005 ─────────────────────────────────────────────────────────────
  test('AVAIL-005: check-in date is reflected in the input field', async () => {
    await availabilityPage.selectCheckIn('22/10/2026');

    expect(await availabilityPage.getCheckInValue()).toBe('22/10/2026');
  });

  // ── AVAIL-006 ─────────────────────────────────────────────────────────────
  test('AVAIL-006: check-out date is reflected in the input field', async () => {
    await availabilityPage.selectCheckOut('26/10/2026');

    expect(await availabilityPage.getCheckOutValue()).toBe('26/10/2026');
  });

  // ── AVAIL-007 ─────────────────────────────────────────────────────────────
  test('AVAIL-007: boundary — end-of-month to start-of-next-month', async () => {
    // 30 Nov → 1 Dec crosses a month boundary
    await availabilityPage.searchAvailability('30/11/2026', '01/12/2026');

    expect(await availabilityPage.bookNowLinksCarryDates('30/11/2026', '01/12/2026')).toBe(true);
  });

  // ── AVAIL-008 ─────────────────────────────────────────────────────────────
  test('AVAIL-008: boundary — far-future dates (2028) are accepted', async () => {
    await availabilityPage.searchAvailability('01/01/2028', '05/01/2028');

    expect(await availabilityPage.getRoomCount()).toBeGreaterThan(0);
    expect(await availabilityPage.bookNowLinksCarryDates('01/01/2028', '05/01/2028')).toBe(true);
  });

  // ── AVAIL-009 ─────────────────────────────────────────────────────────────
  test('AVAIL-009: same check-in and check-out date — site accepts and links reflect dates', async () => {
    // The site does NOT block same-day ranges on the search widget.
    // Validation is deferred to the reservation page.
    await availabilityPage.searchAvailability('15/09/2026', '15/09/2026');

    expect(await availabilityPage.getRoomCount()).toBeGreaterThan(0);
    expect(await availabilityPage.bookNowLinksCarryDates('15/09/2026', '15/09/2026')).toBe(true);
  });

  // ── AVAIL-010 ─────────────────────────────────────────────────────────────
  test('AVAIL-010: reversed dates (checkout before checkin) — site passes them through to links', async () => {
    // The availability widget has no client-side date-order guard.
    // The reversed range is forwarded as-entered; validation is on /reservation.
    await availabilityPage.searchAvailability('28/11/2026', '25/11/2026');

    // Rooms are still displayed (site does not hide them)
    expect(await availabilityPage.getRoomCount()).toBeGreaterThan(0);
    // Links carry both date values exactly as entered
    expect(await availabilityPage.bookNowLinksCarryDates('28/11/2026', '25/11/2026')).toBe(true);
  });

});
