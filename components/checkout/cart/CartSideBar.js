import PropTypes from "prop-types";
import SideBarWrapper from "../SideBarWrapper";
import Order from "redux/models/Order";
import { useSelector } from "react-redux";
import { ShoppingCartIcon } from "@heroicons/react/solid";
import CouponInput from "./CouponInput";
import PreviewShipping from "./PreviewShipping";
import OrderPriceDetails from "./OrderPriceDetails";
import CartOrderItem from "./CartOrderItem";

const CartSideBar = ({
  children,
  hideItemsList,
  hideShippingRatePreview,
  className = "",
}) => {
  const order = useSelector((state) => Order.selectors.getOrder(state));

  return (
    <SideBarWrapper>
      {hideItemsList && (
        <div className="flex items-center justify-center py-8 text-lg text-center">
          {order && <p>Order #{order?.id}</p>}
        </div>
      )}
      {!hideItemsList && (
        <div className={className}>
          <span className="flex items-center justify-between px-4 py-4 text-gray-600">
            <h3 className="flex items-center gap-2 text-2xl font-medium">
              <ShoppingCartIcon width={30} className="mt-1" />
              Cart
            </h3>
          </span>
          <ul role="list" className="divide-y divide-gray-200">
            {order?.items?.map((item) => (
              <CartOrderItem key={item.id} item={item} />
            ))}
          </ul>
        </div>
      )}

      {!hideShippingRatePreview && !!order?.items?.length && (
        <PreviewShipping />
      )}

      <div className="px-4 py-4 space-y-6 sm:px-6">
        {order?.id && <OrderPriceDetails />}
        <CouponInput />
      </div>
      {children && (
        <div className="px-4 py-6 border-t border-gray-200 sm:px-6">
          {children}
        </div>
      )}
    </SideBarWrapper>
  );
};

CartSideBar.propTypes = {
  onSubmit: PropTypes.func,
  children: PropTypes.node,
};

export default CartSideBar;
