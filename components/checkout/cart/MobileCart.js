import {
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingCartIcon,
} from "@heroicons/react/solid";
import useOrder from "hooks/useOrder";
import Link from "next/link";
import { useState } from "react";
import CouponInput from "./CouponInput";
import TotalValue from "./TotalValue";
import ShippingPrice from "./ShippingPrice";
import RushPrice from "./RushPrice";
import TaxValue from "./TaxValue";

export default function CheckoutMobileBottomPanel() {
  const { order } = useOrder();
  const [expanded, setExpanded] = useState(false);

  if (!order) return null;

  return (
    <div className="sm:hidden bg-white">
      <button
        className="flex w-full gap-2 p-3 text-sm font-bold border-t border-b"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="">Order Total</span>
        <span className="text-green-500">
          <TotalValue />
        </span>
        <span className="absolute right-2 top-2">
          {expanded ? (
            <ChevronDownIcon width={30} />
          ) : (
            <ChevronUpIcon width={30} />
          )}
        </span>
      </button>
      {expanded && (
        <div className="grid gap-3 py-2 px-4 border-b">
          <CouponInput className="text-xs" />
          <div className="flex text-sm items-center gap-1">
            <div className="text-blue-500">
              {order.items.length} {order.items.length > 1 ? "items" : "item"}
            </div>
            <Link href={"/cart"}>
              <a className="link flex-1 flex items-center gap-1 justify-end py-2">
                <ShoppingCartIcon width={20} />
                Go to cart
              </a>
            </Link>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Subtotal</span>
            <span className="">${order.pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-2  text-sm">
            <span className="font-medium">Shipping</span>
            <span>
              <ShippingPrice />
            </span>
          </div>
          <div className="flex justify-between gap-2  text-sm">
            <span className="font-medium">Production</span>
            <span className="">
              <RushPrice />
            </span>
          </div>
          <div className="flex justify-between gap-2  text-sm">
            <span className="font-medium">Tax</span>
            <span className="">
              <TaxValue />
            </span>
          </div>

          {!!order?.pricing?.discount && (
            <div className="flex items-center justify-between font-bold text-green-500 text-sm">
              <span>Discount</span>
              <span>-${order?.pricing?.discount.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
