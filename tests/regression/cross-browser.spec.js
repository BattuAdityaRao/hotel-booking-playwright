// Cross-browser regression suite
//
// Instead of duplicating every test case, this file simply imports all
// existing module spec files. Playwright executes every test.describe /
// test block that runs when the module is loaded, so each suite is
// registered here automatically.
//
// The playwright.config.js projects (chromium / firefox / webkit) then
// run this single entry-point file across all three browsers — giving
// full cross-browser coverage with zero duplication.

import '../home/home.spec.js';
import '../rooms/rooms.spec.js';
import '../contact/contact.spec.js';
import '../search/availability.spec.js';
import '../booking/booking.spec.js';
import '../admin/room-management.spec.js';
import '../admin/booking-management.spec.js';
