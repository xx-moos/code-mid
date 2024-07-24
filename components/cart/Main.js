import PropTypes from "prop-types";
import Link from "next/link";

import Order from "redux/models/Order";
import { useSelector } from "react-redux";
import { ArrowRightIcon } from "@heroicons/react/solid";
import CheckoutMobileBottomPanel from "components/checkout/cart/MobileCart";
import { PlusIcon } from "@heroicons/react/outline";

const Main = ({ children }) => {
  const order = useSelector((state) => Order.selectors.getOrder(state));

  return (
    <>
      <main className="flex-1 h-full justify-center flex mt-10 lg:mt-0">
        <section
          aria-labelledby="primary-heading"
          className="min-w-0 max-w-2xl flex-1 h-full flex flex-col lg:order-last"
        >
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Shopping Cart</h2>
          </div>

          {children}
          {!!order?.items?.length && (
            <div className="w-full mt-12 flex justify-end space-x-5">
              <Link href="/create/shapes">
                <a className="w-full md:w-1/3 clear-button items-center">
                  <PlusIcon className="h-5 w-5 mr-2 -ml-2 -mt-1" /> Design more
                </a>
              </Link>
              <Link href={`/checkout/${order?.id}`}>
                <a className="w-full md:w-1/3 blue-button items-center">
                  Checkout <ArrowRightIcon className="h-5 w-5 -mr-3 ml-3" />
                </a>
              </Link>
            </div>
          )}
        </section>
      </main>
      <div className="flex flex-col w-full pt-4 border-t lg:hidden">
        <div className="fixed bottom-0 left-0 z-10 sm:z-0 flex flex-col w-full gap-0 sm:relative sm:flex-row sm:gap-3 shadow-[0px_0px_5px_rgba(0,0,0,0.2)] sm:shadow-none">
          <CheckoutMobileBottomPanel />
        </div>
      </div>
    </>
  );
};

Main.propTypes = {
  children: PropTypes.node,
};

export default Main;
