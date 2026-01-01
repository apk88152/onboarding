#!/usr/bin/env node
import { convert, compare, getTypeFromUnit } from "../src/convert.js";

const [,, command, ...args] = process.argv;

if (!command) {
  console.error("Usage: convert <type> <value> [from] [to]");
  console.error("   or: convert compare <value1> <unit1> <value2> <unit2>");
  process.exit(1);
}

if (command === "compare") {
  // Parse: convert compare <value1> <unit1> <value2> <unit2>
  if (args.length !== 4) {
    console.error("Usage: convert compare <value1> <unit1> <value2> <unit2>");
    console.error("Example: convert compare 5 km 3 mi");
    process.exit(1);
  }

  const [value1, unit1, value2, unit2] = args;
  
  // Determine type from units
  const type1 = getTypeFromUnit(unit1);
  const type2 = getTypeFromUnit(unit2);
  
  if (!type1 || !type2) {
    console.error(`Error: Unknown unit(s). Supported units:`);
    console.error(`  Distance: km, mi, m`);
    console.error(`  Weight: g, oz, lb`);
    console.error(`  Temperature: C, F, K`);
    process.exit(1);
  }
  
  if (type1 !== type2) {
    console.error(`Error: Cannot compare ${type1} (${unit1}) with ${type2} (${unit2})`);
    process.exit(1);
  }
  
  try {
    const result = compare(type1, value1, unit1, value2, unit2);
    const commonUnit = result.unit1;
    
    // Display comparison
    console.log(`${value1} ${unit1} = ${result.value1} ${commonUnit}`);
    console.log(`${value2} ${unit2} = ${result.value2} ${commonUnit}`);
    console.log(`Difference: ${result.difference} ${commonUnit}`);
    
    if (result.larger === 1) {
      console.log(`${value1} ${unit1} is larger by ${result.difference} ${commonUnit}`);
    } else if (result.larger === 2) {
      console.log(`${value2} ${unit2} is larger by ${result.difference} ${commonUnit}`);
    } else {
      console.log(`Both values are equal`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
} else {
  // Original convert command
  const [value, from, to] = args;
  
  if (!value) {
    console.error("Usage: convert <type> <value> [from] [to]");
    process.exit(1);
  }
  
  try {
    const result = convert(command, Number(value), from, to);
    console.log(result);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
