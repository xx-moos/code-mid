import LoadingSpinner from "components/common/LoadingSpinner";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";
import Order from "redux/models/Order";
import { IncompleteItemsModal } from "./IncompleteItemsModal";
import Link from "next/link";
import { removeCartOrder } from "utils/storage";
import Customer from "redux/models/Customer";
import { trackOrder } from "utils/googleTag";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "config/stripeConfig";
import { pay } from "services/PaymentService";
import { toast } from "react-toastify";

const CheckoutActionsContent = ({ disabled }) => {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const order = useSelector(Order.selectors.getOrder);
  const card = useSelector(Checkout.selectors.getSelectedCard);
  const customer = useSelector(Customer.selectors.getCustomer);
  const router = useRouter();
  const [incompleteItems, setIncompleteItems] = useState(false);
  const isLoading = useSelector(
    Checkout.selectors.getCompleteOrderPaymentLoading
  );

  const isDisabled = disabled || isLoading;

  const handleCheckout = async () => {
    if (
      order?.items?.some(
        ({ design }) => !design?.front_proof || !design?.back_proof
      )
    ) {
      setIncompleteItems(true);
      return;
    }
    try {
      await pay(stripe, order, card, dispatch);
      removeCartOrder();
      trackOrder(order, customer);
      router.push(`/order/confirmation/${order?.id}`);
    } catch (e) {
      toast.error(e.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full bg-white sm:bg-transparent">
        <div className="my-2 text-xs flex w-full justify-center gap-1 text-gray-500">
          By completing this order you agree to our{" "}
          <Link href={"/terms"}>
            <a className="text-xs link-inline">Terms & Conditions</a>
          </Link>
        </div>
        <button
          className="flex-1 py-3 text-center rounded-none blue-button sm:rounded-md sm:py-2"
          type="button"
          disabled={isDisabled}
          onClick={handleCheckout}
        >
          {isLoading && <LoadingSpinner />}
          Checkout
        </button>
      </div>
      {incompleteItems && (
        <IncompleteItemsModal onClose={() => setIncompleteItems(false)} />
      )}
    </>
  );
};

const CheckoutActions = (props) => (
  <Elements stripe={stripePromise} options={{ locale: "en" }}>
    <CheckoutActionsContent {...props} />
  </Elements>
);

export default CheckoutActions;
