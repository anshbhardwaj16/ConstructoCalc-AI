export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);

export const materialChartData = (quantities) => [
  { name: "Cement", quantity: quantities?.cement?.quantity || 0 },
  { name: "Steel", quantity: quantities?.steel?.quantity || 0 },
  { name: "Sand", quantity: quantities?.sand?.quantity || 0 },
  { name: "Bricks", quantity: quantities?.bricks?.quantity || 0 }
];

export const costPieData = (result) => [
  { name: "Material", value: result?.materialCost || 0 },
  { name: "Labor", value: result?.laborCost || 0 }
];
