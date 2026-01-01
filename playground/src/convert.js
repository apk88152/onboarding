import * as temperature from "./lib/temperature.js";
import * as distance from "./lib/distance.js";
import * as weight from "./lib/weight.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const defaults = JSON.parse(
  readFileSync(join(__dirname, "../config/defaults.json"), "utf-8")
);

export function convert(type, value, from, to) {
  // Validate input value
  const numValue = Number(value);
  if (isNaN(numValue)) {
    throw new Error("Invalid number provided");
  }

  let result;
  switch (type) {
    case "temperature":
      result = temperature.convertTemperature(
        numValue,
        from || defaults.temperature.defaultFrom,
        to || defaults.temperature.defaultTo
      );
      break;
    case "distance":
      result = distance.convertDistance(numValue, from, to);
      break;
    case "weight":
      result = weight.convertWeight(numValue, from, to);
      break;
    default:
      throw new Error("Unknown type " + type);
  }

  // Apply precision rounding from config
  // Support per-converter precision (object) or global precision (number)
  const precision = typeof defaults.precision === 'object' && defaults.precision !== null
    ? (defaults.precision[type] ?? 2)
    : (defaults.precision ?? 2);
  return Number(result.toFixed(precision));
}

// Helper function to determine conversion type from unit codes
export function getTypeFromUnit(unit) {
  const distanceUnits = ["km", "mi", "m"];
  const weightUnits = ["g", "oz", "lb"];
  const temperatureUnits = ["C", "F", "K"];
  
  if (distanceUnits.includes(unit)) return "distance";
  if (weightUnits.includes(unit)) return "weight";
  if (temperatureUnits.includes(unit)) return "temperature";
  return null;
}

// Helper function to find a common unit for comparison
// Returns the first unit if both are the same type, otherwise null
export function getCommonUnit(type) {
  switch (type) {
    case "distance":
      return "m"; // Use meters as common unit
    case "weight":
      return "g"; // Use grams as common unit
    case "temperature":
      return "C"; // Use Celsius as common unit
    default:
      return null;
  }
}

// Compare two values with different units
export function compare(type, value1, unit1, value2, unit2) {
  // Validate both values
  const numValue1 = Number(value1);
  const numValue2 = Number(value2);
  if (isNaN(numValue1) || isNaN(numValue2)) {
    throw new Error("Invalid number provided");
  }

  // Get common unit for comparison
  const commonUnit = getCommonUnit(type);
  if (!commonUnit) {
    throw new Error(`Unknown type: ${type}`);
  }

  // Convert both values to common unit (skip conversion if already in common unit)
  const converted1 = unit1 === commonUnit ? numValue1 : convert(type, numValue1, unit1, commonUnit);
  const converted2 = unit2 === commonUnit ? numValue2 : convert(type, numValue2, unit2, commonUnit);

  // Apply precision rounding to difference
  const precision = typeof defaults.precision === 'object' && defaults.precision !== null
    ? (defaults.precision[type] ?? 2)
    : (defaults.precision ?? 2);
  const difference = Math.abs(converted1 - converted2);
  const roundedDifference = Number(difference.toFixed(precision));

  return {
    value1: converted1,
    value2: converted2,
    unit1: commonUnit,
    unit2: commonUnit,
    difference: roundedDifference,
    larger: converted1 > converted2 ? 1 : converted2 > converted1 ? 2 : 0
  };
}
