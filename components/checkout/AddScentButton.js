import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";
import Items from "redux/models/Items";
import ScentInput from "./ScentInput";
import LoadingSpinner from "components/common/LoadingSpinner";

export default function AddScentButton({}) {
  const dispatch = useDispatch();
  const strings = useSelector(Checkout.selectors.getStringsList);
  const shapes = useSelector(Checkout.selectors.getShapesList);
  const customShape = useSelector(Checkout.selectors.getCustomShape);
  const selectedShape = useSelector(Checkout.selectors.getSelectedShape);
  const [loading, setLoading] = useState(false);
  const [isInputMode, setIsInputMode] = useState(false);

  const onSave = (scentAttrId) => {
    setLoading(true);

    const defaultStringAttrId = strings.find(
      (s) => s.slug === "white"
    )?.attribute_id;
    const shapeAttrId = [customShape, ...shapes].find(
      (s) => s?.id === selectedShape
    ).attribute_id;
    const minQuantity =
      [customShape, ...shapes].find((s) => s?.id === selectedShape)
        .min_qty_mmf || 50;

    dispatch(
      Items.types.postItems({
        attributes: [
          { id: scentAttrId },
          { id: defaultStringAttrId },
          { id: shapeAttrId },
        ],
        quantity: minQuantity,
        finallyCb: () => {
          setLoading(false);
          dispatch(Checkout.types.refreshShipmentRates());
        },
      })
    );
  };

  return (
    <div className="flex flex-col mb-5 w-full bg-gray-200 bg-opacity-60 p-3 rounded-lg">
      <div className="md:w-1/3">
        <label
          htmlFor="fragrance"
          className="text-sm font-medium text-gray-700"
        >
          {isInputMode ? "Fragrance" : "Add new fragrance"}
        </label>
        {!loading ? (
          <ScentInput
            className="w-full"
            required={false}
            onChange={(value) => {
              onSave(value);
              setIsInputMode(false);
            }}
          />
        ) : (
          <button
            disabled
            className="px-4 clear-button flex items-center py-2 text-sm mt-1 w-full"
          >
            <LoadingSpinner className="text-gray-600" />
            <span>Loading</span>
          </button>
        )}
      </div>
    </div>
  );
}
