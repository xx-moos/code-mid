import LoadingSpinner from "components/common/LoadingSpinner";
import { useShipping } from "hooks/useShipping";
import { ShippingOption } from "../cart/ShippingListOption";
import { ExclamationIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";

export default function ShippingOptions() {
  const loadingOrderShippingAndRush = useSelector(
    Checkout.selectors.getLoadingOrderShippingAndRush
  );
  const { options, selectShipping } = useShipping();

  if (!Object.values(options).length)
    return (
      <div className="flex gap-2 mt-2 text-xs text-gray-500">
        <ExclamationIcon width={20} className="text-yellow-500" />
        No Shipping options for the selected postal code
      </div>
    );

  return (
    <div className="relative grid gap-2">
      {loadingOrderShippingAndRush && (
        <div className="absolute z-10 flex items-center justify-center w-full h-full">
          <LoadingSpinner className="w-16 h-16 text-gray-800 " />
        </div>
      )}
      {Object.values(options).map((option) => (
        <ShippingOption
          key={`${option.type}-${option.selected}`}
          onSelect={() => selectShipping(option)}
          option={option}
          selected={option.selected}
        />
      ))}
    </div>
  );
}
