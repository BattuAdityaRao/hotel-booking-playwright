import { test, expect } from '../../fixtures/testFixtures';

test.describe('Admin Room Management Tests', () => {

  test('should add a new room', async ({ adminRoomPage }) => {

    await adminRoomPage.navigate();

    await adminRoomPage.enterRoomNumber('205');
    await adminRoomPage.selectRoomType('Single');
    await adminRoomPage.selectAccessible('true');
    await adminRoomPage.enterRoomPrice('180');

    await adminRoomPage.selectWiFi();
    await adminRoomPage.selectTV();

    await adminRoomPage.clickCreateRoom();

    await expect(
        adminRoomPage.isRoomDisplayed('205')
    ).toBeVisible();
  });


  test('should delete a room', async ({ adminRoomPage }) => {

    await adminRoomPage.navigate();

    await adminRoomPage.enterRoomNumber('206');
    await adminRoomPage.selectRoomType('Single');
    await adminRoomPage.selectAccessible('true');
    await adminRoomPage.enterRoomPrice('200');

    await adminRoomPage.clickCreateRoom();

    await expect(
        adminRoomPage.isRoomDisplayed('206')
    ).toBeVisible();

    await adminRoomPage.deleteRoom('206');

    await expect(
        adminRoomPage.isRoomDisplayed('206')
    ).toHaveCount(0);
  });

  test('should add a double room', async ({ adminRoomPage }) => {

    await adminRoomPage.navigate();

    await adminRoomPage.enterRoomNumber('207');
    await adminRoomPage.selectRoomType('Double');
    await adminRoomPage.selectAccessible('true');
    await adminRoomPage.enterRoomPrice('220');

    await adminRoomPage.clickCreateRoom();

    await expect(
        adminRoomPage.isRoomDisplayed('207')
    ).toBeVisible();
  });

  test('should add a suite room', async ({ adminRoomPage }) => {

    await adminRoomPage.navigate();

    await adminRoomPage.enterRoomNumber('208');
    await adminRoomPage.selectRoomType('Suite');
    await adminRoomPage.selectAccessible('true');
    await adminRoomPage.enterRoomPrice('250');

    await adminRoomPage.clickCreateRoom();

    await expect(
        adminRoomPage.isRoomDisplayed('208')
    ).toBeVisible();
  });

  test('should add a room with multiple amenities', async ({ adminRoomPage }) => {

    await adminRoomPage.navigate();

    await adminRoomPage.enterRoomNumber('209');
    await adminRoomPage.selectRoomType('Single');
    await adminRoomPage.selectAccessible('true');
    await adminRoomPage.enterRoomPrice('300');

    await adminRoomPage.selectWiFi();
    await adminRoomPage.selectTV();
    await adminRoomPage.selectRadio();
    await adminRoomPage.selectSafe();
    await adminRoomPage.selectViews();

    await adminRoomPage.clickCreateRoom();

    await expect(
        adminRoomPage.isRoomDisplayed('209')
    ).toBeVisible();
  });

});