export function waterAmountToLiter(water_amount: number) {
  return `${
    Math.round((water_amount / 1000 + Number.EPSILON) * 100) / 100
  } liter`
}
