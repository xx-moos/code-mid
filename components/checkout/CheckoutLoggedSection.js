import Stepper from "components/common/Stepper";
import AddressSection from "./address/AddressSection";
import ShippingSection from "./shipping/ShippingSection";
import CheckoutActions from "./CheckoutActions";
import CheckoutMobileBottomPanel from "./cart/MobileCart";
import { useDispatch, useSelector } from "react-redux";
import useOrder from "hooks/useOrder";
import Checkout from "redux/models/Checkout";
import { useEffect } from "react";
import useAddressSection, {
  AddressSectionProvider,
} from "hooks/useAddressSection";
import useCheckout, { CheckoutProvider } from "hooks/useCheckout";
import PaymentForm from "./payment/PaymentForm";
import { useRouter } from "next/router";
import Customer from "redux/models/Customer";
import { CHECKOUT_ADDRESS } from "constants/address_form_domains";

function CheckoutLoggedSectionContainer() {
  const dispatch = useDispatch();
  const { formVisible, domain } = useAddressSection();
  const selectedLocation = useSelector((state) =>
    Customer.selectors.getCustomerSelectedLocation(state, domain)
  );
  const isShippingQuotesLoading = useSelector(
    Checkout.selectors.getShippingQuotesLoading
  );

  const router = useRouter();
  const { selectedCard, checkoutQuotes, showMore, isAddingCard } =
    useCheckout();
  const { order, isMissingDesign } = useOrder();
  const hasShipping =
    order && order.shipping !== "0.00" && checkoutQuotes?.rates;
  const addressFilled =
    !formVisible && selectedLocation?.id && !selectedLocation?.is_preview;
  const shippingFilled =
    addressFilled && hasShipping && !isShippingQuotesLoading;
  const paymentFilled = shippingFilled && !!selectedCard;
  const steps = {
    Address: addressFilled,
    Shipping: shippingFilled,
    Payment: paymentFilled,
  };
  const isCheckoutDisabled =
    !paymentFilled ||
    !shippingFilled ||
    showMore ||
    isAddingCard ||
    !order?.items?.length;

  useEffect(() => {
    // TODO This approves an order, maybe we should move this to the checkout button
    if (order?.status !== "approved" && !isMissingDesign) {
      dispatch(Checkout.types.checkoutOrder());
    }
  }, [isMissingDesign, order?.status]);

  useEffect(() => {
    if (!order.items.length) router.push("/create/shapes");
  }, []);

  return (
    <>
      <Stepper steps={steps} sticky />
      <div>
        <div className="space-y-8">
          <AddressSection />
          {!!selectedLocation &&
            selectedLocation?.is_preview &&
            !isShippingQuotesLoading && (
              <div className="text-red-500">
                Provide your <b>COMPLETE</b> delivery address prior to
                proceeding, please.
              </div>
            )}
          {steps.Address && <ShippingSection />}
          {steps.Shipping && <PaymentForm />}
          <div className="flex flex-col w-full pt-4 border-t">
            <div className="fixed bottom-0 left-0 z-10 sm:z-0 flex flex-col w-full gap-0 sm:relative sm:flex-row sm:gap-3 shadow-[0px_0px_5px_rgba(0,0,0,0.2)] sm:shadow-none">
              <CheckoutMobileBottomPanel />
              <CheckoutActions disabled={isCheckoutDisabled} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const CheckoutLoggedSection = () => (
  <CheckoutProvider>
    <AddressSectionProvider domain={CHECKOUT_ADDRESS}>
      <CheckoutLoggedSectionContainer />
    </AddressSectionProvider>
  </CheckoutProvider>
);

export default CheckoutLoggedSection;
