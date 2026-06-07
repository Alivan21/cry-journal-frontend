export function formatBalance(value: string, currency: string) {
  const amount = Number.parseFloat(value);

  if (Number.isNaN(amount)) {
    return value;
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
