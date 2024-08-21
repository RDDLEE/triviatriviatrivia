import request from "supertest";
import { describe, expect, test } from "vitest";
import app from "../app";
import RouteUtils from "../lib/RouteUtils";

describe("App Routes", () => {
  test("API: HELLO_PATH.", async () => {
    const response = await request(app)
      .get(RouteUtils.HELLO_PATH);
    expect(response.status).toBe(200);
  });

  test("API: GET_ROOM_PATH.", async () => {
    const response = await request(app)
      .get(RouteUtils.API_PREFIX + "/room/123");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ wasFound: false });
  });

  test("Route: HOME_PAGE_PATH.", async () => {
    const response = await request(app)
      .get(RouteUtils.HOME_PAGE_PATH);
    // NOTE: 500 is okay in development as frontend is still seperated. No point in mocking.
    expect(response.status).toBe(500);
  });

  test("Route: ROOM_PAGE_PATH.", async () => {
    const response = await request(app)
      .get("/123");
    // NOTE: 500 is okay in development as frontend is still seperated. No point in mocking.
    expect(response.status).toBe(500);
  });
});