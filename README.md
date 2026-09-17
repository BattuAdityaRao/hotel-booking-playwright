# 🏨 Hotel Booking Automation Testing

## Playwright Test Automation Framework

**Website:** https://automationintesting.online/

A collaborative UI test automation project built using **Playwright** and **JavaScript** to validate the functionality of the Automation in Testing Online hotel booking application.

The project follows the **Page Object Model (POM)** design pattern and is organized into independent modules so that team members can develop, execute, and maintain their assigned test scenarios efficiently.

---

##  Project Objective

The objective of this project is to automate and validate the major functional areas of the hotel booking application, including:

- Home Page
- Rooms
- Search / Availability
- Booking
- Contact
- Admin Login
- Admin Room Management
- Admin Booking Management
- Regression Testing
- Cross-Browser Testing

The framework is designed to support:

- Maintainable test automation
- Reusable Page Objects
- Centralized configuration
- Authentication state management
- Test data management
- Screenshot and report generation
- Cross-browser execution
- Team-based development using GitHub

---

# 👥 Team & Responsibilities

| # | Team Member | Assigned Module | Responsibility |
|---|---|---|---|
| 1 | Chandan | Booking | Complete booking flow, form validation and confirmation |
| 2 | Aditya | Contact | Contact form validation, invalid data and success/error messages |
| 3 | Aqeel | Admin Login | Login validation, session handling and logout |
| 4 | Athul Daniel | Regression + Cross-browser | Regression execution and Chrome/Edge/Firefox compatibility |
| 5 | Charita | Admin Room Management | Add, edit, delete rooms and room validation |
| 6 | Tarun | Home Page | Page loading, navigation, images, map, footer and responsiveness |
| 7 | Anusha | Rooms | Room listing, details, images, prices, amenities and booking |
| 8 | Jaswanth | Search / Availability | Date selection, availability and boundary cases |
| 9 | Aryan | QA Lead + Framework + Reporting | Framework, utilities, configuration, reporting and code review |
| 10 | Ankesh Singh | Admin Booking Management | View, create, edit, delete bookings and booking status |

---

#  Scenario Map

```text
                         HOTEL BOOKING APPLICATION
                                  │
             ┌────────────────────┴────────────────────┐
             │                                         │
        CUSTOMER FLOW                              ADMIN FLOW
             │                                         │
     ┌───────┼────────┐                    ┌───────────┼───────────┐
     │       │        │                    │                       │
    Home   Rooms   Contact              Admin Login              Admin
     │       │        │                    │                    Management
     │       │        │                    │                       │
     │       │        └───────┐            │             ┌─────────┴─────────┐
     │       │                │            │             │                   │
     │       └───────┐   Contact Form      │        Room Management   Booking Management
     │               │                     │
     └───────────────┤                     │
                     │                     │
              Search / Availability        │
                     │                     │
                     ▼                     ▼
                  Booking             Admin Operations
```

---

# 📁 Project Structure

```text
hotel-booking-automation-testing/
│
├── 📁 tests/
│   │
│   ├── 📁 setup/
│   │   └── auth.setup.js
│   │       👤 Aqeel — Admin Login
│   │
│   ├── 📁 home/
│   │   └── home.spec.js
│   │       👤 Tarun — Home Page
│   │
│   ├── 📁 rooms/
│   │   └── rooms.spec.js
│   │       👤 Anusha — Rooms
│   │
│   ├── 📁 search/
│   │   └── availability.spec.js
│   │       👤 Jaswanth — Search / Availability
│   │
│   ├── 📁 booking/
│   │   └── booking.spec.js
│   │       👤 Chandan — Booking
│   │
│   ├── 📁 contact/
│   │   └── contact.spec.js
│   │       👤 Aditya — Contact
│   │
│   ├── 📁 admin/
│   │   ├── room-management.spec.js
│   │   │   👤 Charita — Admin Room Management
│   │   │
│   │   └── booking-management.spec.js
│   │       👤 Ankesh Singh — Admin Booking Management
│   │
│   └── 📁 regression/
│       └── cross-browser.spec.js
│           👤 Athul Daniel — Regression + Cross-browser
│
├── 📁 pages/
│   ├── HomePage.js
│   │   👤 Tarun
│   ├── RoomsPage.js
│   │   👤 Anusha
│   ├── AvailabilityPage.js
│   │   👤 Jaswanth
│   ├── BookingPage.js
│   │   👤 Chandan
│   ├── ContactPage.js
│   │   👤 Aditya
│   ├── LoginPage.js
│   │   👤 Aqeel
│   ├── AdminRoomPage.js
│   │   👤 Charita
│   └── AdminBookingPage.js
│       👤 Ankesh Singh
│
├── 📁 fixtures/
│   └── testFixtures.js
│       👤 Aryan — Framework
│
├── 📁 utils/
│   ├── testData.js
│   ├── helpers.js
│   └── constants.js
│       👤 Aryan — Framework
│
├── 📁 test-data/
│   ├── booking-data.json
│   ├── contact-data.json
│   └── user-data.json
│
├── 📁 playwright/
│   └── 📁 .auth/
│       └── admin.json
│
├── 📁 reports/
├── 📁 screenshots/
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── playwright.yml
│
├── 📄 .env
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 playwright.config.js
└── 📄 README.md
```

---

# 📄 Page Object Model

The framework follows the **Page Object Model (POM)** pattern.

Each application page has a dedicated Page Object containing:

- Locators
- Page actions
- Reusable methods
- Navigation methods

### Example:

```text
tests/
    contact/
        contact.spec.js

pages/
    ContactPage.js
```

The test file contains the test scenario while the Page Object contains the interaction logic.

---

# 🌐 Cross-Browser Execution

Playwright can execute the same tests against multiple browsers.

### Supported browsers:

- Chromium
- Firefox
- WebKit

### Example:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

Cross-browser execution and compatibility reporting are maintained by:

**Athul Daniel** – Regression + Cross-browser

---

# ⚙️ Environment Configuration

The framework utilizes `dotenv` to manage environment-specific variables securely without hardcoding sensitive values into the test files.

### 1. Configuration Files

- `.env`: Stores local environment variables (credentials, endpoints). This file is git-ignored.
- `.env.example`: A template file committed to source control displaying available configuration variables.

### 2. Available Variables

```env
BASE_URL=https://automationintesting.online/
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```

### 3. Usage in Framework

Variables are initialized inside `playwright.config.js`:

```javascript
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://automationintesting.online/',
  },
  // ...
});
```

---

# 🔐 Authentication Setup

To optimize execution speed and eliminate redundant login actions for admin-dependent tests, Playwright's **Authentication State Management** is implemented.

### 1. How It Works

- **Setup Project**: A dedicated setup project runs `tests/setup/auth.setup.js` before the test suites execute.
- **Session Capture**: Admin logs in once during setup, and the session state (cookies and local storage) is saved into `playwright/.auth/admin.json`.
- **State Reuse**: Admin test suites can load the saved storage state to run directly in authenticated mode without going through the login UI flow each time.

### 2. Setup Script (`tests/setup/auth.setup.js`)

```javascript
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/#/admin');
  // Fill login credentials and submit
  await page.context().storageState({ path: authFile });
});
```

Authentication setup and session handling are maintained by:

**Aqeel** – Admin Login

---

# 🎯 Conclusion

This test automation framework provides a robust, scalable, and maintainable solution for testing the **Automation in Testing Online** hotel booking application.

### Key Highlights:

- **Modular Architecture**: Clear separation of concerns through Page Object Model (POM), dedicated test suites, and centralized utilities.
- **Efficient Test Execution**: Optimized test runs using Playwright setup dependencies and reusable authentication storage states.
- **Cross-Browser & Parallel Testing**: Comprehensive coverage across Chromium, Firefox, and WebKit engines with parallel execution capabilities.
- **Team Collaboration**: Well-defined ownership and modular structure enabling seamless multi-member contributions and maintenance.
