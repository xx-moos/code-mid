import { getDeliveryDate, getShipByDate, isAfter1PM } from "utils/date";

export function ShippingOption({ option, selected, onSelect }) {
  const prodDays = isAfter1PM() ? option.prodDays + 1 : option.prodDays;
  return (
    <div
      className="text-sm text-gray-800 relative flex flex-col mt-3 p-2 rounded-lg bg-white border-gray-400 border cursor-pointer hover:bg-gray-100"
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <input type="radio" checked={selected} onChange={() => {}} />
          <span>{option.type}</span>
        </div>
        <span className="flex items-center">
          <b>$ {option.amount.toFixed(2)}</b>
        </span>
      </div>
      <div className="flex flex-col mt-1">
        <div className="flex justify-between text-[11px]">
          <div className="flex">
            <span>
              Production Time: {prodDays} business{" "}
              {option.prodDays === 1 ? "day" : "days"}
            </span>
          </div>
          <span className="text-right">
            Ship by{" "}
            <span>{getShipByDate(option.prodDays).format("MMM DD")}</span>
          </span>
        </div>
        <div className="grid grid-cols-2 text-[11px] justify-between">
          <span
            className="text-[11px] truncate"
            title={`Shipping: ${option.provider} - ${option.service}`}
          >
            Shipping: {option.provider} - {option.service}
          </span>
          <span className="text-green-600 text-right">
            {option.days === 0
              ? "No arrival date provided"
              : `Est. delivery by ${getDeliveryDate(
                  option.days,
                  option.prodDays
                ).format("MMM DD")}`}
          </span>
        </div>
      </div>
    </div>
  );
}
