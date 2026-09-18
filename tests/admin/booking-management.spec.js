import { test, expect } from '../../fixtures/testFixtures';

// ─── Constants ───────────────────────────────────────────────────────────────
// Room IDs on the live site: 1=Room 101 (Single), 2=Room 102 (Double), 3=Room 103 (Suite)
const ROOM_1_ID    = 1;
const ROOM_1_NAME  = '101'; // room name used to locate its listing row

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

// ─── Test Suite ──────────────────────────────────────────────────────────────
// Run serially to avoid parallel booking-date conflicts on the shared live server.
test.describe('Admin Booking Management', () => {
  test.describe.configure({ mode: 'serial' });

  // Raise timeout to 60s per test — the live server can be slow and each test
  // includes a full login + page navigation.
  test.setTimeout(60000);

  // Perform a fresh full login before every test.
  // auth.setup.js is a skeleton (saves empty state), so we do real login here.
  // Each test gets its own fresh session to avoid token-expiry failures.
  test.beforeEach(async ({ adminBookingPage }) => {
    await adminBookingPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
  });

  // ── a. View existing bookings ──────────────────────────────────────────────
  test('a. should display room listings on admin rooms page', async ({ adminBookingPage }) => {
    // login() already lands on /admin/rooms; navigate() reconfirms the page loads
    await adminBookingPage.navigate();
    const roomCount = await adminBookingPage.getRoomCount();
    expect(roomCount).toBeGreaterThan(0);
  });

  test('a. should display bookings when a room row is expanded', async ({ adminBookingPage }) => {
    await adminBookingPage.navigate();
    await adminBookingPage.openRoomBookingsByName(ROOM_1_NAME);
    const bookingCount = await adminBookingPage.getBookingRowCount();
    expect(bookingCount).toBeGreaterThan(0);
  });

  // ── b. Verify booking details ──────────────────────────────────────────────
  test('b. should show correct booking details for the first booking in room 101', async ({ adminBookingPage }) => {
    await adminBookingPage.navigate();
    await adminBookingPage.openRoomBookingsByName(ROOM_1_NAME);
    const details = await adminBookingPage.getBookingDetails(0);
    // Seed booking for room 101: James Dean, 2026-02-01 → 2026-02-05, deposit=true
    expect(details.firstname).toBe('James');
    expect(details.lastname).toBe('Dean');
    expect(details.checkin).toBe('2026-02-01');
    expect(details.checkout).toBe('2026-02-05');
    expect(details.depositpaid).toBe('true');
  });

  test('b. should retrieve booking details via API for a known booking', async ({ adminBookingPage }) => {
    const booking = await adminBookingPage.getBookingByIdViaApi(1);
    expect(booking.bookingid).toBe(1);
    expect(booking.firstname).toBe('James');
    expect(booking.lastname).toBe('Dean');
    expect(booking.roomid).toBe(ROOM_1_ID);
    expect(booking.bookingdates.checkin).toBe('2026-02-01');
    expect(booking.bookingdates.checkout).toBe('2026-02-05');
  });

  test('b. should list bookings for room 101 via API', async ({ adminBookingPage }) => {
    const bookings = await adminBookingPage.getBookingsForRoomViaApi(ROOM_1_ID);
    expect(bookings.length).toBeGreaterThan(0);
    for (const b of bookings) {
      expect(b.roomid).toBe(ROOM_1_ID);
    }
  });

  // ── c. Create a new booking ────────────────────────────────────────────────
  test('c. should create a new booking via API and return a booking ID', async ({ adminBookingPage }) => {
    // Use a far-future fixed date to avoid collisions with other tests or seed data
    const created = await adminBookingPage.createBookingViaApi({
      roomid:      ROOM_1_ID,
      firstname:   'CreateTest',
      lastname:    'AutoUser',
      depositpaid: false,
      checkin:     '2027-06-01',
      checkout:    '2027-06-03',
      email:       'create@autotest.com',
      phone:       '01234567890',
    });

    expect(created.bookingid).toBeDefined();
    expect(typeof created.bookingid).toBe('number');
    expect(created.firstname).toBe('CreateTest');
    expect(created.lastname).toBe('AutoUser');
    expect(created.roomid).toBe(ROOM_1_ID);

    // Cleanup
    await adminBookingPage.deleteBookingViaApi(created.bookingid);
  });

  // ── d. Verify newly created booking ───────────────────────────────────────
  test('d. should verify newly created booking appears in room detail panel', async ({ adminBookingPage }) => {
    const created = await adminBookingPage.createBookingViaApi({
      roomid:      ROOM_1_ID,
      firstname:   'VerifyCreate',
      lastname:    'UIUser',
      depositpaid: false,
      checkin:     '2027-07-01',
      checkout:    '2027-07-03',
      email:       'verify@autotest.com',
      phone:       '01234567890',
    });

    try {
      await adminBookingPage.navigate();
      await adminBookingPage.openRoomBookingsByName(ROOM_1_NAME);
      const isPresent = await adminBookingPage.isBookingPresentByName('VerifyCreate');
      expect(isPresent).toBe(true);
    } finally {
      await adminBookingPage.deleteBookingViaApi(created.bookingid);
    }
  });

  test('d. should verify newly created booking is retrievable via API', async ({ adminBookingPage }) => {
    const created = await adminBookingPage.createBookingViaApi({
      roomid:      ROOM_1_ID,
      firstname:   'ApiVerify',
      lastname:    'TestUser',
      depositpaid: true,
      checkin:     '2027-08-01',
      checkout:    '2027-08-03',
      email:       'apiv@autotest.com',
      phone:       '01234567890',
    });

    try {
      const fetched = await adminBookingPage.getBookingByIdViaApi(created.bookingid);
      expect(fetched.bookingid).toBe(created.bookingid);
      expect(fetched.firstname).toBe('ApiVerify');
      expect(fetched.depositpaid).toBe(true);
      expect(fetched.bookingdates.checkin).toBe('2027-08-01');
      expect(fetched.bookingdates.checkout).toBe('2027-08-03');
    } finally {
      await adminBookingPage.deleteBookingViaApi(created.bookingid);
    }
  });

  // ── e. Edit an existing booking (via UI inline form) ─────────────────────
  test('e. should edit a booking firstname and lastname via the inline UI form', async ({ adminBookingPage }) => {
    const created = await adminBookingPage.createBookingViaApi({
      roomid:      ROOM_1_ID,
      firstname:   'EditBefore',
      lastname:    'OriginalLast',
      depositpaid: false,
      checkin:     '2027-09-01',
      checkout:    '2027-09-03',
      email:       'edit@autotest.com',
      phone:       '01234567890',
    });

    try {
      await adminBookingPage.navigate();
      await adminBookingPage.openRoomBookingsByName(ROOM_1_NAME);

      // Find the booking row we just created
      const rowCount = await adminBookingPage.getBookingRowCount();
      let targetIndex = -1;
      for (let i = 0; i < rowCount; i++) {
        const details = await adminBookingPage.getBookingDetails(i);
        if (details.firstname === 'EditBefore') {
          targetIndex = i;
          break;
        }
      }
      expect(targetIndex).toBeGreaterThanOrEqual(0);

      await adminBookingPage.editBooking(targetIndex, {
        firstname: 'EditAfter',
        lastname:  'UpdatedLast',
        // Move dates forward to avoid 409 conflict (API rejects same-range updates)
        checkin:   '15/09/2027',
        checkout:  '17/09/2027',
      });

      // Use poll-based assertions so Playwright retries until React finishes re-rendering
      await expect.poll(() => adminBookingPage.isBookingPresentByName('EditAfter')).toBe(true);
      await expect.poll(() => adminBookingPage.isBookingPresentByName('EditBefore')).toBe(false);
    } finally {
      await adminBookingPage.deleteBookingViaApi(created.bookingid);
    }
  });

  // ── f. Verify updated booking ──────────────────────────────────────────────
  test('f. should verify updated booking details reflect correctly after API update', async ({ adminBookingPage }) => {
    const created = await adminBookingPage.createBookingViaApi({
      roomid:      ROOM_1_ID,
      firstname:   'BeforeUpdate',
      lastname:    'OldLast',
      depositpaid: false,
      checkin:     '2027-10-01',
      checkout:    '2027-10-03',
      email:       'before@autotest.com',
      phone:       '01234567890',
    });

    try {
      // PUT requires non-overlapping dates — use a different range
      const updated = await adminBookingPage.updateBookingViaApi(created.bookingid, {
        roomid:      ROOM_1_ID,
        firstname:   'AfterUpdate',
        lastname:    'NewLast',
        depositpaid: true,
        checkin:     '2027-10-10',
        checkout:    '2027-10-12',
        email:       'after@autotest.com',
        phone:       '01234567891',
      });

      expect(updated.booking.firstname).toBe('AfterUpdate');
      expect(updated.booking.lastname).toBe('NewLast');
      expect(updated.booking.depositpaid).toBe(true);
      expect(updated.booking.bookingdates.checkin).toBe('2027-10-10');
      expect(updated.booking.bookingdates.checkout).toBe('2027-10-12');

      // Confirm via fresh GET
      const fetched = await adminBookingPage.getBookingByIdViaApi(created.bookingid);
      expect(fetched.firstname).toBe('AfterUpdate');
      expect(fetched.depositpaid).toBe(true);
    } finally {
      await adminBookingPage.deleteBookingViaApi(created.bookingid);
    }
  });

  // ── g. Delete a booking (via UI) ──────────────────────────────────────────
  test('g. should delete a booking via the trash icon in the room detail panel', async ({ adminBookingPage }) => {
    const created = await adminBookingPage.createBookingViaApi({
      roomid:      ROOM_1_ID,
      firstname:   'DeleteViaUI',
      lastname:    'TestUser',
      depositpaid: false,
      checkin:     '2027-11-01',
      checkout:    '2027-11-03',
      email:       'delui@autotest.com',
      phone:       '01234567890',
    });

    await adminBookingPage.navigate();
    await adminBookingPage.openRoomBookingsByName(ROOM_1_NAME);

    const rowCount = await adminBookingPage.getBookingRowCount();
    let targetIndex = -1;
    for (let i = 0; i < rowCount; i++) {
      const details = await adminBookingPage.getBookingDetails(i);
      if (details.firstname === 'DeleteViaUI') {
        targetIndex = i;
        break;
      }
    }
    expect(targetIndex).toBeGreaterThanOrEqual(0);

    await adminBookingPage.deleteBookingByIndex(targetIndex);
    expect(await adminBookingPage.isBookingPresentByName('DeleteViaUI')).toBe(false);
  });

  // ── h. Verify deleted booking ─────────────────────────────────────────────
  test('h. should verify deleted booking returns 404 from the API', async ({ adminBookingPage }) => {
    const created = await adminBookingPage.createBookingViaApi({
      roomid:      ROOM_1_ID,
      firstname:   'DeleteApiTest',
      lastname:    'ToBeGone',
      depositpaid: false,
      checkin:     '2027-12-01',
      checkout:    '2027-12-03',
      email:       'delapi@autotest.com',
      phone:       '01234567890',
    });

    const deleteStatus = await adminBookingPage.deleteBookingViaApi(created.bookingid);
    expect(deleteStatus).toBe(202);

    const response = await adminBookingPage.page.request.get(
      `https://automationintesting.online/api/booking/${created.bookingid}`
    );
    expect(response.status()).toBe(404);
  });

  test('h. should verify deleted booking no longer appears in room detail panel', async ({ adminBookingPage }) => {
    const created = await adminBookingPage.createBookingViaApi({
      roomid:      ROOM_1_ID,
      firstname:   'DeleteUIVerify',
      lastname:    'UIGone',
      depositpaid: false,
      checkin:     '2028-01-01',
      checkout:    '2028-01-03',
      email:       'deluiv@autotest.com',
      phone:       '01234567890',
    });

    await adminBookingPage.navigate();
    await adminBookingPage.openRoomBookingsByName(ROOM_1_NAME);
    expect(await adminBookingPage.isBookingPresentByName('DeleteUIVerify')).toBe(true);

    await adminBookingPage.deleteBookingViaApi(created.bookingid);
    await adminBookingPage.navigate();
    await adminBookingPage.openRoomBookingsByName(ROOM_1_NAME);
    expect(await adminBookingPage.isBookingPresentByName('DeleteUIVerify')).toBe(false);
  });

  // ── i. Verify booking status ───────────────────────────────────────────────
  test('i. should display the report calendar page and calendar widget', async ({ adminBookingPage }) => {
    // Navigate to report page and verify the calendar widget renders
    await adminBookingPage.navigateToReport();
    const isCalendarVisible = await adminBookingPage.calendar.isVisible();
    expect(isCalendarVisible).toBe(true);
    // The calendar toolbar must be present (Today / Back / Next buttons)
    const todayBtn = adminBookingPage.page.locator('.rbc-toolbar button', { hasText: 'Today' });
    await expect(todayBtn).toBeVisible();
  });

  test('i. should show the correct depositpaid status for known seed bookings', async ({ adminBookingPage }) => {
    const booking1 = await adminBookingPage.getBookingByIdViaApi(1);
    expect(booking1.depositpaid).toBe(true);  // James Dean

    const booking2 = await adminBookingPage.getBookingByIdViaApi(2);
    expect(booking2.depositpaid).toBe(false); // Erica Bowthorpe
  });

  test('i. should reflect depositpaid status update after API update', async ({ adminBookingPage }) => {
    const created = await adminBookingPage.createBookingViaApi({
      roomid:      ROOM_1_ID,
      firstname:   'StatusTest',
      lastname:    'DepositUser',
      depositpaid: false,
      checkin:     '2028-02-01',
      checkout:    '2028-02-03',
      email:       'status@autotest.com',
      phone:       '01234567890',
    });

    try {
      expect(created.depositpaid).toBe(false);

      await adminBookingPage.updateBookingViaApi(created.bookingid, {
        roomid:      ROOM_1_ID,
        firstname:   'StatusTest',
        lastname:    'DepositUser',
        depositpaid: true,
        checkin:     '2028-02-10',
        checkout:    '2028-02-12',
        email:       'status@autotest.com',
        phone:       '01234567890',
      });

      const fetched = await adminBookingPage.getBookingByIdViaApi(created.bookingid);
      expect(fetched.depositpaid).toBe(true);
    } finally {
      await adminBookingPage.deleteBookingViaApi(created.bookingid);
    }
  });

  // ── j. Validate required / invalid booking data ────────────────────────────
  test('j. should reject a booking creation with an empty firstname', async ({ adminBookingPage }) => {
    const response = await adminBookingPage.page.request.post(
      'https://automationintesting.online/api/booking',
      {
        data: {
          roomid:       ROOM_1_ID,
          firstname:    '',
          lastname:     'NoFirst',
          depositpaid:  false,
          bookingdates: { checkin: '2028-03-01', checkout: '2028-03-03' },
          email:        'inv@test.com',
          phone:        '01234567890',
        },
      }
    );
    expect([400, 500]).toContain(response.status());
  });

  test('j. should reject a booking with checkout before checkin', async ({ adminBookingPage }) => {
    const response = await adminBookingPage.page.request.post(
      'https://automationintesting.online/api/booking',
      {
        data: {
          roomid:       ROOM_1_ID,
          firstname:    'BadDates',
          lastname:     'User',
          depositpaid:  false,
          bookingdates: { checkin: '2028-04-10', checkout: '2028-04-05' },
          email:        'bad@test.com',
          phone:        '01234567890',
        },
      }
    );
    expect([400, 409, 500]).toContain(response.status());
  });

  test('j. should reject a booking with dates that overlap an existing booking', async ({ adminBookingPage }) => {
    // James Dean occupies room 101 from 2026-02-01 to 2026-02-05
    const response = await adminBookingPage.page.request.post(
      'https://automationintesting.online/api/booking',
      {
        data: {
          roomid:       ROOM_1_ID,
          firstname:    'Overlap',
          lastname:     'User',
          depositpaid:  false,
          bookingdates: { checkin: '2026-02-02', checkout: '2026-02-04' },
          email:        'ov@test.com',
          phone:        '01234567890',
        },
      }
    );
    expect(response.status()).toBe(409);
  });
});
