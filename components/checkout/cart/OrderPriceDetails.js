import LoadingSpinner from "components/common/LoadingSpinner";
import useOrder from "hooks/useOrder";
import TotalValue from "./TotalValue";
import ShippingPrice from "./ShippingPrice";
import RushPrice from "./RushPrice";
import TaxValue from "./TaxValue";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Checkout from "redux/models/Checkout";
import { InformationCircleIcon } from "@heroicons/react/outline";

export default function OrderPriceDetails() {
  const { order } = useOrder();
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState(order.coupon_code);
  const [removeCoupon, setRemoveCoupon] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponError, setCouponError] = useState(false);

  const handleRemoveCoupon = () => {
    setRemoveCoupon(true);
    setCouponError(false);

    if (order?.id)
      dispatch(
        Checkout.types.removeCouponCode({
          code: couponCode,
          callback: () => {
            setRemoveCoupon(false);
            setLoadingCoupon(true);
          },
          onError: () => setCouponError(true),
        })
      );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <dt className="text-sm">Subtotal</dt>
        <dd className="text-sm font-medium text-gray-900">
          ${order?.pricing?.subtotal?.toFixed(2)}
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-sm">
          <span>Shipping</span>
        </dt>
        <dd className="text-sm font-medium text-gray-900">
          <ShippingPrice />
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-sm">
          <span>Production</span>
        </dt>
        <dd className="text-sm font-medium text-gray-900">
          <RushPrice />
        </dd>
      </div>

      <div className="flex items-center justify-between">
        <dt className="text-sm flex items-center">
          <span>Tax</span>
          <a className="tooltips">
            <span className="max-w-[350px] text-sm break-normal">
              Tax includes tax for shipping.<br/>If you are a tax-exempt customer,
              please<br/>email a completed tax exemption certificate
              <br/>to: support@makemyfreshener.com.<br/>Prior purchases made are
              not eligible for<br/>tax exemption or refunds.
            </span>
            <InformationCircleIcon className="h-5 w-5 ml-1 text-gray-500" />
          </a>
        </dt>
        <dd className="text-sm font-medium text-gray-900">
          <TaxValue />
        </dd>
      </div>
      {!!order?.pricing?.discount && (
        <div className="flex items-center justify-between font-bold text-green-600">
          <dt className="text-sm">
            <span>Discount</span>
          </dt>
          <dd className="text-sm">-${order?.pricing?.discount?.toFixed(2)}</dd>
          <button
            disabled={removeCoupon}
            onClick={handleRemoveCoupon}
            className="flex items-center w-40 clear-button"
          >
            {removeCoupon && <LoadingSpinner className="text-gray-900" />}
            Remove
          </button>
        </div>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <dt className="text-base font-medium">Order Total</dt>
        <dd className="text-base font-medium text-gray-900">
          <TotalValue />
        </dd>
      </div>
    </>
  );
}
