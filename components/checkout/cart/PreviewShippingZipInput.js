import LoadingSpinner from "components/common/LoadingSpinner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";
import Customer from "redux/models/Customer";

function formatAddress(address) {
  return `${address.city} - ${address.state}, ${address.postal_code}, ${address.country}`;
}

export default function PreviewShippingZipInput() {
  const dispatch = useDispatch();
  const selectedLocation = useSelector(
    Customer.selectors.getCustomerSelectedLocation
  );
  const isShippingQuotesLoading = useSelector(
    Checkout.selectors.getShippingQuotesLoading
  );
  const [postalCode, setPostalCode] = useState(
    selectedLocation?.postalCode || ""
  );
  const [editMode, setEditMode] = useState(!selectedLocation);

  useEffect(() => {
    setEditMode(!selectedLocation);
    setPostalCode(selectedLocation?.postal_code || "");
  }, [selectedLocation]);

  return (
    <>
      {!editMode && selectedLocation && (
        <div>
          <div className="flex gap-2 p-2 text-xs leading-tight text-center text-gray-500 rounded-lg bg-slate-100">
            <div className="flex items-center gap-1">
              📍
              <span className="line-clamp-2">
                {formatAddress(selectedLocation)}
              </span>
            </div>
            <button
              onClick={() => {
                setEditMode(true);
                setPostalCode(selectedLocation.postal_code);
              }}
              className="link"
            >
              change
            </button>
          </div>
        </div>
      )}
      {editMode && (
        <form
          className="grid grid-cols-3 gap-2"
          onSubmit={(e) => {
            e.preventDefault();

            dispatch(
              Customer.types.selectPreviewLocation({
                postal_code: postalCode,
                cb: () => setEditMode(false),
              })
            );
          }}
        >
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            name="zip"
            placeholder="Zip/Postal Code"
            autoComplete="postal-code"
            id="zip"
            className="block w-full col-span-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 sm:text-sm"
          />
          <button
            disabled={isShippingQuotesLoading || !postalCode}
            className="flex justify-center w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
          >
            {isShippingQuotesLoading ? (
              <LoadingSpinner className="mr-0 text-gray-800" />
            ) : (
              "ENTER"
            )}
          </button>
        </form>
      )}
    </>
  );
}
