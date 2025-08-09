interface MoneyProps {
  amount: number;
  currency: string;
}

export const Money = ({ amount, currency }: MoneyProps) => {
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return <span>{formatted}</span>;
};

export default Money;
