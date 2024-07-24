import { useState } from "react";
import ShippingSelector from "../shipping/ShippingSelector";
import RushSelector from "./RushSelector";
import { useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";
import useOrder from "hooks/useOrder";
import { InformationCircleIcon } from "@heroicons/react/outline";

export default function CustomShipping({ onSelect, rushId, shipId }) {
  const [rush, setRush] = useState(rushId);
  const [ship, setShip] = useState(shipId);
  const { canHaveRush } = useOrder();
  const rushList = useSelector(Checkout.selectors.getRushList);

  return (
    <div className="mt-3 flex flex-col gap-3">
      {canHaveRush && !!rushList.length && (
        <div>
          <label
            className="flex text-sm font-medium text-gray-700"
            htmlFor="rush"
          >
            Production Time
            <a className="tooltips">
              <span className="max-w-[350px] text-sm break-normal">
                Production time will start the same day<br/>if the order is placed before
                12:00 PM EST.<br/>After 12:00 PM EST, production time will start<br/>the
                following day. Ex. An order with a production<br/>time of 1 business
                day made on 12:01 PM 1/1/24<br/>will be made and shipped on 1/2/24.
                <br/>
                <br/>
                Custom shape and non-US orders only have<br/>a product time of 10 business days
              </span>
              <InformationCircleIcon className="h-5 w-5 ml-1 text-gray-500" />
            </a>
          </label>
          <RushSelector onChange={setRush} value={rush} />
        </div>
      )}

      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="shipping"
        >
          Shipping Speed
        </label>
        <ShippingSelector
          onChange={setShip}
          value={ship}
          isRushSelected={!!+rush}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <div className="text-right">
          <button className="clear-button text-xs" onClick={() => onSelect()}>
            Back
          </button>
        </div>
        <div className="text-right">
          <button
            disabled={!ship}
            className="blue-button text-xs"
            onClick={() => {
              onSelect(ship, rush);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
