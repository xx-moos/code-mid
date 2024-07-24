import { BLOCKED_SHIPPING_PROVIDERS, formatService } from "hooks/shippingUtils";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";

export default function ShippingSelector({ onChange, value, isRushSelected }) {
  const quotes = useSelector(Checkout.selectors.getPreviewShippingQuotes);
  const checkoutQuotes = useSelector(Checkout.selectors.getShippingQuotes);
  const rates = (quotes?.rates || checkoutQuotes?.rates || []).filter(
    (r) => r.transit
  );
  const filteredRates = isRushSelected
    ? rates.filter(
        (rate) => !BLOCKED_SHIPPING_PROVIDERS.includes(rate.method.provider)
      )
    : rates;

  useEffect(() => {
    const selectedRate = rates.find((rate) => rate.method.id === +value);
    if (
      isRushSelected &&
      BLOCKED_SHIPPING_PROVIDERS.includes(selectedRate?.method?.provider)
    ) {
      onChange("");
    }
  }, [isRushSelected]);

  return (
    <>
      <select
        value={value}
        id="shipping"
        name="shipping"
        onChange={(e) => onChange(e.target.value)}
        className="py-2 px-3 block border w-full bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 sm:text-sm"
      >
        <option value="" disabled hidden>
          Select Shipping Speed
        </option>
        {filteredRates
          .sort((a, b) => +a?.amount - b?.amount)
          .map((rate, index) => (
            <option key={`rate-${index}`} value={rate.method.id}>
              {rate.transit} ({rate.method.provider} -{" "}
              {formatService(rate.method.service)}) - $
              {(+rate?.amount).toFixed(2)}
            </option>
          ))}
      </select>
    </>
  );
}
