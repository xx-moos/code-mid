import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";
import { CartRushGA } from "utils/googleTag";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { cn } from "utils";
import { RUSH_DAYS_MAP } from "hooks/shippingUtils";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function RushSelector({ onChange, value }) {
  const rushList = useSelector(Checkout.selectors.getRushList);

  const handleChangeRush = (rush) => {
    CartRushGA();
    onChange(rush);
  };

  return (
    <>
      <select
        value={value}
        id="rush"
        name="rush"
        onChange={(e) => handleChangeRush(e.target.value)}
        className={cn(
          "py-2 px-3 block border w-full bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 sm:text-sm"
        )}
      >
        <option value={0} defaultChecked>
          10 Business Days (Standard) - $0.00
        </option>
        {rushList.sort((a, b) => (+b?.rate) - (+a?.rate)).map((rush) => (
          <option key={rush.id} value={rush.id}>
            {RUSH_DAYS_MAP[rush.name]} Business{" "}
            {RUSH_DAYS_MAP[rush.name] === 1 ? "Day" : "Days"} - ${rush.rate}
          </option>
        ))}
      </select>
    </>
  );
}
