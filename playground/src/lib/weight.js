export function convertWeight(value, from, to) {
  if (from === "g" && to === "oz") return value / 28.3495;
  if (from === "oz" && to === "g") return value * 28.3495;
  if (from === "lb" && to === "g") return value * 453.592;
  if (from === "g" && to === "lb") return value / 453.592;
  if (from === "lb" && to === "oz") return value * 16;
  if (from === "oz" && to === "lb") return value / 16;
  throw new Error(`Unsupported weight conversion: ${from} to ${to}`);
}
