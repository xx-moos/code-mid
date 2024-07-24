import LoadingSpinner from "components/common/LoadingSpinner";
import useOrder from "hooks/useOrder";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Checkout from "redux/models/Checkout";
import { cn } from "utils";

export default function CouponInput({ className }) {
  const { order } = useOrder();
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState();
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponError, setCouponError] = useState(false);

  if (order?.pricing?.discount) return null;

  const handleApplyCoupon = () => {
    setLoadingCoupon(true);
    setCouponError(false);

    if (order?.id)
      dispatch(
        Checkout.types.applyCouponCode({
          code: couponCode,
          callback: () => setLoadingCoupon(false),
          onError: () => setCouponError(true),
        })
      );
  };

  return (
    <>
      <div className={cn("flex gap-2", className)}>
        <input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          type="text"
          name="cupom"
          placeholder="Coupon Code"
          id="cupom"
          className="col-span-2 py-2 px-3 block border w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 sm:text-sm"
        />
        <button
          disabled={loadingCoupon}
          onClick={handleApplyCoupon}
          className="clear-button flex items-center w-40"
        >
          {loadingCoupon && <LoadingSpinner className="text-gray-900" />}
          Apply
        </button>
      </div>
      {couponError && (
        <div className="text-red-500 text-sm">
          Sorry, that coupon is invalid.
        </div>
      )}
    </>
  );
}
