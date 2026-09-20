# Anusha - Playwright Rooms Module

This is the Playwright implementation of the **Rooms** assignment from the team guide.

## Covered scenarios

- ROOM-001: Verify rooms are displayed
- ROOM-002: Verify room name
- ROOM-003: Verify room image
- ROOM-004: Verify room description
- ROOM-005: Verify room price
- ROOM-006: Verify amenities
- ROOM-007: Verify room details
- ROOM-008: Verify Book button/action
- ROOM-009: Verify navigation to booking
- ROOM-010: Verify expected room cards load

## Requirements

- Node.js 18+
- Internet access
- VS Code recommended

## Install

Open a terminal in this folder:

```bash
npm install
npx playwright install
```

## Run only Anusha's Rooms tests

```bash
npm run test:rooms
```

## Run with browser visible

```bash
npm run test:headed
```

## Open HTML report

```bash
npm run report
```

## Notes

The tests target:
https://automationintesting.online/

Room 1 is the Single Room, Room 2 is the Double Room, and the site exposes room detail/reservation pages under `/reservation/<id>`.

If the shared team framework already has a BasePage/BaseTest, move the `RoomsPage` methods into the team's existing Page Object structure rather than maintaining a second framework.
