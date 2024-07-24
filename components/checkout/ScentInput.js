import { useState } from "react";
import { useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";
import { cn } from "utils";

export default function ScentInput({
  value,
  onChange,
  className,
  required = true,
  ...props
}) {
  const fragrances = useSelector(Checkout.selectors.getScentsList);
  const [isDirty, setIsDisty] = useState(false);

  return (
    <select
      id="fragrance"
      name="fragrance"
      value={value}
      defaultValue={""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setIsDisty(true)}
      className={cn(
        "mt-1 cursor-pointer py-2 px-3 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500",
        className,
        isDirty && required && "bg-red-50 border-red-500 focus:border-red-500"
      )}
      autoFocus
      {...props}
    >
      <option disabled value="">
        Select a fragrance
      </option>
      {fragrances.map((fragrance) => (
        <option key={fragrance.id} value={fragrance.attribute_id}>
          {fragrance.name}
        </option>
      ))}
    </select>
  );
}
