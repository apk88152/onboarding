import { test } from "node:test";
import { strictEqual } from "node:assert";
import { convertDistance } from "../src/lib/distance.js";

test("converts meters to kilometers", () => {
  strictEqual(convertDistance(1000, "m", "km"), 1);
  strictEqual(convertDistance(5000, "m", "km"), 5);
});

test("converts kilometers to meters", () => {
  strictEqual(convertDistance(1, "km", "m"), 1000);
  strictEqual(convertDistance(5, "km", "m"), 5000);
});

test("converts meters to miles", () => {
  strictEqual(convertDistance(1609.344, "m", "mi"), 1);
});

test("converts miles to meters", () => {
  strictEqual(convertDistance(1, "mi", "m"), 1609.344);
});

test("converts kilometers to miles", () => {
  strictEqual(convertDistance(5, "km", "mi"), 5 * 0.621371);
});

test("converts miles to kilometers", () => {
  strictEqual(convertDistance(5, "mi", "km"), 5 / 0.621371);
});
