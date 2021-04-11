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

const getPendingTaxRevenue = ({
  income, // 收入
  exempt, // 优惠
  publicReserveFund, // 公积金汇率
  medicalInsurance, // 养老汇率
  endowmentInsurance, // 其他
}) => {
  const insuranceRate =
    (100 - publicReserveFund - medicalInsurance - endowmentInsurance) / 100;
  return Math.max(0, income * insuranceRate - exempt - startPoint);
};

export function taxesWholeYear(
  {
    income, // 收入
    exempt, // 优惠
    publicReserveFund, // 公积金汇率
    medicalInsurance, // 养老汇率
    endowmentInsurance, // 其他
  },
  hadTaxRevenue = 0,
) {
  const insuranceRate =
    (100 - publicReserveFund - medicalInsurance - endowmentInsurance) / 100;
  const pendingTaxRevenue = getPendingTaxRevenue({
    income,
    exempt,
    publicReserveFund,
    medicalInsurance,
    endowmentInsurance,
  });

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

export function taxesEachMonth({
  income, // 收入
  exempt, // 优惠
  publicReserveFund, // 公积金汇率
  medicalInsurance, // 养老汇率
  endowmentInsurance, // 其他
}) {
  let taxableIncome = 0;
  return Array.from({ length: 12 }, (_, i) => income * i).map(
    (accumulatedIncome) => {
      const insuranceRate =
        (100 - publicReserveFund - medicalInsurance - endowmentInsurance) / 100;

      const pending = Math.max(0, income * insuranceRate - exempt - startPoint);

      taxableIncome += pending;

      const theLevelIndex = taxInfo
        .map((i) => i[0])
        .findIndex((level) => level > taxableIncome);

      const [_, taxRate, discount] = taxInfo[theLevelIndex];

      return Math.max((taxableIncome * taxRate) / 100 - discount, 0);
    },
  );
}
