import { ShippingOption } from "./ShippingListOption";
import { ExclamationIcon } from "@heroicons/react/solid";
import { useShipping } from "hooks/useShipping";

export default function PreviewShippingList() {
  const { options, selectShipping } = useShipping();

  if (!Object.values(options).length)
    return (
      <div className="flex gap-2 mt-2 text-xs text-gray-500">
        <ExclamationIcon width={20} className="text-yellow-500" />
        No Shipping options for the selected postal code
      </div>
    );

  return (
    <div className="flex flex-col gap-1">
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
