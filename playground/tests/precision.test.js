import { test } from "node:test";
import { strictEqual } from "node:assert";
import { convert } from "../src/convert.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const defaults = JSON.parse(
  readFileSync(join(__dirname, "../config/defaults.json"), "utf-8")
);

// Tests for precision defaults in distance and weight converters
// These tests should FAIL initially because distance/weight don't apply precision

test("distance conversion respects precision from config", () => {
  const result = convert("distance", 5, "km", "mi");
  const expected = 3.11; // 5 * 0.621371 = 3.106855, rounded to 2 decimals
  strictEqual(
    result,
    expected,
    `Expected ${expected} (precision: ${defaults.precision}), got ${result}`
  );
});

test("weight conversion respects precision from config", () => {
  const result = convert("weight", 100, "g", "oz");
  const expected = 3.53; // 100 / 28.3495 = 3.5274..., rounded to 2 decimals
  strictEqual(
    result,
    expected,
    `Expected ${expected} (precision: ${defaults.precision}), got ${result}`
  );
});

test("temperature conversion respects precision from config", () => {
  const result = convert("temperature", 37, "C", "F");
  const expected = 98.6; // 37 * 9/5 + 32 = 98.6, already at precision
  strictEqual(
    result,
    expected,
    `Expected ${expected} (precision: ${defaults.precision}), got ${result}`
  );
});

test("precision rounds correctly for rounding up", () => {
  const result = convert("distance", 10, "km", "mi");
  strictEqual(result, 6.21); // 10 * 0.621371 = 6.21371 → 6.21
});

test("precision rounds correctly for rounding down", () => {
  const result = convert("weight", 50, "g", "oz");
  strictEqual(result, 1.76); // 50 / 28.3495 = 1.7637... → 1.76
});

test("precision handles very small numbers", () => {
  const result = convert("weight", 1, "g", "oz");
  strictEqual(result, 0.04); // 1 / 28.3495 = 0.0352... → 0.04
});

test("precision handles very large numbers", () => {
  const result = convert("distance", 1000, "km", "mi");
  strictEqual(result, 621.37); // 1000 * 0.621371 = 621.371 → 621.37
});

test("handles absolute zero temperature with precision", () => {
  const result = convert("temperature", -273.15, "C", "F");
  strictEqual(result, -459.67, "Absolute zero should convert correctly with precision");
});

test("handles very precise input values", () => {
  const result = convert("distance", 1.234567, "km", "mi");
  strictEqual(result, 0.77); // Should round to config precision
});

test("temperature Kelvin conversion respects precision from config", () => {
  const result = convert("temperature", 300, "K", "C");
  strictEqual(result, 26.85); // 300 - 273.15 = 26.85
});

test("distance meters conversion respects precision from config", () => {
  const result = convert("distance", 1500, "m", "km");
  strictEqual(result, 1.5); // 1500 / 1000 = 1.5
});

test("weight pounds conversion respects precision from config", () => {
  const result = convert("weight", 2, "lb", "g");
  strictEqual(result, 907.18); // 2 * 453.592 = 907.184 → 907.18 (precision 2)
});

test("per-converter precision: temperature uses its own precision setting", () => {
  const result = convert("temperature", 25.555, "C", "F");
  strictEqual(result, 78.0); // 25.555 * 9/5 + 32 = 78.0 (precision 2 from config)
  // Verify it's using temperature precision (2 decimals) by checking rounding
  const rawValue = 25.555 * (9 / 5) + 32; // 78.0 exactly
  strictEqual(result, Number(rawValue.toFixed(2))); // Should match precision 2 rounding
});

test("per-converter precision: distance uses its own precision setting", () => {
  const result = convert("distance", 1.234, "km", "mi");
  strictEqual(result, 0.77); // 1.234 * 0.621371 = 0.7667... → 0.77 (precision 2 from config)
  // Verify it's using distance precision (2 decimals) by checking rounding
  const rawValue = 1.234 * 0.621371; // 0.7667...
  strictEqual(result, Number(rawValue.toFixed(2))); // Should match precision 2 rounding
});

test("per-converter precision: weight uses its own precision setting", () => {
  const result = convert("weight", 1.234, "lb", "g");
  strictEqual(result, 559.73); // 1.234 * 453.592 = 559.732... → 559.73 (precision 2 from config)
  // Verify it's using weight precision (2 decimals) by checking rounding
  const rawValue = 1.234 * 453.592; // 559.732...
  strictEqual(result, Number(rawValue.toFixed(2))); // Should match precision 2 rounding
});

test("per-converter precision: each converter type respects its configured precision", () => {
  // Temperature with precision 2
  const tempResult = convert("temperature", 20.555, "C", "F");
  strictEqual(tempResult, 69.0); // Rounded to 2 decimals
  
  // Distance with precision 2
  const distResult = convert("distance", 3.456, "km", "mi");
  strictEqual(distResult, 2.15); // 3.456 * 0.621371 = 2.147... → 2.15 (precision 2)
  
  // Weight with precision 2
  const weightResult = convert("weight", 0.123, "lb", "g");
  strictEqual(weightResult, 55.79); // 0.123 * 453.592 = 55.791... → 55.79 (precision 2)
});
