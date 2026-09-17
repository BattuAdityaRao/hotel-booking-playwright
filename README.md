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
