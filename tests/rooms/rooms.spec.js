import { test, expect } from '@playwright/test';
import { RoomsPage } from '../../pages/RoomsPage';

test.describe('Rooms Module', () => {

  test('ROOM-001: Verify rooms are displayed', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openHome();

    await expect(
        rooms.getRoomCards().first()
    ).toBeVisible();
  });


  test('ROOM-002: Verify room name', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openRoom(1);

    await expect(
        page.getByRole('heading', {
          name: 'Single Room'
        })
    ).toBeVisible();
  });


  test('ROOM-003: Verify room image', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openRoom(1);

    const image = rooms.getRoomImage();

    await expect(image).toBeVisible();

    await expect(image).toHaveAttribute(
        'src',
        /.+/
    );
  });


  test('ROOM-004: Verify room description', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openRoom(1);

    await expect(
        page.getByText(
            'Room Description',
            { exact: true }
        )
    ).toBeVisible();

    await expect(
        page.getByText(
            /Aenean porttitor mauris sit amet lacinia molestie/i
        )
    ).toBeVisible();
  });


  test('ROOM-005: Verify room price', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openRoom(1);

    await expect(
        rooms.getPrice()
    ).toBeVisible();
  });


  test('ROOM-006: Verify amenities', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openRoom(1);

    await expect(
        rooms.getRoomFeatures()
    ).toBeVisible();

    await expect(
        page.getByText('TV', {
          exact: true
        })
    ).toBeVisible();

    await expect(
        page.getByText('WiFi', {
          exact: true
        })
    ).toBeVisible();

    await expect(
        page.getByText('Safe', {
          exact: true
        })
    ).toBeVisible();
  });


  test('ROOM-007: Verify room details', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openRoom(1);

    await expect(
        page.getByRole('heading', {
          name: 'Single Room'
        })
    ).toBeVisible();

    await expect(
        page.getByText('Accessible', {
          exact: true
        })
    ).toBeVisible();

    await expect(
        page.getByText('Max 2 Guests', {
          exact: true
        })
    ).toBeVisible();

    await expect(
        page.getByText(
            'Room Description',
            { exact: true }
        )
    ).toBeVisible();

    await expect(
        page.getByText(
            'Room Features',
            { exact: true }
        )
    ).toBeVisible();

    await expect(
        rooms.getPrice()
    ).toBeVisible();
  });


  test('ROOM-008: Verify Book button/action', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openRoom(1);

    const reserveButton =
        rooms.getReserveButton();

    await expect(
        reserveButton
    ).toBeVisible();

    await expect(
        reserveButton
    ).toBeEnabled();
  });


  test('ROOM-009: Verify navigation to booking', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openRoom(1);

    const reserveButton =
        rooms.getReserveButton();

    await expect(
        reserveButton
    ).toBeVisible();

    await expect(
        page.getByText(
            'Book This Room',
            { exact: true }
        )
    ).toBeVisible();

    await reserveButton.click();
  });


  test('ROOM-010: Verify expected room cards load', async ({ page }) => {
    const rooms = new RoomsPage(page);

    await rooms.openHome();

    const roomCards =
        rooms.getRoomCards();

    await expect(
        roomCards.first()
    ).toBeVisible();

    const count =
        await roomCards.count();

    expect(count).toBeGreaterThan(0);
  });

});