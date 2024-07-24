import Main from "components/cart/Main";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Order from "redux/models/Order";
import { useEffect } from "react";
import CartSideBar from "components/checkout/cart/CartSideBar";
import EmptyCart from "components/cart/EmptyCart";
import { trackViewCart } from "utils/googleTag";
import CartItem from "components/cart/CartItem";
import Meta from "components/common/Meta";
import withState from "hocs/withState";
import { ArrowRightIcon } from "@heroicons/react/solid";
import Customer from "redux/models/Customer";
import Checkout from "redux/models/Checkout";

const Cart = () => {
  const dispatch = useDispatch();
  const order = useSelector(Order.selectors.getOrder);
  const customer = useSelector(Customer.selectors.getCustomer);
  const customShape = useSelector(Checkout.selectors.getCustomShape);

  useEffect(() => {
    if (order) {
      dispatch(Order.types.retrieveOrder({ orderId: order?.id }));
    }

    if (!customShape?.id) dispatch(Checkout.types.getShapes());
  }, []);

  useEffect(() => {
    if (order?.id) trackViewCart(order, customer);
  }, [order?.id]);

  useEffect(() => {
    window.onbeforeunload = function (e) {
      dispatch(
        Checkout.types.updateCheckout({
          loadingOrderShippingAndRush: false,
          isShippingQuotesLoading: false,
        })
      );
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  if (!order || order?.items?.length === 0) return <EmptyCart />;

  return (
    <>
      <Meta
        noindex
        title="Shopping Cart for Custom Car Air Fresheners - Make My Freshener"
        description="This is the cart page for Make My Freshener. Review and edit your custom car air fresheners to purchase."
        canonicalLink="https://www.makemyfreshener.com/cart"
      />
      <div className="flex flex-col items-stretch flex-1 px-5 mb-6 -mt-6 lg:flex-row lg:mt-6 lg:p-0">
        <Main>
          {order?.items?.length > 0 && (
            <ul role="list" className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <CartItem item={item} key={item.id} />
              ))}
            </ul>
          )}
        </Main>
        <CartSideBar hideItemsList>
          <Link href={order ? `/checkout/${order.id}` : "/create/shapes"}>
            <a className="items-center w-full blue-button">
              {order ? (
                <>
                  {" "}
                  Checkout <ArrowRightIcon className="w-5 h-5 ml-3 -mr-3" />
                </>
              ) : (
                "Design now"
              )}
            </a>
          </Link>
        </CartSideBar>
      </div>
    </>
  );
};

export default withState(Cart);
