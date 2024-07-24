import PreviewShippingList from "./PreviewShippingList";
import { AutocompleteProvider } from "hooks/useAddressAutocomplete";
import { ExclamationIcon } from "@heroicons/react/solid";
import PreviewShippingZipInput from "./PreviewShippingZipInput";
import { useMemo, useState } from "react";
import Checkout from "redux/models/Checkout";
import { useSelector } from "react-redux";
import { getCustomOption } from "hooks/shippingUtils";
import CustomShipping from "./CustomShipping";
import { useShipping } from "hooks/useShipping";
import useCheckout from "hooks/useCheckout";

export default function PreviewShipping() {
  const [showMore, setShowMore] = useState();
  const { selectedRushId, selectedShipId } = useCheckout();
  const { options, selectShipping } = useShipping();
  const previewQuotes = useSelector(
    Checkout.selectors.getPreviewShippingQuotes
  );
  const isShippingQuotesLoading = useSelector(
    Checkout.selectors.getShippingQuotesLoading
  );
  const checkoutQuotes = useSelector(Checkout.selectors.getShippingQuotes);

  const rates = useMemo(() => {
    return previewQuotes?.rates?.length
      ? previewQuotes?.rates
      : checkoutQuotes?.rates;
  }, [previewQuotes, checkoutQuotes]);
  const rushOptions = useSelector(Checkout.selectors.getRushList);

  const onSelectCustom = async (shipId, rushId) => {
    setShowMore(false);

    if (!shipId && !rushId) return;
    const optFound = Object.values(options).find(
      (opt) => opt.id === +shipId && opt.rushId === +rushId
    );
    if (optFound) {
      await selectShipping(optFound);
    } else {
      const rate = rates.find((rate) => rate.method.id === +shipId);
      const rush = rushOptions.find((rush) => rush.id === +rushId);
      const option = getCustomOption(rate, rush);
      await selectShipping(option);
    }
  };

  return (
    <>
      <AutocompleteProvider>
        <div className="flex flex-col gap-2 px-4 py-4 border-t border-b border-gray-200 sm:px-6">
          <h1 className="mb-2 text-sm font-medium">Shipping & Production</h1>
          <PreviewShippingZipInput />
          {rates?.length === 0 && !isShippingQuotesLoading && (
            <span className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <ExclamationIcon width={20} className="text-red-500" />
              Shipping not available for this postal code
            </span>
          )}
          {isShippingQuotesLoading && (
            <div className="flex flex-col gap-3 mt-4 animate-pulse">
              <div className="w-full h-20 bg-gray-300 rounded-lg"></div>
              <div className="w-full h-20 bg-gray-300 rounded-lg"></div>
              <div className="w-full h-20 bg-gray-300 rounded-lg"></div>
            </div>
          )}
          {!!rates?.length && !isShippingQuotesLoading && (
            <>
              {!showMore ? (
                <>
                  <PreviewShippingList />
                  <button
                    className="mt-3 text-right link"
                    onClick={() => setShowMore(true)}
                  >
                    show more options
                  </button>
                </>
              ) : (
                <CustomShipping
                  onSelect={onSelectCustom}
                  rushId={selectedRushId}
                  shipId={selectedShipId}
                />
              )}
            </>
          )}
        </div>
      </AutocompleteProvider>
    </>
  );
}
