import ShippingOptions from "./ShippingOptions";
import { useShipping } from "hooks/useShipping";
import { getCustomOption } from "hooks/shippingUtils";
import CustomShipping from "../cart/CustomShipping";
import useCheckout from "hooks/useCheckout";
import { useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";
import LoadingSpinner from "components/common/LoadingSpinner";

export default function ShippingSection() {
  const {
    rushOptions,
    checkoutQuotes,
    selectedRushId,
    selectedShipId,
    showMore,
    setShowMore,
  } = useCheckout();
  const isShippingQuotesLoading = useSelector(
    Checkout.selectors.getShippingQuotesLoading
  );
  const loadingOrderShippingAndRush = useSelector(
    Checkout.selectors.getLoadingOrderShippingAndRush
  );

  const { selectShipping, options } = useShipping();

  const onSelectCustom = async (shipId, rushId) => {
    setShowMore(false);

    if (!shipId && !rushId) return;
    const optFound = Object.values(options).find(
      (opt) => opt.id === +shipId && opt.rushId === +rushId
    );
    if (optFound) {
      await selectShipping(optFound);
    } else {
      const rate = checkoutQuotes.rates.find(
        (rate) => rate.method.id === +shipId
      );
      const rush = rushOptions.find((rush) => rush.id === +rushId);
      const option = getCustomOption(rate, rush);
      await selectShipping(option);
    }
  };

  return (
    <div>
      <div className="text-xl font-medium text-gray-900">
        <div className="flex justify-between my-3">Shipping & Production</div>
      </div>

      <div className="grid grid-cols-1 gap-y-2">
        {checkoutQuotes?.rates?.length === 0 && (
          <div>
            <span className="text-gray-500">
              Shipping is not available to the selected location
            </span>
          </div>
        )}
        {isShippingQuotesLoading && (
          <div>
            <span className="text-gray-500 animate-pulse">Loading...</span>
          </div>
        )}
        {!checkoutQuotes?.rates && !isShippingQuotesLoading && (
          <div>
            <span className="text-gray-500">
              Provide your delivery address prior to proceeding, please.
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {checkoutQuotes?.rates && !showMore && <ShippingOptions />}
        </div>

        {showMore && !loadingOrderShippingAndRush && (
          <CustomShipping
            onSelect={onSelectCustom}
            rushId={selectedRushId}
            shipId={selectedShipId}
          />
        )}
        {checkoutQuotes?.rates && !showMore && !loadingOrderShippingAndRush && (
          <button
            className="mt-3 text-right link"
            onClick={() => setShowMore(true)}
          >
            show more options
          </button>
        )}
      </div>
    </div>
  );
}
