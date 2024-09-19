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

  // TODO: Test page paths. Need to pass in the paths to AppUtils since serving from different dir.
});