const taxInfo = [
  [36_000, 3, 0],
  [144_000, 10, 2520],
  [300_000, 20, 16_920],
  [420_000, 25, 31_920],
  [660_000, 30, 52_920],
  [960_000, 35, 85_920],
  [Infinity, 45, 181_920],
];

const startPoint = 5000;

export function taxesWholeYear({
  income,
  exempt,
  publicReserveFund,
  medicalInsurance,
  endowmentInsurance,
}) {
  const insuranceRate =
    (100 - publicReserveFund - medicalInsurance - endowmentInsurance) / 100;
  const pendingTaxRevenue = Math.max(
    0,
    income * insuranceRate - exempt - startPoint,
  );

  const taxableIncome = pendingTaxRevenue * 12;

  const theLevelIndex = taxInfo
    .map((i) => i[0])
    .findIndex((level) => level > taxableIncome);

  const [_, taxRate, discount] = taxInfo[theLevelIndex];

  const tax = Math.max((taxableIncome * taxRate) / 100 - discount, 0);

  const incomeAfterTax = income * 12 * insuranceRate - tax;

  return {
    tax,
    taxableIncome,
    pendingTaxRevenue,
    incomeAfterTax,
  };
}
