import { useEffect } from "react";
import { useRouter } from "next/router";
import EmptyCart from "components/cart/EmptyCart";
import Meta from "components/common/Meta";
import Order from "redux/models/Order";
import { useSelector } from "react-redux";
import withState from "hocs/withState";

const CartIndex = () => {
  const router = useRouter();
  const order = useSelector((state) => Order.selectors.getOrder(state));

  useEffect(() => {
    if (order) {
      router.push(`/cart/${order.id}`);
    }
  }, [order]);

  return (
    <>
      <Meta
        noindex
        title="Shopping Cart for Custom Car Air Fresheners - Make My Freshener"
        description="This is the cart page for Make My Freshener. Review and edit your custom car air fresheners to purchase."
        canonicalLink="https://www.makemyfreshener.com/cart"
      />

      <EmptyCart />
    </>
  );
};

export default withState(CartIndex);
