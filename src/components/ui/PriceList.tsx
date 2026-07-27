type Price = {
  label?: string;
  price: number;
};

type PriceListProps = {
  prices: Price[];
};

export default function PriceList({ prices }: PriceListProps) {
  return (
    <>
      {prices.length > 1 && (
        <hr className="my-5 border-amber-100" />
      )}

      <div className="space-y-2">
        {prices.map((price) => (
          <div
            key={price.label || "default"}
            className="flex items-center justify-between"
          >
            <span className="text-gray-600">
              {price.label}
            </span>

            <span className="text-xl font-bold text-amber-700">
              {price.price.toFixed(2)} €
            </span>
          </div>
        ))}
      </div>
    </>
  );
}